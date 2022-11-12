import Image from "next/image";
import React, { useContext, useState } from "react";
import { Flipped } from "react-flip-toolkit";
import TimeAgo from "timeago-react";
import { GroupContext } from "../lib/groupContext";
import { BsMarkdown } from "react-icons/bs";
import { BiImageAlt } from "react-icons/bi";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Group = ({ group }) => {
  const { selectedGroup, setSelectedGroup } = useContext(GroupContext);
  const { image, name, lastMessage, updatedAt } = group;
  return (
    <Flipped flipId={group.id} c>
      <div
        onClick={() => {
          setSelectedGroup(group);
        }}
        className={`flex w-full flex-row items-center gap-2  cursor-pointer hover:bg-gray-100 h-14 lg:h-16  ${
          selectedGroup?.name === name ? "bg-gray-100" : ""
        } px-5 `}
      >
        <div className="h-full aspect-square  ">
          <GroupImage size={60} image={image} />
        </div>
        <div className="flex flex-col flex-1 h-full py-2  items-start justify-between overflow-auto ">
          <div className="flex flex-row w-full  items-center justify-between">
            <h3 className=" text-sm md:text-base lg:text-lg truncate flex-1 text-gray-800">
              {name}
            </h3>

            {updatedAt && (
              <TimeAgo
                className=" text-[10px] lg:text-xs text-gray-400  truncate  "
                datetime={`${new Date(updatedAt).toLocaleString()}`}
                live={false}
                opts={{
                  minInterval: 60,
                }}
              />
            )}
          </div>

          <div className="text-xs overflow-hidden text-gray-500 w-full ">
            {["Markdown", "Image","video"].includes(lastMessage?.text) ? (
              <p className="flex gap-1 items-center ">
                {lastMessage?.text === "Markdown" ? (
                  <BsMarkdown size={16} />
                ) : (
                  <BiImageAlt size={16} />
                )}{" "}
                {capitalizeFirstLetter(lastMessage?.text)}
              </p>
            ) : (
              <p className="truncate max-w-[12rem] "> {lastMessage?.text}</p>
            )}
          </div>
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
      layout="responsive"
      width={200}
      height={200}
      alt=""
      className={` w-[${size}px] h-[${size}px] rounded-md h-full bg-white `}
    />
  );
}
