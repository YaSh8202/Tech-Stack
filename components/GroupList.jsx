import React, { useContext } from "react";
import Group from "./Group";
import { GroupContext } from "../lib/groupContext";

const GroupList = () => {
  const { groups } = useContext(GroupContext);

  if (!groups) return null;

  return (
    <div className="w-full flex-1 my-4 flex flex-col gap-2 overflow-y-scroll scrollbar-hide ">
      {groups.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </div>
  );
};

export default GroupList;
