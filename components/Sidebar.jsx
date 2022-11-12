import React, { useContext, useEffect } from "react";
import { GroupContext } from "../lib/groupContext";
import { UserContext } from "../lib/userContext";
import GroupList from "./GroupList";
import SearchBar from "./SearchBar";
import SidebarNav from "./SidebarNav";

const Sidebar = () => {
  const [search, setSearch] = React.useState("");
  const { selectedGroup } = useContext(GroupContext);
  const [joinedGroups] = useContext(UserContext);
  const [showJoined, setShowJoined] = React.useState(true);

  useEffect(() => {
    if (joinedGroups?.length === 0) {
      setShowJoined(false);
    }
  }, [joinedGroups]);

  return (
    <div
      className={`  ${
        selectedGroup ? "hidden md:flex " : "flex  "
      }  bg-[#F5FAFC] h-full w-0 md:w-[40vw]   flex-col flex   border-r flex-1 overflow-hidden px-4 md:px-5 min-w-[18rem] `}
    >
      <SidebarNav />
      <SearchBar search={search} setSearch={setSearch} />
      <div className="flex mx-auto my-2 bg-white  rounded-xl overflow-hidden  ">
        <button
          onClick={() => setShowJoined(true)}
          className={`${
            showJoined ? "bg-primary text-white " : "hover:bg-gray-100"
          } bg-white text-gray-500 font-bold py-2 px-4       `}
        >
          Joined
        </button>
        <button
          onClick={() => setShowJoined(false)}
          className={`bg-white text-gray-500   ${
            !showJoined ? "bg-primary text-white " : "hover:bg-gray-100"
          }  font-bold py-2 px-4  `}
        >
          All
        </button>
      </div>
      <GroupList showJoined={showJoined} keyword={search} />
    </div>
  );
};

export default Sidebar;
