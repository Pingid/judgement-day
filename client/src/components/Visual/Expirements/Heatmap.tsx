import * as React from "react";
import * as R from "ramda";

import {
  XYPlot,
  HeatmapSeries,
  ContourSeries,
  CustomSVGSeries,
  LabelSeries
} from "react-vis";

import { interpolateColor } from "../../../utils/colors";
import {
  circlePoint,
  interpolateVector,
  randomDistributeVector
} from "../../../utils/vectors";

import { connect } from "react-redux";

const myData = [
  { x: 1, y: 10, customComponent: "circle", size: 10 },
  { x: 1.7, y: 12, size: 20, style: { stroke: "red", fill: "orange" } },
  { x: 2, y: 5 },
  { x: 3, y: 15 },
  {
    x: 2.5,
    y: 7,
    customComponent: (row, positionInPixels) => {
      return (
        <g className="inner-inner-component">
          <circle cx="0" cy="0" r={10} fill="green" />
          <text x={0} y={0}>
            <tspan x="0" y="0">{`x: ${positionInPixels.x}`}</tspan>
            <tspan x="0" y="1em">{`y: ${positionInPixels.y}`}</tspan>
          </text>
        </g>
      );
    }
  }
];

const HeatMap: React.FC<{
  images: Image["azure_data"]["faceAttributes"]["emotion"][];
  emotions: AppState["visual"]["emotions"];
  width: number;
  height: number;
}> = ({ images, emotions, width, height }) => {
  const radius = width / 2;
  const margin = 100;
  const spread = margin / 5;

  const anchors = emotions
    .filter(x => x.name !== "neutral")
    .map((p, i) => ({
      label: p.name,
      color: p.color,
      ...circlePoint(i / (emotions.length - 1), radius)
    }))
    .concat(
      emotions
        .filter(x => x.name === "neutral")
        .map(x => ({
          label: x.name,
          color: x.color,
          x: 0,
          y: 0
        }))
    )
    .map(x => ({
      ...x,
      customComponent: (row, positionInPixels) => (
        <g className="inner-inner-component">
          <text>{x.label}</text>
        </g>
      )
    }));

  const dataPoints = images.map(emot => ({
    ...anchors
      .filter(anch => emot[anch.label] > 0)
      .reduce(
        (res, anch) => {
          return {
            color: interpolateColor(res.color, anch.color, emot[anch.label]),
            ...randomDistributeVector(
              // Add a random distribution to point
              interpolateVector(
                // Get location of vector
                { x: res.x, y: res.y },
                { x: anch.x, y: anch.y },
                emot[anch.label]
              ),
              spread
            )
          };
        },
        {
          x: 0,
          y: 0,
          color: "#ffffff"
        }
      )
  }));

  return (
    <div>
      <XYPlot
        xDomain={[-radius - margin, radius + margin]}
        yDomain={[-radius - margin, radius + margin]}
        width={width}
        height={height}
        className="absolute"
      >
        <LabelSeries data={anchors} />
      </XYPlot>
      <XYPlot
        xDomain={[-radius - margin, radius + margin]}
        yDomain={[-radius - margin, radius + margin]}
        width={width}
        height={height}
      >
        {/* <CustomSVGSeries
        style={{ stroke: "red", fill: "orange" }}
        data={anchors}
      /> */}

        <ContourSeries
          className="contour-series-example"
          style={{
            stroke: "none",
            strokeLinejoin: "round"
          }}
          data={dataPoints}
          animation
        />

        <HeatmapSeries animation colorType="literal" data={dataPoints} />
      </XYPlot>
    </div>
  );
};

const mapStateToProps = state => {
  const images = R.map(
    x => R.dissoc("neutral", x.azure_data.faceAttributes.emotion),
    state.images
  );
  const emotions = state.state.visual.emotions;

  return { emotions, images };
};

export default connect(mapStateToProps)(HeatMap);
