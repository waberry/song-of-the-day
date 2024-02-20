import { useState, SyntheticEvent } from "react";
import { BsSearchHeart } from "react-icons/bs";
// import { RxCrossCircled } from "react-icons/rx";
// import { MdDensityMedium } from "react-icons/md";

import './SearchBar.css';

const SearchBar = () => {
    
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (event :SyntheticEvent) => {
    console.log(searchValue);
    setSearchValue(event.target.value);
  };

  const handleKeyboardEvent = (event :SyntheticEvent) => {
    if (event.key === "Enter"){
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // event.preventDefault();
    console.log("Search value:", searchValue);
  };
  
  return (
    <>
      <div className="wrapper">

        <div className={"search_show"}>
            <input
              placeholder="Search here..."
              value={searchValue}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyboardEvent}
            />
        </div>

        <div>
          <div className="btns">
            <span>
              <BsSearchHeart onClick={handleSubmit}></BsSearchHeart>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
