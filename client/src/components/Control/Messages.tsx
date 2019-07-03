import * as React from "react";
import shortid from "shortid";

type Messages = Array<{
  text: string;
  id: string;
}>;

const Messages: React.FC<{
  state: Messages;
  setState: (x: Messages) => void;
}> = ({ state, setState }) => {
  return (
    <>
      {state.map(x => (
        <input
          className="ba pa1 mv1 w-100"
          key={x.id}
          type="text"
          value={x.text}
          onChange={e =>
            setState(
              state.map(y =>
                y.id === x.id ? { ...y, text: e.target.value } : y
              )
            )
          }
        />
      ))}
      <div
        className="pa1 ba mv1 w4"
        onClick={() =>
          setState([...state, { text: "", id: shortid.generate() }])
        }
      >
        Add Message
      </div>
    </>
  );
};

export default Messages;
