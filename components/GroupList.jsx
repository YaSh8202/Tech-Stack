import React, { useContext, useEffect, useState } from "react";
import Group from "./Group";
import { GroupContext } from "../lib/groupContext";
import { Flipped, Flipper } from "react-flip-toolkit";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore, postToJSON } from "../lib/firebase";

const GroupList = ({ keyword }) => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState(groups);

  useEffect(() => {
    const groupsQuery = query(
      collection(firestore, "Groups"),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groups = snapshot.docs.map(postToJSON);
      setGroups(groups);
    });
    return unsubscribe;
  }, []);

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
      {filteredGroups?.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </Flipper>
  );
};

export default GroupList;
