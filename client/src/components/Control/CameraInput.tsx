import * as React from "react";

const ItemWrapper = ({ title, children }) => (
  <div className="flex items-center mv2">
    <p className="ma0 pr2 w-4 ttu b" style={{ flex: "0 0 15rem" }}>
      {title}
    </p>
    {children}
  </div>
);

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

export default ({
  state,
  setState
}: {
  state: AppState["cameras"];
  setState: (x: AppState["cameras"]) => void;
}) => (
  <div>
    <ItemWrapper title="Cameras active:">
      <input
        type="checkbox"
        checked={state.running}
        onChange={() => setState({ ...state, running: !state.running })}
      />
    </ItemWrapper>
    <ItemWrapper title="Picture delay milisecons (1000 = 1s):">
      <input
        type="number"
        value={state.delay}
        onChange={e => setState({ ...state, delay: parseInt(e.target.value) })}
      />
    </ItemWrapper>
    <ItemWrapper title="Upload enpoint">
      <input
        type="text"
        value={state.uploadEndpoint || ""}
        onChange={e => setState({ ...state, uploadEndpoint: e.target.value })}
      />
    </ItemWrapper>
    {displayObj(state.address)}
  </div>
);
