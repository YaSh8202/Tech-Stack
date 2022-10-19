import React, { useContext, useState } from "react";
import { UserContext } from "../lib/userContext";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { SiOpenai } from "react-icons/si";
import { GroupContext } from "../lib/groupContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import Image from "next/image";
// import { BsGithub } from "react-icons/bs";

const SidebarNav = () => {
  const { user, username, setUserModal } = useContext(UserContext);
  const { setSelectedGroup, selectedGroup } = useContext(GroupContext);
  const [showMenu, setShowMenu] = useState(false);

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
            {/* {user ? ( */}
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
            {/* ) : (
              <FaUserCircle
                className="text-gray-600 bg-transparent"
                size={40}
              />
            )} */}
          </button>
        </div>
        <div className=" flex items-center relative ">
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
              size={28}
            />
          </button>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="ml-3 relative group "
          >
            <FiChevronDown className="text-gray-600  " size={28} />
          </button>
          <div
            className={`bg-white border right-1.5 top-9 px-3  w-24 py-3 absolute rounded-lg flex flex-col hover:bg-gray-100 gap-2 ${
              showMenu ? "block" : "hidden"
            } z-10 `}
          >
            <button
              onClick={() => {
                if (username) {
                  signOut(auth);
                } else {
                  setUserModal(true);
                }
                setShowMenu(false);
              }}
              className=""
            >
              {username ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
