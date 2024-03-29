import { useState, SyntheticEvent } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { SpotifyTrack } from "scr/utils/interfaces";
import "./SearchBar.css";

export interface SearchBarProps {
  items: SpotifyTrack[]; // Update type to match your data structure
  itemSelection: Function;
  sendQueryString: Function;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  items,
  itemSelection,
  sendQueryString,
  isLoading,
}: SearchBarProps): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const handleInputChange = (event: SyntheticEvent) => {
    setSearchValue(event.target.value);
  };

  const handleKeyboardEvent = (event: SyntheticEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // event.preventDefault();
    // console.log("Search value:", searchValue);
    sendQueryString(searchValue);
    if (items.length) setShowDropDown(!showDropDown);
  };

  const onClickHandler = (item: SpotifyTrack): void => {
    itemSelection(item);
    setShowDropDown(false);
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
      <div
        className={showDropDown && !isLoading ? "dropdown" : "dropdown_hidden"}
      >
        {items.map((item: SpotifyTrack, index: number): JSX.Element => {
          return (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => onClickHandler(item)}
            >
              {item.album.images.length && (
                <div className="dropdown-item">
                  <img
                    src={item.album.images[0].url}
                    // alt={item.name}
                    className="dropdown-image"
                  />
                  {/* <span>{item.name}</span>{" "} */}
                </div>
              )}
              <p className="dropdown-text">{item.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SearchBar;
