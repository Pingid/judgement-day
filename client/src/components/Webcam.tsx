import * as React from "react";

import useFaceDetector from "../utils/effects/useFaceDetector";

const App: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { fetching, upload, message } = useFaceDetector(videoRef, canvasRef);

  return (
    <div
      style={{
        width: "100%",
        height: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2rem",
        zIndex: -2
      }}
    >
      <video
        ref={videoRef}
        onClick={upload}
        autoPlay
        playsInline
        muted
        style={{ display: fetching ? "none" : "inline-block" }}
      />
      <canvas ref={canvasRef} id="canvas" style={{ display: "none" }} />
    </div>
  );
};

export default App;
