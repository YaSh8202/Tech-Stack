import React from "react";
import { BiLeftArrowAlt } from "react-icons/bi";

const SearchInput = ({ searchKey, setSearchKey, hideSearchBar }) => {
  return (
    <div className="mt-2 box-border flex h-9 w-full  flex-row items-center rounded bg-[#DEDEE2] px-2 ">
      <button onClick={hideSearchBar}>
        <BiLeftArrowAlt className="h-5 w-5 text-gray-700" />
      </button>
      <div className="flex h-full flex-1 items-center ">
        <input
          autoFocus
          type="text"
          className="h-full flex-1 bg-transparent pl-2 outline-none placeholder:text-gray-800 "
          placeholder="Search"
          id="search"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        {/* <button htlmlFor="search" type="submit" className="hidden" /> */}
      </div>
    </div>
  );
};

export default SearchInput;
