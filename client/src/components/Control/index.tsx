import * as React from "react";
import axios from "axios";
import { ENDPOINT } from "../../utils/constants";

import VisualisationInput from "./VisualisationInput";
import CameraInput from "./CameraInput";
import Images from "./Images";

const hasEmptyString = obj =>
  typeof obj === "string"
    ? obj.length > 0
    : Object.values(obj).indexOf("") >= 0;

const cleanStateData = data => {
  if (Array.isArray(data))
    return data.map(cleanStateData).filter(x => !hasEmptyString(x));
  if (typeof data === "object")
    return Object.keys(data)
      .map(key => ({ [key]: cleanStateData(data[key]) }))
      .reduce((a, b) => ({ ...a, ...b }));
  return data;
};

const getData = () =>
  Promise.all([
    axios.get(`${ENDPOINT}images`).then(x => x.data),
    axios.get(`${ENDPOINT}state`).then(y => y.data)
  ]).then(([images, state]) => ({ state, images }));

const getImages = () => axios.get(`${ENDPOINT}images`).then(x => x.data);

const deleteImage = imagekey =>
  axios.post(`${ENDPOINT}deleteImage`, { imagekey });

const saveData = d =>
  axios.post(`${ENDPOINT}state`, { state: "local", data: d });

const Control = () => {
  const [state, setLocalState] = React.useState(null);
  const [images, setimages] = React.useState([]);

  const updateLocalState = () =>
    getData().then(({ state, images }) => {
      setLocalState(state);
      setimages(images);
    });

  React.useEffect(() => {
    updateLocalState();
  }, [null]);

  const handleDataSave = e => {
    e.preventDefault();
    const submitData = cleanStateData({ ...state });
    setLocalState(null);
    saveData(submitData).then(x => setLocalState(x.data));
  };

  const handleDeleteImage = img =>
    deleteImage(img.imagekey)
      .then(getImages)
      .then(setimages);

  if (!state) return <h1>Loading</h1>;
  return (
    <div className="bg-white">
      <form className="border-box ph2">
        <h1 className="ma0 mv3 ttu">Cameras</h1>
        <div className="border-box ph2 mb4">
          <CameraInput
            state={state.cameras}
            setState={data =>
              setLocalState(x => ({ ...x, cameras: { ...x.cameras, ...data } }))
            }
          />
        </div>
        <h1 className="ma0 mv3 ttu">Visualisation</h1>
        <div className="border-box ph2">
          <VisualisationInput
            state={state.visual}
            setState={data =>
              setLocalState(x => ({ ...x, visual: { ...x.visual, ...data } }))
            }
          />
        </div>
        <button
          className="pa1 ph3 ttu mv4 bg-black white w-100"
          type="submit"
          onClick={handleDataSave}
        >
          <h3>save</h3>
        </button>
      </form>
      <div className="border-box ph2">
        <h1 className="ma0 mv3 ttu">images</h1>
        <Images
          images={images}
          deleteImage={handleDeleteImage}
          emotions={state.visual.emotions}
        />
      </div>
    </div>
  );
};

export default Control;
