import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchBar = ({ search, setSearch }) => {
  return (
    <div>
      <div className="rounded-full flex flex-row items-center border bg-white w-full h-12 px-3 py-2.5 mt-2 focus-within:border-[#128C7E] ">
        <label>
          <BiSearchAlt2 className=" text-gray-500" size={20} />
        </label>
        <input
          type="text"
          placeholder="Search"
          className="w-full group  h-full outline-none pl-2 placeholder:text-gray-500 text-700  "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
