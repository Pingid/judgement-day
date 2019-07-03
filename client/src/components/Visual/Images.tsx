import * as React from "react";
import * as R from "ramda";
import { combineColors } from "../../utils/colors";
import { connect } from "react-redux";
import ColouredImage from "./ColouredImage";

const Images = ({ images, state }) => {
  const getStrongest = emot =>
    R.compose(
      R.head,
      x =>
        x.sort(
          (a, b) =>
            b.azure_data.faceAttributes.emotion[emot] -
            a.azure_data.faceAttributes.emotion[emot]
        )
    )(images);

  const emotional = R.compose(
    R.map(x => ({
      color: x.color,
      imageKey: R.prop("imagekey", getStrongest(x.name))
    }))
  )(state.emotions);

  return (
    <div className="w-100 border-box pt3">
      <div
        className="flex flex-wrap"
        style={{ width: "16rem", margin: "2rem 0" }}
      >
        <h2
          style={{ fontSize: "1.8rem", flex: "0 0 100%" }}
          className="ttu tc normal"
        >
          most emotional
        </h2>
        {emotional.map((x, i) => (
          <ColouredImage
            {...x}
            key={x.imageKey + "" + i}
            style={{ width: "4rem", height: "4rem" }}
          />
        ))}
      </div>
      <div
        className="flex flex-wrap pa1 items-start justify-start"
        style={{ overflowY: "hidden", height: "73vh" }}
      >
        {images.slice(0, 120).map((image, i) => {
          const emotion = image.azure_data.faceAttributes.emotion;
          const color = combineColors(
            state.emotions.map(x => [x.color, emotion[x.name]])
          );
          return (
            <ColouredImage
              key={image.imagekey}
              imageKey={image.imagekey}
              style={{
                width: "4rem",
                height: "4rem"
              }}
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
};

export default connect(state => {
  return {
    images: state.images,
    state: state.state.visual
  };
})(Images);
