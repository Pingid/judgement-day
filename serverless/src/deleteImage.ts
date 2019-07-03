import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Prisma } from "../prisma-client";

const prisma = new Prisma({});

const deleteImage: APIGatewayProxyHandler = async (event, _context) => {
  const { imagekey } = JSON.parse(event.body);

  const s3 = new AWS.S3();

  const params = {
    TableName: process.env.FACES_TABLE,
    Key: { imagekey }
  };

  return Promise.all([
    prisma.deleteImage({ imagekey }),
    s3.deleteObject({ Key: imagekey, Bucket: process.env.BUCKET }).promise()
  ])
    .then(x => ({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(x)
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

export default deleteImage;
