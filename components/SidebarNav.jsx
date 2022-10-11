import React, { useContext } from "react";
import { UserContext } from "../lib/userContext";
import ProfileAvatar from "./ProfileAvatar";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { FiChevronDown } from "react-icons/fi";

const SidebarNav = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const loginHandler = (e) => {
    router.push("./enter");
  };

  return (
    <nav className="  w-full px-3 py-2 h-16">
      <ul className="flex-row h-full flex items-center justify-between">
        <li>
          {user ? (
            <ProfileAvatar profilePic={user?.photoURL} size={40} />
          ) : (
            <button onClick={loginHandler}>
              <FaUserCircle className="text-gray-600 bg-gray-200" size={40} />
            </button>
          )}
        </li>
        <li>
          <button>
            <FiChevronDown className="text-gray-600" size={28} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarNav;
