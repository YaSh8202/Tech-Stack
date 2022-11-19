import React, { useContext, useEffect } from "react";
import { GroupContext } from "../lib/groupContext";
import { UserContext } from "../lib/userContext";
import GroupList from "./GroupList";
import SearchBar from "./SearchBar";
import SidebarNav from "./SidebarNav";

const Sidebar = () => {
  const [search, setSearch] = React.useState("");
  const { selectedGroup } = useContext(GroupContext);
  const { joinedGroups, user } = useContext(UserContext);
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
      }  flex h-full w-0 min-w-[18rem]   flex-1 flex-col   overflow-hidden border-r bg-[#F5FAFC]  md:w-[40vw] `}
    >
      <SidebarNav />
      <SearchBar search={search} setSearch={setSearch} />
      {user && (
        <div className="mx-auto my-2 flex overflow-hidden  rounded-xl bg-white  ">
          <button
            onClick={() => setShowJoined(true)}
            className={`${
              showJoined ? "bg-primary text-white " : "hover:bg-gray-100"
            } bg-white py-2 px-4 font-bold text-gray-500       `}
          >
            Joined
          </button>
          <button
            onClick={() => setShowJoined(false)}
            className={`bg-white text-gray-500   ${
              !showJoined ? "bg-primary text-white " : "hover:bg-gray-100"
            }  py-2 px-4 font-bold  `}
          >
            All
          </button>
        </div>
      )}
      <GroupList showJoined={showJoined} keyword={search} />
    </div>
  );
};

export default Sidebar;
