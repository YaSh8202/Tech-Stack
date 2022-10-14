import Image from "next/image";
import React, { useContext } from "react";
import TimeAgo from "timeago-react";
import { GroupContext } from "../lib/groupContext";

const Group = ({ group }) => {
  const { selectedGroup, setSelectedGroup } = useContext(GroupContext);
  const { image, name, lastMessage, updatedAt } = group;
  return (
    <div
      onClick={() => {
        setSelectedGroup(group);
      }}
      className={`flex flex-row items-center h-16 rounded-md cursor-pointer hover:bg-gray-100 ${
        selectedGroup?.name === name ? "bg-gray-100" : ""
      }  `}
    >
      <GroupImage size={60} image={image} />
      <div className="flex flex-1 h-full py-2 flex-col items-start justify-between px-2 ">
        <div className="flex flex-row w-full  items-center justify-between">
          <h3 className="text-lg flex-1 text-gray-800">{name}</h3>
          <TimeAgo
            className="text-xs text-gray-400"
            datetime={`${new Date(updatedAt).toLocaleString()}`}
          />
        </div>
        <p className="text-xs text-gray-500">{lastMessage.text}</p>
      </div>
    </div>
  );
};

export default Group;

export function GroupImage({ image, size }) {
  return (
    <Image
      src={image}
      layout="intrinsic"
      width={size}
      height={size}
      alt=""
      className="rounded-md h-full"
    />
  );
}
