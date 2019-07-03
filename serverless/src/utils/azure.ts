import axios from "axios";
import * as querystring from "querystring";

const endpoint = process.env.AZURE_ENDPOINT;
const subscriptionKey = process.env.AZURE_KEY;

export const getEmotions = (imageURL, key) => {
  const request = imageURL => ({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": key
    },
    url:
      endpoint +
      "/detect?" +
      querystring.stringify({
        returnFaceId: true,
        returnFaceLandmarks: false,
        returnFaceAttributes:
          "age,gender,emotion,smile,facialHair,glasses,makeup,accessories",
        recognitionModel: "recognition_01",
        returnRecognitionModel: false
      }),
    data: JSON.stringify({ url: imageURL })
  });

  return axios(request(imageURL))
    .then(x => x.data)
    .catch(err => {
      console.log(key);
      if (key === process.env.AZURE_KEY_2) {
        throw new Error(err);
      } else return getEmotions(imageURL, process.env.AZURE_KEY_2);
    });
};

export const detectSimilar = ids =>
  axios({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    },
    url: endpoint + "/findsimilars",
    data: JSON.stringify({ faceids: ids })
  }).then(x => x.data);
