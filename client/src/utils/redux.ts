import { createStore } from "redux";
import { EMOTIONS } from "./constants";

interface State {
  state: AppState;
  images: Image[];
}

export const defaultState: State = {
  state: {
    cameras: {
      running: false,
      delay: 30000,
      uploadEndpoint: "",
      address: { one: "", two: "", three: "" }
    },
    visual: {
      emotions: EMOTIONS.map(name => ({
        name,
        color: "#444444",
        messages: []
      })),
      messages: []
    }
  },
  images: []
};

function counter(state = defaultState, action) {
  switch (action.type) {
    case "UPDATE_IMAGES":
      return { ...state, images: action.images };
    case "UPDATE_STATE":
      return { ...state, state: action.state };
    default:
      return state;
  }
}

export let store = createStore(counter);

export const addImages = images => ({ type: "UPDATE_IMAGES", images });
export const addState = state => ({ type: "UPDATE_STATE", state });

store.subscribe(() => console.log("STORE CHANGE", store.getState()));
