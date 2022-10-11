import React, { useContext } from "react";
import { UserContext } from "../lib/userContext";
import GroupList from "./GroupList";
import ProfileAvatar from "./ProfileAvatar";
import SearchBar from "./SearchBar";
import SidebarNav from "./SidebarNav";

const Sidebar = () => {
  return (
    <div className="bg-[#F5FAFC] h-full w-[25vw] flex-col flex   border-r px-5 ">
      <SidebarNav />
      <SearchBar />
      <GroupList />
    </div>
  );
};

export default Sidebar;
