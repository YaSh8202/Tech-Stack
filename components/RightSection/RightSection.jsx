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
    <section className="flex flex-col flex-1 ">
      <Header />
      <ChatBox />
      <Input />
    </section>
  );
};

export default RightSection;
