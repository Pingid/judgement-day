import * as React from "react";
import { ChromePicker } from "react-color";

const Colour = ({ color, setColor }) => {
  const [picker, setpicker] = React.useState(false);
  return (
    <div className="flex">
      <div className="pa1 ba mr1" onClick={() => setpicker(!picker)}>
        edit
      </div>
      {!picker ? (
        <div style={{ backgroundColor: color }}>{color}</div>
      ) : (
        <ChromePicker
          color={color}
          onChangeComplete={clr => setColor(clr.hex)}
        />
      )}
    </div>
  );
};

export default Colour;
