import React, { useContext } from "react";
import Header from "./Header";
import { GroupContext } from "../../lib/groupContext";
import ChatBox from "./ChatBox";
import Input from "./Input";

const RightSection = () => {
  const { selectedGroup } = useContext(GroupContext);

  return (
    <section
      className={`flex flex-[3] flex-col justify-between overflow-auto ${
        !selectedGroup ? "hidden md:flex " : "flex"
      } `}
    >
      {selectedGroup ? (
        <>
          <Header />
          <ChatBox />
          <Input />
        </>
      ) : (
        <div className="grid h-full w-full place-content-center ">
          <h2 className="truncate text-3xl  text-gray-400 ">Select a group</h2>
        </div>
      )}
    </section>
  );
};

export default RightSection;
