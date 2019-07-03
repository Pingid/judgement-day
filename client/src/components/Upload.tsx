import * as React from "react";
import { useDropzone } from "react-dropzone";
import uploadImage from "../utils/uploadImage";

const syncAll = ([head, ...tail], f, ret = []) => {
  if (!head) return ret;
  // @ts-ignore
  f(head).then(x => syncAll(tail, f, [...ret, x]));
};

const encodeImageFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = reject;
    reader.onerror = reject;
    // @ts-ignore
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

const convertUsingCanvas = image =>
  new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = image;
  });

const Upload = () => {
  const [message, setmessage] = React.useState("");
  const onDrop = React.useCallback(
    files =>
      syncAll(files, file => {
        setmessage("uploading");
        return encodeImageFile(file)
          .then(image =>
            /jpeg|jpg/gim.test(image) ? convertUsingCanvas(image) : image
          )
          .then((image: string) => {
            if (/png/.test(image))
              return uploadImage(image).then(x => {
                setmessage("done uploading image");
                return image;
              });
            setmessage("bad image try another");
            return image;
          })
          .catch(err => setmessage(err.message));
      }),
    []
  );
  // }))
  // {

  //   setmessage("uploading");
  //   encodeImageFile(file)
  //     .then(image =>
  //       /jpeg|jpg/gim.test(image) ? convertUsingCanvas(image) : image
  //     )
  //     .then((image: string) => {
  //       if (/png/.test(image))
  //         return uploadImage(image).then(x => {
  //           setmessage("done uploading image");
  //           return image;
  //         });
  //       setmessage("bad image try another");
  //       return image;
  //     })
  //     .catch(err => setmessage(err.message));
  // }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className="bg-black white flex items-center justify-center"
      style={{ width: "100%", height: "30rem" }}
      {...getRootProps()}
    >
      <h2 className="pa2">{message}</h2>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default Upload;
