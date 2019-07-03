import * as React from "react";

const About = () => {
  return (
    <div className="border-box ph2 mt4 pt4 ">
      <div className="flex flex border-box pr4">
        <div className="ba pa2 pb1 ph3" style={{ flex: "0 0 17rem" }}>
          <h1
            style={{ fontSize: "4rem", letterSpacing: "5px" }}
            className="bb bw2 pb1 ma0"
          >
            J.O.E.L
          </h1>
          <h3 className="normal" style={{ lineHeight: "1.6rem" }}>
            Job Opportunities Evaluation and Learning
          </h3>
        </div>
        <div>
          <p className="ma0 mh2 pl4 pr5">
            We made this to answer the most important question we have during
            our final show: is anybody going to give us a job? Our emotion
            detection system analyses your face to see what sort of emotions our
            show is producing in you, and how strong those feelings are. We hope
            these strong feelings will turn into job offers..
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
