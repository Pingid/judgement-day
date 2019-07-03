import * as React from "react";
import * as R from "ramda";
import { mergeAdd } from "../../../utils/objectMath";
import { connect } from "react-redux";
import { circlePoint } from "../../../utils/vectors";

const Segments: React.FC<{
  width: number;
  segments: { color: string; weight: number; name: string }[];
}> = ({ segments, width }) => {
  const radius = width / 2 - 50;
  const oppositLength = 50;
  console.log(segments);
  return (
    <div>
      {segments.map((seg, i) => (
        <div key={seg.color + i + "cool"}>
          <div
            style={{
              position: "absolute",
              marginTop: radius,
              marginLeft: radius,
              transform: `translateX(${
                circlePoint(i / segments.length, radius).x
              }px) translateY(${circlePoint(i / segments.length, radius).y}px)`
            }}
          >
            {seg.name}
            <br />
            {Math.round(seg.weight * 100 * 100) / 100 + "%"}
          </div>
          <div
            style={{
              position: "absolute",
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              backgroundColor: seg.color,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "50% 0%",
              backgroundSize: `auto 50%`,
              borderRadius: "100%",
              clipPath: `polygon(${50 - oppositLength}% 0%, 50% 50%, ${5 +
                oppositLength}% 0%)`,
              WebkitClipPath: `polygon(${50 - oppositLength}% 0%, 50% 50%, ${5 +
                oppositLength}% 0%)`,
              transform: `rotate(${(i / segments.length) * 360 +
                95}deg) scale(${seg.weight}, ${seg.weight})`
            }}
          />
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = state => {
  const segments = R.compose(
    averaged =>
      R.map(
        key => ({
          weight: averaged[key],
          name: key,
          color: R.find(x => x.name === key, state.state.visual.emotions).color
        }),
        R.keys(averaged)
      ),
    summed => {
      // divide every value by the total sum
      const total = R.sum(R.values(summed));
      return R.map(x => x / total, summed);
    },
    R.reduce((a, b) => mergeAdd(b, a), {}), // Merge all the objects summing the values
    R.map(x => R.dissoc("neutral", x.azure_data.faceAttributes.emotion))
  )(state.images);

  return { segments };
};
export default connect(mapStateToProps)(Segments);
