import { APIGatewayProxyHandler } from "aws-lambda";

const generateEmotion = () => {
  const emotions = [
    "anger",
    "contempt",
    "disgust",
    "fear",
    "happiness",
    "neutral",
    "sadness",
    "surprise"
  ];
  const n = Math.floor(Math.random() * 8);
  return emotions
    .map((x, i) => ({ [x]: n === i ? 1 : 0 }))
    .reduce((a, b) => ({ ...a, ...b }));
};

const getRandom = () => ({
  azure_data: {
    faceAttributes: {
      accessories: [],
      age: Math.random() * 30 + 20,
      emotion: generateEmotion(),
      facialHair: { beard: 0.1, sideburns: 0.1, moustache: 0.1 },
      gender: ["male", "female"][Math.floor(Math.random() * 2)],
      glasses: ["NoGlasses", "ReadingGlasses"][Math.floor(Math.random() * 1.3)],
      makeup: {
        lipMakeup: Math.floor(Math.random() * 1.5) > 0,
        eyeMakeup: Math.floor(Math.random() * 1.3) > 0
      },
      smile: Math.random()
    },
    faceId: "f7d0913e-5b02-4536-8c13-80f481891831",
    faceRectangle: { width: 262, top: 623, left: 0, height: 320 }
  },
  imagekey: "cropped-processed/2019-06-09T16:31:58.666Z.png"
});

const getImageData: APIGatewayProxyHandler = async (event, _context) => {
  const length =
    (event &&
      event.queryStringParameters &&
      event.queryStringParameters.length &&
      parseInt(event.queryStringParameters.length)) ||
    100;

  const moc = Array.from(new Array(length)).map(x => getRandom());
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(moc)
  };
};

export default getImageData;
