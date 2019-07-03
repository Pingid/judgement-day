import axios from "axios";
import { Prisma } from "./prisma-client";
// import R from 'ramda';

const prisma = new Prisma();

const main = async () => {
  const { data } = await axios.get("http://localhost:4000/images?length=2000");

  const ordered = data.sort((a, b) => b.created_at - a.created_at);

  for (let i = 0; i < ordered.length; i++) {
    console.log(i);

    // await prisma.deleteImage({ imagekey: ordered[i].imagekey });
    await prisma
      .createImage({
        pictured_at: new Date(
          /\/(.*)?\.png/gim.exec(ordered[i].imagekey)[1]
        ).toISOString(),
        azure_data: ordered[i].azure_data,
        imagekey: ordered[i].imagekey,
        source_key: ordered[i].source_key.replace(
          /^raw-images/gim,
          "processed-raw-images"
        )
      })
      .catch(error => {
        console.log(error.message);
      });
  }
};

main();
