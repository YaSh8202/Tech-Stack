import React, { useContext, useState } from "react";
import { UserContext } from "../lib/userContext";
import ProfileAvatar from "./ProfileAvatar";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { FiChevronDown } from "react-icons/fi";
import LoginModal from "./Modals/LoginModal";

const SidebarNav = () => {
  const { user } = useContext(UserContext);

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
        <div>
          <button>
            <FiChevronDown className="text-gray-600" size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
