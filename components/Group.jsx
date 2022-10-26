import Image from "next/image";
import React, { useContext, useState } from "react";
import { Flipped } from "react-flip-toolkit";
import TimeAgo from "timeago-react";
import { GroupContext } from "../lib/groupContext";
import Ripples from "react-ripples";

const Group = ({ group }) => {
  const { selectedGroup, setSelectedGroup } = useContext(GroupContext);
  const { image, name, lastMessage, updatedAt } = group;
  return (
    <Flipped flipId={group.id}>
      <Ripples>
        <div
          onClick={() => {
            setSelectedGroup(group);
          }}
          className={`flex w-full box-border flex-row items-center h-12 lg:h-16 rounded-md cursor-pointer hover:bg-gray-100 focus:animate-ping ${
            selectedGroup?.name === name ? "bg-gray-100" : ""
          } `}
          onAnimationEnd={() => setEffect(false)}
        >
          <div className="h-full aspect-square ">
            <GroupImage size={60} image={image} />
          </div>
          <div className="flex flex-col flex-1 h-full lg:py-2  items-start justify-between px-2 ">
            <div className="flex flex-row w-full  items-center justify-between">
              <h3 className=" text-base lg:text-lg truncate flex-1 text-gray-800">
                {name}
              </h3>

              {updatedAt && (
                <p className="truncate text-right text-[10px] lg:text-xs text-gray-400  ">
                  <TimeAgo
                    className=" text-[10px] lg:text-xs text-gray-400 ml-2 truncate "
                    datetime={`${new Date(updatedAt).toLocaleString()}`}
                    live={false}
                    opts={{
                      minInterval: 60,
                    }}
                  />
                </p>
              )}
            </div>
            {updatedAt && (
              <p className="text-xs flex-1 w-full  text-gray-500 truncate ">
                {lastMessage?.text}
              </p>
            )}
          </div>
        </div>
      </Ripples>
    </Flipped>
  );
};

export default Group;

export function GroupImage({ image, size }) {
  return (
    <Image
      src={image}
      layout="responsive"
      width={size}
      height={size}
      alt=""
      className={` w-[${size}px] h-[${size}px] rounded-md h-full  `}
    />
  );
}
