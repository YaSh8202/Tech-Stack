import Image from "next/image";
import React from "react";

const Group = ({ groupImage, title, lastMessage }) => {
  return (
    <div className="flex flex-row items-center h-16 rounded-md cursor-pointer hover:bg-gray-100  ">
      <Image
        src={groupImage}
        layout="intrinsic"
        width={60}
        height={60}
        alt=""
        className="rounded-md h-full"
      />
      <div className="flex flex-1 h-full py-2 flex-col items-start justify-between px-2 ">
        <div className="flex flex-row w-full  items-center justify-between">
          <h3 className="text-lg flex-1 text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">{`05:14pm`}</p>
        </div>
        <p className="text-xs text-gray-500">{lastMessage}</p>
      </div>
    </div>
  );
};

export default Group;
