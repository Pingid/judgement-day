import { useEffect } from "react";

interface settings {
  width: number;
  height: number;
  scaleFactor: number;
}

type Arguments = <T, K>(
  ref: React.RefObject<HTMLCanvasElement>,
  settings,
  sketch: {
    setup: (x: CanvasRenderingContext2D, y: settings, z?: T) => K;
    draw: (x: CanvasRenderingContext2D, y: settings, z?: K | T) => void;
    stop?: () => void;
  },
  T
) => void;

const useCanvas: Arguments = (ref, { width, height, scaleFactor }, sketch) => {
  useEffect(() => {
    let requestId;
    const canvas = ref.current;

    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");

    ctx.scale(scaleFactor, scaleFactor);

    sketch.setup(ctx, { width, height, scaleFactor });

    // Animation & Looping
    const loop = () => {
      requestId = undefined;

      sketch.draw(ctx, { width, height, scaleFactor });

      start();
    };

    const start = () => {
      if (!requestId) {
        requestId = window.requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      if (sketch.stop) {
        sketch.stop();
      }
      if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
      }
    };

    start();

    return stop;
  });
};

export default useCanvas;
