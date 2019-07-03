import * as React from "react";
import { useSpring, animated } from "react-spring";

const Face = ({ smile }) => {
  const props = useSpring({ smile, from: { smile: 0 } });
  const smileLine = n => `M 50,150 C 75,${150 * n}  125,${150 * n}   150,150`;
  console.log(smile, props.smile);
  return (
    <animated.svg viewBox="0 0 200 200" style={{ width: "100%" }}>
      <circle
        style={{ fill: "none", stroke: "#000", strokeMiterlimit: 10 }}
        cx="100"
        cy="100"
        r="99"
      />
      <circle
        style={{ fill: "none", stroke: "#000", strokeMiterlimit: 10 }}
        cx="135"
        cy="90"
        r="8.16"
      />
      <circle
        style={{ fill: "none", stroke: "#000", strokeMiterlimit: 10 }}
        cx="65"
        cy="90"
        r="8.16"
      />
      <circle
        style={{ fill: "none", stroke: "#000", strokeMiterlimit: 10 }}
        cx="100"
        cy="130"
        r="2"
      />

      <path
        style={{ fill: "none", stroke: "#000", strokeMiterlimit: 10 }}
        d={smileLine(props.smile.interpolate(x => x))}
      />
    </animated.svg>
  );
};

export default Face;
