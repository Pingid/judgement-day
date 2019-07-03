import * as React from "react";
import * as R from "ramda";

import { RadialChart } from "react-vis";

import { mergeAdd } from "../../../utils/objectMath";
import { connect } from "react-redux";

const Segments: React.FC<{
  width: number;
  segments: { color: string; weight: number; name: string }[];
}> = ({ segments, width }) => {
  return (
    <RadialChart
      showLabels
      labelsRadiusMultiplier={1.3}
      labelsStyle={{
        background: "white"
      }}
      data={segments}
      width={width}
      height={width}
    />
  );
};

const mapStateToProps = state => {
  const segments = R.compose(
    averaged =>
      R.map(
        key => ({
          radius: averaged[key],
          label: key,
          subLabel: Math.round(averaged[key] * 100 * 100) / 100 + "%",
          angle: 1,
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
