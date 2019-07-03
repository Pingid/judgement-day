import { useEffect, useRef, useCallback } from "react";

const useSiderEffectPoler = (f: () => Promise<void> | void, delay: number) => {
  const looping = useRef(false);
  const timerRef = useRef(null);

  const func = useCallback(f, []);

  useEffect(() => {
    const loop = () => {
      func();
      if (looping.current) {
        timerRef.current = setTimeout(loop, delay);
      }
    };

    looping.current = true;
    loop();

    return () => {
      clearTimeout(timerRef.current);
      looping.current = false;
    };
  }, [delay, func]);
};

export default useSiderEffectPoler;
