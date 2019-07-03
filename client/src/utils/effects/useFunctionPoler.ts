import { useEffect, useState, useCallback, useRef } from "react";

const useFunctionPoler = <T>(f: () => Promise<T> | T, delay: number, x: T) => {
  const [data, setdata] = useState<T>(x);
  const looping = useRef(false);
  const funcRef = useRef(f);
  const timerRef = useRef(null);

  const updateData = useCallback(
    () =>
      Promise.resolve(funcRef.current()).then(
        x => looping.current && setdata(x)
      ),
    []
  );

  const loop = useCallback(() => {
    updateData();
    if (looping.current) {
      timerRef.current = setTimeout(loop, delay);
    }
  }, [delay, updateData]);

  const start = useCallback(() => {
    console.log("starting");
    looping.current = true;
    loop();
  }, [loop]);

  const stop = useCallback(() => {
    console.log("stopping");
    clearTimeout(timerRef.current);
    looping.current = false;
  }, []);

  useEffect(() => {
    updateData();
    start();
    return stop;
  }, [start, stop, updateData]);

  return data;
};

export default useFunctionPoler;
