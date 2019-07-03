import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { invokeLambda } from "./utils/aws";
import * as R from "ramda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const table = process.env.STATE_TABLE;

const filterObject = R.curry((f, obj) =>
  R.mergeAll(
    R.filter(key => f(R.prop(key, obj), key), R.keys(obj)).map(key => ({
      [key]: obj[key]
    }))
  )
);

const strongestEmotions = R.compose(
  R.map(x => ({ name: R.head(R.keys(x)), value: R.head(R.values(x)) })),
  R.map(filterObject(R.gt(R.__, 0.8))),
  R.filter(emot => R.any(R.gt(R.__, 0.8), R.values(R.dissoc("neutral", emot))))
);

const pickRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const decideOnMessage = (messages, emotions, lastEmotions) => {
  const latestStrongEmotion = pickRandom(strongestEmotions(lastEmotions));

  const emotionMessages = R.compose(
    R.reduce((a, b) => ({ ...a, [b.name]: b.messages }), {}),
    R.filter(x => x.messages.length > 0)
  )(emotions);

  return Promise.resolve()
    .then(() =>
      dynamoDb
        .get({ TableName: table, Key: { state: "message-state" } })
        .promise()
    )
    .then(ret => ret.Item)
    .then(({ last }) => {
      const mainMessages = messages.filter(
        x =>
          !last
            .slice(0, 2)
            .map(y => y.id)
            .includes(x.id)
      );
      const toChooseFrom = [
        ...mainMessages,
        ...(latestStrongEmotion && latestStrongEmotion.name
          ? emotionMessages[latestStrongEmotion.name]
          : [])
      ];
      const chosen = pickRandom(toChooseFrom);

      return dynamoDb
        .put({
          TableName: table,
          Item: {
            state: "message-state",
            last: [...last, chosen].slice(0, 5)
          }
        })
        .promise()
        .then(x => chosen);
    });
};

const getMessage: APIGatewayProxyHandler = async (_event, _context) => {
  return Promise.resolve()
    .then(() =>
      dynamoDb.get({ TableName: table, Key: { state: "app-state" } }).promise()
    )
    .then(ret => {
      return invokeLambda(
        { length: 10 },
        `sls-emotion-detection-${process.env.STAGE}-images`,
        require("./images").default
      ).then((x: { appState: AppState; images: Image[] }) => ({
        appState: ret.Item.data,
        images: x
      }));
    })
    .then(({ appState, images }) =>
      decideOnMessage(
        appState.visual.messages,
        appState.visual.emotions,
        images.map(x => x.azure_data.faceAttributes.emotion)
      )
    )
    .catch(error => ({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(error.message)
    }))
    .then(ret => ({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(ret, null, 2)
    }));
};

export default getMessage;
