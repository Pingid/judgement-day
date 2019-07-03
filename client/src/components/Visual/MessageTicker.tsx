import * as React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { ENDPOINT } from "../../utils/constants";
import useParentDimensions from "../../utils/effects/useParentDimensions";

const MessageTicker = ({ messages }) => {
  const ref = React.useRef(null);
  const dims = useParentDimensions(ref);

  const step = 5;
  const delay = 50;
  const [offset, setoffset] = React.useState(0);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const innerWidth = dims.width;
    let timer;

    if (offset <= -innerWidth) {
      setoffset(innerWidth + 10);
      setMessage("");
      axios.get(`${ENDPOINT}getMessage`).then(x => setMessage(x.data.text));
    }
    if (message && message.length > 1) {
      timer = setTimeout(() => setoffset(x => x - step), delay);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dims.width, message, offset]);

  return (
    <div
      ref={ref}
      style={{ height: "2rem", overflow: "hidden" }}
      className="fixed top-0 left-0 w-100 flex"
    >
      <div style={{ width: "21.5vw" }} className="bg-black z-3" />
      <div
        className="bg-black white h2 flex items-center"
        style={{
          width: "59vw",
          margin: "0 auto"
        }}
      >
        <div
          className="ttu b f3"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {message}
        </div>
      </div>
      <div style={{ width: "21.5vw" }} className="bg-black z-3" />
    </div>
  );
};

export default React.memo(
  connect(state => state.state.visual)(MessageTicker),
  () => false
);
