import * as React from "react";

const ColouredImage = ({ color, style, imageKey }) => {
  return (
    <div className="filtered" style={{ backgroundColor: color, ...style }}>
      <div
        style={{
          width: "3rem",
          height: "3rem",
          backgroundSize: "cover",
          backgroundImage: `url(https://s3.eu-west-2.amazonaws.com/slsfaces/${imageKey})`,
          ...style
        }}
      />
    </div>
  );
};

export default ColouredImage;
