import * as React from "react";
import axios from "axios";

import { store, addImages, addState } from "../../utils/redux";
import useSideEffectPoler from "../../utils/effects/useSideEffectPoler";

import { ENDPOINT } from "../../utils/constants";

import Diagrams from "./Diagrams";
import MessageTicker from "./MessageTicker";
import Images from "./Images";
import About from "./About";
// import Screens from "./Screens";

const Visual = () => {
  useSideEffectPoler(
    () =>
      axios
        .get(`${ENDPOINT}state`)
        .then(x => store.dispatch(addState(x.data)))
        .then(() => null),
    5000000
  );

  useSideEffectPoler(
    () =>
      axios({ method: "GET", url: `${ENDPOINT}images?length=1000` })
        .then(x => store.dispatch(addImages(x.data)))
        .then(() => null),
    5000
  );

  return (
    <div
      style={{
        width: "59vw",
        margin: "0 auto",
        overflow: "hidden",
        background: "white"
      }}
    >
      {/* <Screens /> */}
      <div className="flex ph3 border-box" style={{ width: "100%" }}>
        <div style={{ flex: "0 0 70%" }} className="flex flex-column">
          <About />
          <Diagrams />
        </div>
        <div
          style={{ flex: "0 0 30%", marginRight: "4rem", paddingRight: "4rem" }}
          className="border-box"
        >
          <Images />
        </div>
      </div>
      <MessageTicker />
    </div>
  );
};

export default Visual;
