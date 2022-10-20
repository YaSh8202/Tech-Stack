import React, { useContext } from "react";
import { GroupContext } from "../lib/groupContext";
import GroupList from "./GroupList";
import SearchBar from "./SearchBar";
import SidebarNav from "./SidebarNav";

const Sidebar = () => {
  const [search, setSearch] = React.useState("");
  const {selectedGroup} = useContext(GroupContext);
  return (
    <div className={`  ${selectedGroup ? "hidden md:flex ":"flex  "}  bg-[#F5FAFC] h-full md:w-[40vw]   flex-col flex   border-r px-5 flex-1  `}>
      <SidebarNav />
      <SearchBar search={search} setSearch={setSearch} />
      <GroupList keyword={search} />
    </div>
  );
};

export default Sidebar;
