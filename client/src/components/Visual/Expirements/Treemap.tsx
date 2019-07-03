import * as React from "react";
import * as R from "ramda";

import { Treemap } from "react-vis";

import { mergeAdd } from "../../../utils/objectMath";
import { connect } from "react-redux";

interface Tree {
  color: string;
  size: number;
  children: Tree[];
}
const Segments: React.FC<{
  width: number;
  tree: Tree;
}> = ({ tree, width }) => {
  console.log(tree);
  return (
    <Treemap
      {...{
        mode: "circlePack",
        renderMode: "SVG",
        colorType: "literal",
        // colorType: "linear",
        colorDomain: "literal",
        colorRange: "literal",
        style: {
          stroke: "#000",
          // fill: "#000",
          strokeWidth: "0.25"
          // strokeOpacity: 0.5
        },
        getColor: x => x.color,
        data: tree,
        width,
        height: width
      }}
    />
  );
};

const mapStateToProps = state => {
  const images = R.map(
    x => R.dissoc("neutral", x.azure_data.faceAttributes.emotion),
    state.images
  );
  const emotions = state.state.visual.emotions;

  const strongestTrait = obj =>
    R.head(
      R.keys(obj)
        .map(key => ({ name: key, value: obj[key] }))
    );

  const children = R.compose(
    table =>
      R.keys(table).map(key => ({
        title: key,
        color: table[key][0].color,
        // style: { fill: table[key][0].color },
        children: table[key]
      })),
    R.reduce((a, b) => {
      const item = {
        // title: b.strong.name,
        size: b.strong.value,
        color: R.find(x => x.name === b.strong.name, emotions).color,
        style: { fill: "#000" }
      };
      if (a[b.strong.name])
        return {
          ...a,
          [b.strong.name]: [...a[b.strong.name], item]
        };
      return { ...a, [b.strong.name]: [item] };
    }, {}),
    R.map(x => ({ ...x, strong: strongestTrait(x) }))
  )(images);

  const tree = {
    color: "#ffffff",
    children
  };

  return { tree };
};
export default connect(mapStateToProps)(Segments);
