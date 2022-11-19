import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="mx-2 mt-2 flex h-12 flex-row items-center overflow-hidden rounded-full border bg-white px-3 py-2.5 focus-within:border-[#128C7E] ">
      <label>
        <BiSearchAlt2 className=" text-gray-500" size={20} />
      </label>
      <input
        type="text"
        placeholder="Search"
        className="text-700 group  h-full w-full pl-2 outline-none placeholder:text-gray-500  "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
