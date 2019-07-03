const ws281x = require('rpi-ws281x-native');

// Constants
const NUM_LEDS = parseInt(process.argv[2], 10) || 8;
let pixelData = new Uint32Array(NUM_LEDS);
const brightness = 128;

const signals = { 'SIGINT': 2, 'SIGTERM': 15 };

// Utils
const lightsOff = function () {
  for (var i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = color(0, 0, 0);
  }
  ws281x.render(pixelData);
  ws281x.reset();
}

function shutdown(signal, value) {
  console.log('Stopped by ' + signal);
  lightsOff();
  process.nextTick(function () { process.exit(0); });
}

// generate rainbow colors accross 0-255 positions.
// function wheel(pos) {
//   pos = 255 - pos;
//   if (pos < 85) { return color(255 - pos * 3, 0, pos * 3); }
//   else if (pos < 170) { pos -= 85; return color(0, pos * 3, 255 - pos * 3); }
//   else { pos -= 170; return color(pos * 3, 255 - pos * 3, 0); }
// }

// generate integer from RGB value
function color(r, g, b) {
  r = r * brightness / 255;
  g = g * brightness / 255;
  b = b * brightness / 255;
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

// const lights = (offset) => {
//   for (var i = 0; i < NUM_LEDS; i++) {
//     pixelData[i] = wheel(((i * 256 / NUM_LEDS) + offset) % 256);
//   }
//   offset = (offset + 1) % 256;
//   ws281x.render(pixelData);
// }

const runningLine = (offset, length) => {
  const limitedOffset = offset % pixelData.length
  for (var i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = (i > limitedOffset && i < limitedOffset + length) ? color(255, 0, 0) : color(0, 0, 0);
  }
  console.log('last')
  ws281x.render(pixelData);
  console.log('probbably not last')
}

// Initialise
// process.on('SIGINT', () => { shutdown(); process.exit() });
ws281x.init(NUM_LEDS);

let acc = 0;
const loop = () => setTimeout(() => {
  console.log(acc)
  acc += 1;
  setTimeout(() => runningLine(acc, 4), 0)
  loop();
}, 1000 / 30)


loop()
