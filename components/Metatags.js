import Head from "next/head";
import React from "react";

function MetaTags({ title, description, image }) {
  return (
    <Head>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@yashb1010" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta />
    </Head>
  );
}

export default MetaTags;
