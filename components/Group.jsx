import Image from "next/image";
import React, { useContext, useState } from "react";
import { Flipped } from "react-flip-toolkit";
import TimeAgo from "timeago-react";
import { GroupContext } from "../lib/groupContext";
import { BsMarkdown } from "react-icons/bs";
import { BiImageAlt } from "react-icons/bi";
import { useRouter } from "next/router";

function capitalizeFirstLetter(string) {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
}
const Group = ({ group }) => {
  const { selectedGroup, setSelectedGroup } = useContext(GroupContext);
  const { image, name, lastMessage, updatedAt } = group;
  const router = useRouter();
  return (
    <Flipped flipId={group.id} c>
      <div
        onClick={() => {
          router.push(`/${group.id}`);
        }}
        className={`flex h-14 w-full cursor-pointer flex-row  items-center gap-2 hover:bg-gray-100 lg:h-16  ${
          selectedGroup?.name === name ? "bg-gray-100" : ""
        } px-5 `}
      >
        <div className="aspect-square h-full  ">
          <GroupImage size={60} image={image} />
        </div>
        <div className="flex h-full flex-1 flex-col items-start  justify-between overflow-auto py-2 ">
          <div className="flex w-full flex-row  items-center justify-between">
            <h3 className=" flex-1 truncate text-sm text-gray-800 md:text-base lg:text-lg">
              {name}
            </h3>

            {updatedAt && (
              <TimeAgo
                className=" truncate text-[10px] text-gray-400  lg:text-xs  "
                datetime={`${new Date(updatedAt).toLocaleString()}`}
                live={false}
                opts={{
                  minInterval: 60,
                }}
              />
            )}
          </div>

          <div className="w-full overflow-hidden text-xs text-gray-500 ">
            {["Markdown", "Image", "video"].includes(lastMessage?.text) ? (
              <p className="flex items-center gap-1 ">
                {lastMessage?.text === "Markdown" ? (
                  <BsMarkdown size={16} />
                ) : (
                  <BiImageAlt size={16} />
                )}{" "}
                {capitalizeFirstLetter(lastMessage?.text)}
              </p>
            ) : (
              <p className="max-w-[12rem] truncate "> {lastMessage?.text}</p>
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
      className={` w-[${size}px] h-[${size}px] h-full rounded-md bg-white `}
    />
  );
}
