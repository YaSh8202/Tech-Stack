import dynamic from "next/dynamic";
import Head from "next/head";
import LoginModal from "../components/Modals/LoginModal";

export default function Home() {
  const RightSection = dynamic(
    () => import("../components/RightSection/RightSection"),
    {
      ssr: false,
    }
  );
  const Sidebar = dynamic(() => import("../components/Sidebar"), {
    ssr: false,
  });
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row min-w-full  ">
      <Head>
        <title>Tech Stack</title>
      </Head>
      <Sidebar />
      <RightSection />
      <LoginModal />
    </div>
  );
}
