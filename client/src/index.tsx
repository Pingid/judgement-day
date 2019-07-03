import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./utils/redux";

import "./css/index.css";
import "./css/tachyons.css";

import Control from "./components/Control";
import Webcam from "./components/Webcam";
import Upload from "./components/Upload";
import Visual from "./components/Visual";

import * as serviceWorker from "./utils/serviceWorker";

const AppRouter = () => (
  <Router>
    <Provider store={store}>
      <div className="border-box">
        <div className="fixed o-0 hover-o-1 white bg-black top-0 left-0 z-3 border-box h2 w-100 flex items-center justify-between mb2 ph2 z-3">
          <Link to="/">home</Link>
          <Link to="/webcam">Webcam</Link>
          <Link to="/control">control</Link>
          <Link to="/upload">upload</Link>
          <Link to="/visual">visual</Link>
        </div>
        <Route exact path="/control" component={Control} />
        <Route exact path="/webcam" component={Webcam} />
        <Route path="/upload" component={Upload} />
        <Route path="/visual" component={Visual} />
      </div>
    </Provider>
  </Router>
);

ReactDOM.render(<AppRouter />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
