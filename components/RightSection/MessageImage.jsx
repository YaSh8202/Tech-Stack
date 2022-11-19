import Image from "next/image";
import React, { useState, useLayoutEffect } from "react";

function MessageImage({ imgSrc, file }) {
  const [width, setWidth] = useState(500);

  const xsWidth = (file.width ? Math.min(file.width, 256) : 256).toString();
  const mdWidth = (file.width ? Math.min(file.width, 400) : 400).toString();
  const lgWidth = (file.width ? Math.min(file.width, 500) : 500).toString();

  function getImageWidth() {
    if (window.innerWidth < 500) {
      setWidth(xsWidth);
    } else if (window.innerWidth < 768) {
      setWidth(mdWidth);
    } else {
      setWidth(lgWidth);
    }
  }

  useLayoutEffect(() => {
    window.addEventListener("resize", getImageWidth);
    getImageWidth();
    return () => window.removeEventListener("resize", getImageWidth);
  }, []);

  return (
    <Image
      layout="intrinsic"
      src={imgSrc}
      alt="message"
      className="rounded-md "
      objectFit="cover"
      // sizes="100vw"
      key={imgSrc}
      width={width}
      height={(file.height / file.width) * width || width * 0.75}
    />
  );
}

export default MessageImage;
