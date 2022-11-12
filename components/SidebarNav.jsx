import React, { useContext, useState } from "react";
import { UserContext } from "../lib/userContext";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronDown, FiGithub } from "react-icons/fi";
import { SiOpenai } from "react-icons/si";
import { GroupContext } from "../lib/groupContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import Image from "next/image";
import DropDownMenu from "./RightSection/Menu";
import { Menu } from "@headlessui/react";
// import { BsGithub } from "react-icons/bs";

const SidebarNav = () => {
  const { user, username, setUserModal } = useContext(UserContext);
  const { setSelectedGroup, selectedGroup } = useContext(GroupContext);

  return (
    <div className="  w-full px-3 py-2 h-16">
      <div className="flex-row h-full flex items-center justify-between">
        <div>
          <button
            className="w-11 h-11  bg-gray-200 p-1 rounded-full "
            onClick={() => {
              setUserModal(true);
            }}
          >
            <Image
              src={
                user?.photoURL ??
                "https://img.icons8.com/material-rounded/452/user.png"
              }
              alt=""
              className="rounded-full cursor-pointer "
              layout="intrinsic"
              width={40}
              height={40}
            />
          </button>
        </div>
        <div className=" flex items-center relative gap-4">
          <a
            target={"_blank"}
            rel="noopener noreferrer"
            href={"https://github.com/YaSh8202/Tech-Stack"}
            className="group"
          >
            <FiGithub
              className={`  text-gray-600 bg-transparent  group-hover:scale-105  `}
              size={26}
            />
          </a>
          <button
            onClick={() => {
              setSelectedGroup({
                id: "open-ai",
                name: "Ask a Question",
                image: "/openAI.png",
              });
            }}
            className="group"
          >
            <SiOpenai
              className={` ${
                selectedGroup?.id === "open-ai" ? "text-[#128C7E]" : ""
              } text-gray-600 bg-transparent  group-hover:text-[#128C7E] group-hover:scale-105  `}
              size={26}
            />
          </button>

          <DropDownMenu>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    if (username) {
                      signOut(auth);
                    } else {
                      setUserModal(true);
                    }
                    setShowMenu(false);
                  }}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } block px-4 py-2 text-sm  w-full `}
                >
                  {username ? "Logout" : "Login"}
                </button>
              )}
            </Menu.Item>
          </DropDownMenu>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
