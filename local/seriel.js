// ls /dev/tty.*
// https://github.com/jthawme/SimpleSerial

const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('/dev/cu.usbmodem14101')
const parser = new Readline()
port.pipe(parser)
parser.on('data', console.log)
// port.write('ROBOT PLEASE RESPOND\n')

port.write('foo:bar;test:nothing;str:hello;num:5;\n', (err) => {
  if (err) {
    return console.log('Error on write: ', err.message);
  }
  console.log('message written');
});
