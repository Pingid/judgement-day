import * as React from "react";
import Distribution from "../../../canvas/Distribution";
import useCanvas from "../../../utils/effects/useCanvas";

const EmotionDistribution = ({ width, height }) => {
  const ref = React.useRef(null);
  useCanvas(
    ref,
    { width: width, height: height, scaleFactor: 2 },
    new Distribution(),
    {}
  );

  return <canvas ref={ref} />;
};

export default React.memo(EmotionDistribution);
