import Image from "next/image";
import React, { useContext } from "react";
import { Flipped } from "react-flip-toolkit";
import TimeAgo from "timeago-react";
import { GroupContext } from "../lib/groupContext";

const Group = ({ group }) => {
  const { selectedGroup, setSelectedGroup } = useContext(GroupContext);
  const { image, name, lastMessage, updatedAt } = group;
  return (
    <Flipped flipId={group.id} >
      <div
        onClick={() => {
          setSelectedGroup(group);
        }}
        className={`flex flex-row items-center h-16 rounded-md cursor-pointer hover:bg-gray-100 ${
          selectedGroup?.name === name ? "bg-gray-100" : ""
        }  `}
      >
        <div className="w-16 h-16 ">
          <GroupImage size={60} image={image} />
        </div>
        <div className="flex flex-1 h-full py-2 flex-col items-start justify-center px-2 ">
          <div className="flex flex-row w-full  items-center justify-between">
            <h3 className="text-lg flex-1 text-gray-800">{name}</h3>
            {updatedAt && (
              <TimeAgo
                className="text-xs text-gray-400"
                datetime={`${new Date(updatedAt).toLocaleString()}`}
              />
            )}
          </div>
          {updatedAt && (
            <p className="text-xs w-24 text-gray-500 truncate ">
              {lastMessage?.text}
            </p>
          )}
        </div>
      </div>
    </Flipped>
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
      className={` w-[${size}px] h-[${size}px] rounded-md h-full  `}
    />
  );
}
