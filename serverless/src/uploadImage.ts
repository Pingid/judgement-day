import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { invokeLambda } from "./utils/aws";

const upload: APIGatewayProxyHandler = async (event, _context) => {
  const { image } = JSON.parse(event.body);

  const base64 = image.replace(/^data:image\/(png|jpg);base64,/, "");

  const s3 = new AWS.S3();
  const buffer = Buffer.from(base64, "base64");

  const key = `${process.env.RAW_IMAGES}/${new Date().toISOString()}.png`;

  return (
    Promise.resolve()
      .then(() =>
        s3
          .putObject({ Bucket: process.env.BUCKET, Key: key, Body: buffer })
          .promise()
      )
      .then(() =>
        invokeLambda(
          {},
          `sls-emotion-detection-${process.env.STAGE}-processImages`,
          require("./processImages").default
        )
      )
      // .then(() =>
      //   invokeLambda(
      //     {},
      //     `sls-emotion-detection-${process.env.STAGE}-resolveDatabase`,
      //     require("./resolveDatabase").default
      //   )
      // )
      .then(() => ({
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          link: `https://s3.eu-west-2.amazonaws.com/${
            process.env.BUCKET
          }/${key}`
        })
      }))
  );
};

export default upload;
