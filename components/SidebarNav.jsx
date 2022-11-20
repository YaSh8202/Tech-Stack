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
import { useRouter } from "next/router";
// import { BsGithub } from "react-icons/bs";

const SidebarNav = () => {
  const { user, username, setUserModal } = useContext(UserContext);
  const { setSelectedGroup, selectedGroup } = useContext(GroupContext);
  const router = useRouter();

  return (
    <div className="  h-16 w-full px-3 py-2">
      <div className="flex h-full flex-row items-center justify-between">
        <div>
          <button
            className="h-11 w-11  rounded-full bg-gray-200 p-1 "
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
              className="cursor-pointer rounded-full "
              layout="intrinsic"
              width={40}
              height={40}
            />
          </button>
        </div>
        <div className=" relative flex items-center gap-4">
          <a
            target={"_blank"}
            rel="noopener noreferrer"
            href={"https://github.com/YaSh8202/Tech-Stack"}
            className="group"
          >
            <FiGithub
              className={`  bg-transparent text-gray-600  group-hover:scale-105  `}
              size={26}
            />
          </a>
          <button
            onClick={() => {
              router.push("/");
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
              } bg-transparent text-gray-600  group-hover:scale-105 group-hover:text-[#128C7E]  `}
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
                  }}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } block w-full px-4 py-2  text-sm `}
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
