import React, { useContext, useState } from "react";
import { UserContext } from "../lib/userContext";
import ProfileAvatar from "./ProfileAvatar";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import LoginModal from "./Modals/LoginModal";
import { SiOpenai } from "react-icons/si";
import { GroupContext } from "../lib/groupContext";

const SidebarNav = () => {
  const { user } = useContext(UserContext);
  const { setSelectedGroup, selectedGroup } = useContext(GroupContext);

  return (
    <div className="  w-full px-3 py-2 h-16">
      <div className="flex-row h-full flex items-center justify-between">
        <div>
          {user ? (
            <LoginModal>
              <ProfileAvatar profilePic={user?.photoURL} size={40} />
            </LoginModal>
          ) : (
            <LoginModal>
              <FaUserCircle
                className="text-gray-600 bg-transparent"
                size={40}
              />
            </LoginModal>
          )}
        </div>
        <div className=" flex items-center group ">
          <button
            onClick={() => {
              setSelectedGroup({
                id: "open-ai",
                name: "Ask a Question",
                image: "/openAI.png",
              });
            }}
          >
            <SiOpenai
              className={` ${
                selectedGroup.id === "open-ai" ? "text-red-500" : ""
              } text-gray-600 bg-transparent  group-hover:text-red-400 group-hover:scale-105  `}
              size={28}
            />
          </button>
          <button className="ml-3  ">
            <FiChevronDown className="text-gray-600  " size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
