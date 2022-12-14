import React, { useContext, useEffect, useState } from "react";
import Group from "./Group";
import { Flipper } from "react-flip-toolkit";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore, postToJSON } from "../lib/firebase";
import { UserContext } from "../lib/userContext";

const GroupList = ({ keyword, showJoined }) => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const { joinedGroups } = useContext(UserContext);

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
      if (showJoined) {
        setFilteredGroups(
          groups.filter((group) => joinedGroups.includes(group.id))
        );
        return;
      }

      setFilteredGroups(groups);
    } else {
      setFilteredGroups([
        ...groups.filter((group) => {
          return group.name.toLowerCase().includes(keyword.toLowerCase());
        }),
      ]);
    }
  }, [keyword, groups, showJoined, joinedGroups]);

  if (!groups) return null;

  return (
    <Flipper
      spring="veryGentle"
      flipKey={`${filteredGroups?.map((group) => group.id).join("-")}`}
      className="my-2 flex w-full flex-1 flex-col gap-3 overflow-x-hidden overflow-y-scroll scrollbar-hide "
    >
      {!filteredGroups || filteredGroups.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <h3>No groups found. </h3>
        </div>
      ) : (
        filteredGroups.map((group) => <Group key={group.id} group={group} />)
      )}
    </Flipper>
  );
};

export default GroupList;
