import React from "react";
import GroupList from "./GroupList";
import SearchBar from "./SearchBar";
import SidebarNav from "./SidebarNav";

const Sidebar = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="bg-[#F5FAFC] h-full w-[30vw] flex-col flex   border-r px-5 ">
      <SidebarNav />
      <SearchBar search={search} setSearch={setSearch} />
      <GroupList keyword={search} />
    </div>
  );
};

export default Sidebar;
