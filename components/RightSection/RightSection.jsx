import React, { useContext } from "react";
import Header from "./Header";
import { GroupContext } from "../../lib/groupContext";
import ChatBox from "./ChatBox";
import Input from "./Input";

const RightSection = () => {
  const { selectedGroup } = useContext(GroupContext);

  return (
    <section
      className={`flex flex-col justify-between flex-[3] overflow-auto ${
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
        <div className="w-full h-full grid place-content-center ">
          <h2 className="text-3xl text-gray-400  truncate ">Select a group</h2>
        </div>
      )}
    </section>
  );
};

export default RightSection;
