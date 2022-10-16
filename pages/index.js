import RightSection from "../components/RightSection/RightSection";
import dynamic from "next/dynamic";
import Head from "next/head";

export default function Home() {
  const RightSection = dynamic(() => import("../components/RightSection/RightSection"), {
    ssr: false,
  });
  const Sidebar = dynamic(() => import("../components/Sidebar"), {
    ssr: false,
  });
  return (

    <div className="h-screen w-screen overflow-hidden flex flex-row ">
      <Head>
        <title>Tech Stack</title>
      </Head>
      <Sidebar />
      <RightSection />
    </div>
  );
}
