import React, { useContext, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { GroupContext } from "../../lib/groupContext";
import SearchInput from "./SearchInput";
import SearchMessage from "./SearchMessage";
import { motion } from "framer-motion";

const SearchSideBar = () => {
  const [searchKey, setSearchKey] = useState("");
  const { messages, setShowSearchBar } = useContext(GroupContext);
  const [filteredMessages, setFilteredMessages] = useState([]);

  const hideSearchBar = () => {
    setShowSearchBar(false);
  };

  useEffect(() => {
    if (!searchKey) {
      setFilteredMessages([]);
      return;
    }
    const filteredMessages = messages.filter((message) =>
      message.text.toLowerCase().includes(searchKey.toLowerCase())
    );
    setFilteredMessages(filteredMessages);
  }, [searchKey, messages]);

  return (
    <motion.aside
      initial={"hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      variants={{
        visible: { width: "100%" },
        hidden: { width: "0%" },
      }}
      className=" absolute right-0 top-0 bottom-0 box-border max-w-[20rem] overflow-hidden border-l bg-gray-50 lg:relative lg:flex-[1.25]"
    >
      {/* Header */}
      <div className="box-border flex h-[70px] w-full flex-row items-center overflow-hidden bg-[#F7F7FC] py-4 px-4  ">
        <button onClick={hideSearchBar}>
          <IoMdClose className="h-5 w-5 text-gray-700 " />
        </button>
        <h2 className="ml-5 text-lg font-semibold text-gray-700">Search</h2>
      </div>
      {/* Header End */}
      <div className="box-border flex w-full flex-col items-start px-2 ">
        <SearchInput
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          hideSearchBar={hideSearchBar}
        />
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className="mt-2 flex w-full flex-col items-start gap-2  "
          >
            <SearchMessage message={message} />
          </div>
        ))}
      </div>
    </motion.aside>
  );
};

export default SearchSideBar;
