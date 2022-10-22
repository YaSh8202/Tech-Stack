import React from "react";
import { BiLeftArrowAlt } from "react-icons/bi";

const SearchInput = ({ searchKey, setSearchKey, hideSearchBar }) => {
  return (
    <div className="bg-[#DEDEE2] px-2 rounded w-full box-border  h-9 flex flex-row items-center mt-2 ">
      <button onClick={hideSearchBar}>
        <BiLeftArrowAlt className="h-5 w-5 text-gray-700" />
      </button>
      <div className="h-full flex-1 flex items-center ">
        <input
          autoFocus
          type="text"
          className="pl-2 h-full bg-transparent placeholder:text-gray-800 flex-1 outline-none "
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
