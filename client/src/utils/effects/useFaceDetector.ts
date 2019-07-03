import * as React from "react";
import uploadImage from "../uploadImage";

const checkWindowStatus = (): void => {
  // @ts-ignore
  if (!navigator.getUserMedia) {
    alert("No webcam!");
    return;
  }

  // @ts-ignore
  if (!typeof window.FaceDetector === "undefined") {
    alert("No face detection!");
    return;
  }
};

const setupWebcam = videoElem =>
  new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    // @ts-ignore
    navigator.getUserMedia =
      navigator.getUserMedia ||
      // @ts-ignore
      navigatorAny.webkitGetUserMedia ||
      // @ts-ignore
      navigatorAny.mozGetUserMedia ||
      // @ts-ignore
      navigatorAny.msGetUserMedia;
    const adjustVideoSize = (width, height) => {
      const aspectRatio = width / height;
      if (width >= height) {
        videoElem.width = aspectRatio * videoElem.height;
      } else if (width < height) {
        videoElem.height = videoElem.width / aspectRatio;
      }
    };
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: true },
        stream => {
          videoElem.srcObject = stream;
          videoElem.addEventListener(
            "loadeddata",
            () => {
              adjustVideoSize(videoElem.videoWidth, videoElem.videoHeight);
              resolve();
            },
            false
          );
        },
        error => {
          reject();
        }
      );
    } else {
      reject();
    }
  });

const useChromeFaceDetector = () => {
  const [detector, setdetector] = React.useState(null);
  React.useEffect(() => {
    if (!detector) {
      // @ts-ignore
      if (!typeof window.FaceDetector === "undefined") {
        alert("No face detection!");
        return null;
      } else {
        // @ts-ignore
        setdetector(new window.FaceDetector());
      }
    }
  }, [detector]);
  return detector;
};

const useCanvas = canvasElem => {
  const [ctx, setctx] = React.useState<CanvasRenderingContext2D>(null);

  React.useEffect(() => {
    if (!ctx && canvasElem) {
      const context = canvasElem.getContext("2d");
      setctx(context);
    }
  }, [canvasElem, ctx]);

  return ctx;
};

const useFaceDetector = (videoRef, canvasRef) => {
  const [isSetup, setisSetup] = React.useState(false);
  const [message, setmessage] = React.useState<string>("");
  const [fetching, setfetching] = React.useState<boolean>(false);
  const detector = useChromeFaceDetector();
  const ctx = useCanvas(canvasRef.current);

  React.useEffect(() => {
    if (videoRef.current && ctx && detector) {
      videoRef.current.width = window.innerWidth;
      videoRef.current.height = window.innerHeight;
      setupWebcam(videoRef.current).then(() => setisSetup(true));
    }
  }, [videoRef, ctx, detector]);

  const upload = () => {
    setmessage("");
    setfetching(true);
    canvasRef.current.width = videoRef.current.width;
    canvasRef.current.height = videoRef.current.height;
    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    detector.detect(canvasRef.current).then(fcs => {
      if (fcs.length < 1) return setmessage("No faces present");
      return uploadImage(canvasRef.current.toDataURL("image/png"))
        .then(() => {
          setfetching(false);
          setmessage("Successfully uploaded image");
        })
        .catch(() => {
          setfetching(false);
          setmessage("Error uploading image");
        });
    });
  };

  return { isSetup, upload, message, fetching };
};

export default useFaceDetector;
