import React, { useContext, useEffect, useState } from "react";
import Group from "./Group";
import { GroupContext } from "../lib/groupContext";
import { Flipped, Flipper } from "react-flip-toolkit";

const GroupList = ({ keyword }) => {
  const { groups } = useContext(GroupContext);
  const [filteredGroups, setFilteredGroups] = useState(groups);

  useEffect(() => {
    if (!keyword || keyword === "") {
      setFilteredGroups(groups);
    } else {
      setFilteredGroups([
        ...groups.filter((group) => {
          return group.name.toLowerCase().includes(keyword.toLowerCase());
        }),
      ]);
    }
  }, [keyword, groups, filteredGroups]);

  if (!groups) return null;

  return (
    <Flipper
      spring="veryGentle"
      flipKey={`${filteredGroups?.map((group) => group.id).join("-")}`}
      className="w-full flex-1 mt-3 flex flex-col gap-3 overflow-y-scroll scrollbar-hide "
    >
      {/* <Group
        key="open-ai"
        group={{ id: "open-ai", name: "Ask a Question", image: "/openAI.png" }}
      /> */}
      {filteredGroups?.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </Flipper>
  );
};

export default GroupList;
