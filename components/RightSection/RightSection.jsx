import React, { useContext } from "react";
import Header from "./Header";
import { GroupContext } from "../../lib/groupContext";
import ChatBox from "./ChatBox";
import Input from "./Input";
import LoginModal from "../Modals/LoginModal";

const RightSection = () => {
  const { selectedGroup } = useContext(GroupContext);
  // if (!selectedGroup) return null;

  return (
    <section
      className={` flex-col flex-[3] overflow-auto ${
        !selectedGroup ? "hidden md:flex " : "flex"
      } `}
    >
      {selectedGroup ? (
        <>
          <Header />
          <React.Suspense fallback={<p className="text-2xl" >Loading...</p>}  >
            {<ChatBox />}
          </React.Suspense>
          <Input />
        </>
      ) : (
        <div className="w-full h-full grid place-content-center ">
          <h2 className="text-3xl text-gray-400  truncate ">Select a group</h2>
        </div>
      )}
    </section>
  );
};

export default RightSection;
