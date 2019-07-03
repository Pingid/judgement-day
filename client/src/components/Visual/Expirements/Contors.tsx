import * as React from "react";

import {
  XYPlot,
  XAxis,
  YAxis,
  ContourSeries,
  MarkSeriesCanvas,
  Borders,
  RadialChart
} from "react-vis";

const DATA = Array.from(new Array(500)).map((x, i) => ({
  waiting: Math.floor(Math.random() * 100),
  eruptions: Math.random() * 5
}));

function updateData() {
  return DATA.map(row => ({
    waiting: row.waiting + (Math.random() - 0.5) * 10,
    eruptions: row.eruptions + (Math.random() - 0.5) * 2
  }));
}
export default class ContourSeriesExample extends React.Component {
  state = {
    data: DATA
  };
  render() {
    const { data } = this.state;
    return (
      <div>
        <div>
          <RadialChart
            data={[
              { angle: 1, radius: 0.4 },
              { angle: 5, radius: 0.9 },
              { angle: 2, radius: 0.1 }
            ]}
            width={300}
            height={300}
          />
        </div>
        <XYPlot
          xDomain={[0, 100]}
          yDomain={[0, 5]}
          width={300}
          getX={d => d.waiting}
          getY={d => d.eruptions}
          height={300}
        >
          <ContourSeries
            animation
            className="contour-series-example"
            style={{
              stroke: "#125C77",
              strokeLinejoin: "round"
            }}
            colorRange={["#79C7E3", "#FF9833"]}
            data={data}
          />
          {/* <MarkSeriesCanvas animation data={data} size={1} color={"#125C77"} />
          <Borders style={{ all: { fill: "#fff" } }} />
          <XAxis />
          <YAxis /> */}
        </XYPlot>
        <div onClick={() => this.setState({ data: updateData() })}>CLICK</div>
      </div>
    );
  }
}
