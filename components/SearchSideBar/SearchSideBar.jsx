import React, { useContext, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { GroupContext } from "../../lib/groupContext";
import SearchInput from "./SearchInput";
import SearchMessage from "./SearchMessage";

const SearchSideBar = () => {
  const [searchKey, setSearchKey] = useState("");
  const { messages, setShowSearchBar } = useContext(GroupContext);
  const [filteredMessages, setFilteredMessages] = useState([]);

  const hideSearchBar = () => {
    setShowSearchBar(false);
  };

  useEffect(() => {
    if (!searchKey || searchKey === "") {
      setFilteredMessages([]);
      return;
    }
    const filteredMessages = messages.filter((message) =>
      message.text.toLowerCase().includes(searchKey.toLowerCase())
    );
    setFilteredMessages(filteredMessages);
  }, [searchKey, messages]);

  return (
    <div className="flex-[1.25] box-border border-l overflow-auto">
      {/* Header */}
      <div className="w-full box-border flex items-center flex-row py-4 px-4 bg-[#F7F7FC] h-[70px]  ">
        <button onClick={hideSearchBar} >
          <IoMdClose className="w-5 h-5 text-gray-700 " />
        </button>
        <h2 className="ml-5 text-lg text-gray-700 font-semibold">Search</h2>
      </div>
      {/* Header End */}
      <div className="flex flex-col items-start w-full px-2 box-border ">
        <SearchInput searchKey={searchKey} setSearchKey={setSearchKey} hideSearchBar={hideSearchBar} />
        {filteredMessages.map((message) => (
          <div key={message.id} className="w-full flex flex-col items-start gap-2 mt-2  ">
            <SearchMessage message={message} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSideBar;
