# Judgment Day

The code files for an installation which tracks the emotions of visitors by running photos of people faces through Microsofts Machine learning API. The project is made up of three parts; the serverless folder contains functions to interace with the database and storage; the local folder contains code to be run on a rasberry PI with a camera; and the client folder contains a web app with a control panel and visualisation of the data.

## Serverless

To deploy the functions install the serverless framework, authenticate with AWS and once in the folder run `serverless deploy`.

### Serverless API

| function        | endpoint                                         | description            |
| --------------- | ------------------------------------------------ | ---------------------- |
| uploadImage     | [POST] /uploadImage - { image: <base64> }        | Uploads base64 encoded |
| deleteImage     | [POST] /deleteImage - { imagekey: <s3 Key> }     |                        |
| getImageData    | [GET][post]/getImageData ?- { keys: [<s3 KEY>] } |                        |
| resolveDatabase | [GET] /resolveDatabase                           |                        |
| updateAppState  |                                                  |                        |
| getAppState     | [GET] /getAppState?state=local                   |                        |

- [POST] /uploadImage - { image: <base64> }

- [POST] /deleteImage - { imagekey: <s3 Key> }

- [GET] /getAppState?state=local

- [GET] /resolveDatabase

  

### Raspberry Pi

1. Flash operating system from https://www.raspberrypi.org/downloads/raspbian/ using etcher
2. Add an file named ssh to the root folder
3. Plug in and find IP `arp -a`
4. SSH into raspberry pi `ssh pi@<IP>` password `raspberry`
5. Install dependancies`sudo apt-get update; sudo apt-get install vim-runtime; sudo apt-get install vim; sudo apt-get install git; curl -sL https://deb.nodesource.com/setup_11.x | bash -; sudo apt-get install -y nodejs npm node-semver;`
6. Write Start file `echo "echo $1; sudo rm -R judgement-day-rasberry-pi; git clone https://github.com/Pingid/judgement-day-rasberry-pi.git; cd ./judgement-day-rasberry-pi; yarn install; echo $1 > test.cool; node index.js $1 &" > start.sh`
7. Run start script on boot `sudo nano /etc/rc.local`
8. copy pi.js via ssh `scp pi.js pi@192.168.1.2:/home/pi/judgment-day`
9. run `node pi.js`

```
echo "cd /home/pi; sudo rm -R judgement-day-rasberry-pi; git clone https://github.com/Pingid/judgement-day-rasberry-pi.git; cd ./judgement-day-rasberry-pi; npm install; node index.js --name=one &" > start.sh
```

```
sudo apt-get install python3-picamera;
```
