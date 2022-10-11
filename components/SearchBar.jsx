import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchBar = () => {
  return (
    <div className="rounded-full flex flex-row items-center border bg-white w-full h-12 px-3 py-2.5 mt-2 ">
      <label>
        <BiSearchAlt2 className=" text-gray-500" size={20} />
      </label>
      <input
        type="text"
        placeholder="Search"
        className="w-full h-full outline-none pl-2 placeholder:text-gray-500 text-700 "
      />
    </div>
  );
};

export default SearchBar;
