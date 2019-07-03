import * as React from "react";
import useCanvas from "../../../utils/effects/useCanvas";
import FaceDraw from "../../../canvas/FaceDraw";

const DrawFaces = ({ width, height }) => {
  const ref = React.useRef(null);

  useCanvas(
    ref,
    { width: width, height: height, scaleFactor: 2 },
    new FaceDraw(),
    {}
  );

  return <canvas ref={ref} />;
};

export default DrawFaces;
