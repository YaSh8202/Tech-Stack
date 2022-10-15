import RightSection from "../components/RightSection/RightSection";
import dynamic from "next/dynamic";

export default function Home() {
  const RightSection = dynamic(() => import("../components/RightSection/RightSection"), {
    ssr: false,
  });
  const Sidebar = dynamic(() => import("../components/Sidebar"), {
    ssr: false,
  });
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row ">
      <Sidebar />
      <RightSection />
    </div>
  );
}
