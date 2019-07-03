import { APIGatewayProxyHandler } from "aws-lambda";
import eventArgs from "./utils/eventArgs";
import { Prisma } from "../prisma-client";
import * as AWS from "aws-sdk";

const getImageData: APIGatewayProxyHandler = async (event, _context) => {
  const data = eventArgs(event, ["length", "keys", "originals"]);
  const length = parseInt(data.length) || 1000;

  const prisma = new Prisma();

  // const dynamoDb = new AWS.DynamoDB.DocumentClient();
  // return dynamoDb
  //   .scan({ TableName: process.env.FACES_TABLE })
  //   .promise()
  const images = await prisma.images({
    orderBy: "pictured_at_DESC",
    first: length
  });
  return Promise.resolve(images).then(x => ({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(x)
  }));
};

export default getImageData;
