import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Prisma } from "../prisma-client";

const prisma = new Prisma({});

const resolveDatabase: APIGatewayProxyHandler = async (_event, _context) => {
  const s3 = new AWS.S3();

  return prisma
    .images()
    .then(database_items => {
      return s3
        .listObjects({
          Bucket: process.env.BUCKET,
          Prefix: process.env.CROPPED_IMAGES
        })
        .promise()
        .then(s3_images => {
          const existingImageKeys = s3_images.Contents.map(x => x.Key);
          const existingDatabaseKeys = database_items.map(x => x.imagekey);

          const toDeleteFromDatabase = database_items.filter(
            x => !existingImageKeys.includes(x.imagekey)
          );
          const toDeleteImages = s3_images.Contents.filter(
            x => !existingDatabaseKeys.includes(x.Key)
          );

          return Promise.all([
            Promise.all(
              toDeleteFromDatabase.map(item =>
                prisma.deleteImage({ imagekey: item.imagekey })
              )
            ),
            Promise.all(
              toDeleteImages.map(item =>
                s3
                  .deleteObject({ Key: item.Key, Bucket: process.env.BUCKET })
                  .promise()
              )
            )
          ]);
        });
    })
    .then(data => ({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data)
    }))
    .catch(err => {
      console.log(err);
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(err.message)
      };
    });
};

export default resolveDatabase;
