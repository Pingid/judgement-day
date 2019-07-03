import { useState, useEffect } from "react";

const defaultState = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0
};

const useParentDimensions = ref => {
  const [dimensions, setdimensions] = useState(null);
  useEffect(() => {
    if (ref.current) {
      setdimensions(ref.current.parentNode.getBoundingClientRect());
    }
  }, [ref]);

  return dimensions || defaultState;
};

export default useParentDimensions;
