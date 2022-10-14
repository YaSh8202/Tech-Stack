import RightSection from "../components/RightSection/RightSection";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row ">
      <Sidebar />
      <RightSection />
    </div>
  );
}
