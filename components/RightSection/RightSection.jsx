import React, { useContext } from "react";
import Header from "./Header";
import { GroupContext } from "../../lib/groupContext";
import ChatBox from "./ChatBox";
import Input from "./Input";
import LoginModal from "../Modals/LoginModal";

const RightSection = () => {
  const { selectedGroup } = useContext(GroupContext);
  if (!selectedGroup) return null;

  return (
    <section
      className={` flex-col flex-[3] ${
        !selectedGroup ? "hidden md:flex " : "flex md:flex"
      } `}
    >
      <Header />
      <ChatBox />
      <Input />
    </section>
  );
};

export default RightSection;
