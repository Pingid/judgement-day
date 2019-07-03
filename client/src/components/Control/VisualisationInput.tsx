import * as React from "react";
import Messages from "./Messages";
import Colour from "./Colour";

const VisualisationInput: React.FC<{
  state: AppState["visual"];
  setState: (x: Partial<AppState["visual"]>) => void;
}> = ({ state, setState }) => {
  return (
    <>
      <h2 className="mt4 mb2 ttu">General Messages</h2>
      <div className="border-box ph2">
        <Messages
          state={state.messages}
          setState={messages => setState({ ...state, messages })}
        />
      </div>
      <h2 className="mt4 mb2 ttu">Emotions</h2>
      <div className="flex flex-wrap">
        {state.emotions.map(emot => {
          const updateEmotion = data =>
            setState({
              ...state,
              emotions: state.emotions.map(x =>
                x.name === emot.name ? data : x
              )
            });

          return (
            <div key={emot.name} className="flex flex-column ph2">
              <p className="mv2 ttu b">{emot.name}</p>
              <Colour
                color={emot.color}
                setColor={clr => updateEmotion({ ...emot, color: clr })}
              />
              <Messages
                state={emot.messages}
                setState={messages => updateEmotion({ ...emot, messages })}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default VisualisationInput;
