import * as React from "react";
import * as R from "ramda";
import ColouredImage from "../Visual/ColouredImage";
import { combineColors } from "../../utils/colors";

const displayObj = (obj, acc = 0) => {
  if (Array.isArray(obj)) return obj.map(displayObj);
  if (typeof obj === "object")
    return Object.keys(obj).map((key, i) => (
      <div key={i + key + acc} className={`${"pl" + acc} ma0`}>
        <span className="b">{key}: </span>
        <span className="i">{displayObj(obj[key], acc + 2)}</span>
      </div>
    ));
  return obj;
};

export default ({ images, deleteImage, emotions }) => (
  <div style={{ display: "flex", flexFlow: "row wrap" }}>
    {images.map(x => {
      const emotion = x.azure_data.faceAttributes.emotion;
      const attributes = R.dissoc("emotion", x.azure_data.faceAttributes);

      const color = combineColors(
        emotions.map(x => [x.color, emotion[x.name]])
      );

      return (
        <div className="pa1" key={x.imagekey} style={{ width: "10rem" }}>
          <ColouredImage
            imageKey={x.imagekey}
            color={color}
            style={{ width: "8rem", height: "8rem" }}
          />
          <button
            className="bg-black white"
            type="submit"
            onClick={() => deleteImage(x)}
          >
            delete
          </button>
          {Object.keys(emotion).map(key => (
            <div
              key={key + x.imagekey}
              style={{ width: 100 * emotion[key], backgroundColor: "blue" }}
            >
              {key}
            </div>
          ))}
          {displayObj(attributes)}
        </div>
      );
    })}
  </div>
);
