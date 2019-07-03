import * as React from "react";
import { describeArc } from "../../../utils/svg";

const RotationGraph = ({ data, padding, strokeWidth, spread }) => {
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%" }}>
      {Object.keys(data).map((key, i) => {
        return (
          <g key={key}>
            <text
              x={50}
              dx="-2"
              textAnchor="end"
              y={
                padding * 2 - 0.5 + (i / Object.keys(data).length) * 50 * spread
              }
              style={{ fontSize: "3px", textAlign: "right", width: "50%" }}
            >
              {key}
            </text>
            <path
              id="arc1"
              fill="none"
              stroke="#000000"
              strokeWidth={strokeWidth}
              d={describeArc(
                50,
                50,
                50 -
                  strokeWidth / 2 -
                  padding -
                  (i / Object.keys(data).length) * 50 * spread,
                0,
                // 300
                data[key] * 359
              )}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default RotationGraph;
