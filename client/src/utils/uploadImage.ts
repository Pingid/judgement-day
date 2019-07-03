import axios from "axios";
import { ENDPOINT } from "../utils/constants";

const uploadImage = (image: string) =>
  axios.post(
    `${ENDPOINT}uploadImage`,
    { image },
    { headers: { "Content-Type": "application/json; charset=utf-8" } }
  );

export default uploadImage;

// curl -v -H 'Content-Type: image/png' -T ./tmp/out.png "https://slsupload.s3.amazonaws.com/out.png?Content-Type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVUQNGDVFFLRSNCCV%2F20190529%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190529T144635Z&X-Amz-Expires=30000&X-Amz-Signature=a990a788a571e4f5d9136e4b31eb181326137cb212c1b0a665cde5e53673ae06&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read"
