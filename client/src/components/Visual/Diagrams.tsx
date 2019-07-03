import * as React from "react";
// import * as moment from "moment";
// import * as R from "ramda";

import useParentDimensions from "../../utils/effects/useParentDimensions";
import EmotionDistribution from "./Expirements/EmotionDistribution";
import DrawFaces from "./Expirements/DrawFaces";

// import Segments from "./Expirements/Segments";
// import Contors from "./Expirements/Contors";
// import Radial from "./Expirements/Radial";
// import Heatmap from "./Expirements/Heatmap";
// import Treemap from "./Expirements/Treemap";

const Diagrams = () => {
  const ref = React.useRef(null);
  const dims = useParentDimensions(ref);
  const [active, setActive] = React.useState("DrawFaces");

  // Visualisations
  React.useEffect(() => {
    let timer;
    const choices = ["EmotionDistribution", "DrawFaces"];
    timer = setTimeout(
      () => setActive(choices[(choices.indexOf(active) + 1) % choices.length]),
      15000
    );
    return () => {
      clearTimeout(timer);
    };
  }, [active]);

  const getComp = () => {
    if (active === "DrawFaces")
      return <DrawFaces width={dims.width} height={window.innerHeight * 0.6} />;
    return (
      <EmotionDistribution
        width={dims.width - 200}
        height={window.innerHeight * 0.6}
      />
    );
  };

  return (
    <div
      ref={ref}
      style={{ height: "78vh" }}
      className="flex items-center justify-center"
    >
      {getComp()}
    </div>
  );
};

export default Diagrams;
