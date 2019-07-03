import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as Jimp from "jimp";
import { getEmotions } from "./utils/azure";
import { Prisma } from "../prisma-client";

const prisma = new Prisma();

interface Azure {
  faceAttributes: object;
}

const crop = (buffer, config) =>
  Jimp.read(buffer)
    .then(image =>
      image.crop(config.left, config.top, config.width, config.height)
    )
    .then(image => image.getBufferAsync(Jimp.MIME_PNG));

const saveToDatabase = (data: {
  key: string;
  data: Azure;
  source_key: string;
}) => {
  return prisma.createImage({
    pictured_at: new Date().toISOString(),
    imagekey: data.key,
    azure_data: data.data,
    source_key: replacePrefix(data.source_key, process.env.PROCESSED_RAW_IMAGES)
  });
};

const deleteImage = (s3, { bucket, key }) =>
  s3.deleteObject({ Key: key, Bucket: bucket }).promise();

const replacePrefix = (key, prefix) =>
  key.replace(
    /.*?([^\/]{1,}\.[a-zA-Z]{2,3})/gim,
    (_, name) => prefix + "/" + name
  );

const moveImage = (s3, toPrefix, { bucket, key }) =>
  s3
    .copyObject({
      Bucket: bucket,
      CopySource: "/" + bucket + "/" + key,
      Key: replacePrefix(key, process.env.PROCESSED_RAW_IMAGES)
    })
    .promise();

const cropImages = (
  s3,
  key,
  faces
): Promise<{ data: Azure; key: string; source_key: string }> => {
  return s3
    .getObject({ Bucket: process.env.BUCKET, Key: key })
    .promise()
    .then(res =>
      Promise.all(
        faces.map(face =>
          crop(res.Body, face.faceRectangle)
            .then(buffer => {
              const newKey = `${
                process.env.CROPPED_IMAGES
              }/${new Date().toISOString()}.png`;
              return s3
                .upload({
                  Bucket: process.env.BUCKET,
                  Key: newKey,
                  Body: buffer
                })
                .promise()
                .then(() => newKey);
            })
            .then(newKey => ({ source_key: key, key: newKey, data: face }))
        )
      )
    );
};

const processImages: APIGatewayProxyHandler = () => {
  const s3 = new AWS.S3();

  // Get all images in to-process folder
  return s3
    .listObjects({ Bucket: process.env.BUCKET, Prefix: process.env.RAW_IMAGES })
    .promise()
    .then(ret =>
      Promise.all(
        ret.Contents.map(item => {
          // Every Image in the RAW_IMAGE bucket
          const imageURL = `https://s3.eu-west-2.amazonaws.com/${
            process.env.BUCKET
          }/${item.Key}`;

          // Send to Azure
          return getEmotions(imageURL, process.env.AZURE_KEY_1).then(res => {
            // If no faces come back delete image
            if (res.length < 1)
              return deleteImage(s3, {
                key: item.Key,
                bucket: process.env.BUCKET
              });

            // Crop images
            return (
              cropImages(s3, item.Key, res)
                .then(cropped =>
                  // copy image into processed bucket
                  moveImage(s3, process.env.PROCESSED_RAW_IMAGES, {
                    bucket: process.env.BUCKET,
                    key: item.Key
                  })
                    // delete original image
                    .then(() =>
                      deleteImage(s3, {
                        key: item.Key,
                        bucket: process.env.BUCKET
                      })
                    )
                    .then(() => cropped)
                )
                // Save data to dynamoDB
                .then(cropped =>
                  Promise.all(cropped.map(saveToDatabase)).then(() => cropped)
                )
            );
          });
        })
      )
    )
    .then(x => ({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(x)
    }))
    .catch(x => {
      console.log(x);
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(x.data)
      };
    });
};

export default processImages;
