import * as React from "react";
import DrawFaces from "../Expirements/DrawFaces";

const screens = {
  one: {
    comp: DrawFaces,
    time: 100000
  }
  // two: {
  //   comp: () => <p>2</p>,
  //   time: 10000
  // }
};

const Screens = () => {
  const [screen, setScreen] = React.useState(Object.keys(screens)[0]);

  React.useEffect(() => {
    let timer;
    let screenNames = Object.keys(screens);
    const nextScreen =
      screenNames[(screenNames.indexOf(screen) + 1) % screenNames.length];
    timer = setTimeout(() => setScreen(nextScreen), screens[nextScreen].time);
    return () => {
      clearTimeout(timer);
    };
  }, [screen]);

  const Current = screens[screen].comp;
  return (
    <div>
      <Current />
    </div>
  );
};

export default Screens;
