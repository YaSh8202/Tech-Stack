import React, { useContext } from "react";
import Group from "./Group";
import mlImage from "../public/machineLearning3.png";
import { GroupConext } from "../lib/groupContext";

const GroupList = () => {
  const { groups } = useContext(GroupConext);

  return (
    <div className="w-full flex-1 my-3 flex flex-col gap-2 ">
      {groups.map((group) => (
        <Group
          key={group.id}
          lastMessage={group.lastMessage.text}
          title={group.name}
          groupImage={group.image}
        />
      ))}
    </div>
  );
};

export default GroupList;
