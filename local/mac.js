const axios = require('axios');
const NodeWebcam = require("node-webcam");
const { ENDPOINT } = require('../env.json');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp')

const opts = {
  quality: 100,
  delay: 0,
  saveShots: true, //Save shots in memory
  output: "png",
  // device: false,
  callbackReturn: "base64",
  //Logging
  verbose: false
};


const getCameras = (pt) => new Promise((resolve, reject) => {
  const Webcam = NodeWebcam.create();
  Webcam.list(function (list) {
    resolve(list.map(camName => NodeWebcam.create({ ...pt, device: camName })))
  });
})



const sleep = (n, data = null) => new Promise((resolve, reject) => { setTimeout(() => resolve(data), n) })

const captureImage = (cam, name) => new Promise((resolve, reject) => cam.capture(name, (err, data) => err ? reject(err) : resolve(data)))

const main = () => getCameras(opts)
  .then(cameras => Promise.all(cameras.map((camera, i) => captureImage(camera, `pic_${i}`))))
  .then(base64 => Promise.all(base64.map(image => axios.post(`${require('../env.json').ENDPOINT}uploadImage`, { image }))))

main();
