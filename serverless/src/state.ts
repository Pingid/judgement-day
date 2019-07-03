import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default async event => {
  const { data } = event.body ? JSON.parse(event.body) : { data: null };
  const table = process.env.STATE_TABLE;

  return Promise.resolve()
    .then(() =>
      data
        ? dynamoDb
            .put({ TableName: table, Item: { state: "app-state", data } })
            .promise()
        : null
    )
    .then(() =>
      dynamoDb.get({ TableName: table, Key: { state: "app-state" } }).promise()
    )
    .then(ret => ({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(ret.Item.data)
    }));
};
