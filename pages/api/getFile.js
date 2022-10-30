import stream from "stream";
import { promisify } from "util";
import fetch from "node-fetch";

const pipeline = promisify(stream.pipeline);
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const handler = async (req, res) => {
  const id= req.query.id;

  if (!id) {
    res.status(400).send("Missing url");
    return;
  }

  getDownloadURL(ref(storage, `images/${id}`))
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'

    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();

    // Or inserted into an <img> element
    const img = document.getElementById('myimg');
    img.setAttribute('src', url);
  })
  .catch((error) => {
    // Handle any errors
  });

  const response = await fetch(url);
  console.log(url);
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);

  // set type to image
  res.setHeader("Content-Type", "image");
  res.setHeader("Content-Disposition", "attachment; filename=image.png");
  await pipeline(response.body, res);
};

export default handler;
