import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { storage } from "../../lib/firebase";

export default async function handler(req, res) {
  const { url, name } = req.body;
  console.log("url", url);
  const imgResult = await fetch(url, {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  const blob = await imgResult.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());

  // send blob to firebase storage
  const storageRef = ref(
    storage,
    `images/${name || uuid()}.${blob.type.split("/")[1]}`
  );

  const upload = await uploadBytes(storageRef, buffer);
  const downloadURL = await getDownloadURL(upload.ref);
  return res.status(200).json({ downloadURL });
}
