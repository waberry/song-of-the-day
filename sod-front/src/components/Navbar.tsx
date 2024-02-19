import { useState } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { MdDensityMedium } from "react-icons/md";

import css from "./Navbar.module.scss";

const NavBar = () => {
    
  //search bar toggle with search and cross button
  const [search, setSearch] = useState(false);
  const openSearchBar = () =>{
    setSearch(true);
    console.log(search);
  };

  const closeSearchBar = () =>{
    setSearch(false);
    console.log(search);
  }

  //toggle btn
  const [toggle, setToggle] = useState(false);
  const toggled = () =>{
    setToggle(prev => !prev)
    console.log(toggle)
  }

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.nav_left}>
            <img src="" ></img>
          <h3>Song Of the Day</h3>
        </div>

        {/* <div className={`${css.main_menu} ${toggle ? css["main_menu--open"] : {}}`}> */}
        <div className={css.main_menu}>
          <ul>
            <li>
              <a>HOME</a>
            </li>
            <li>
              <a>ABOUT</a>
            </li>
            <li>
              <a>CONTACT</a>
            </li>
          </ul>
        </div>

        {/* <div className={search ? css.search_show : css.search_hide}> */}
        <div className={css.search_show}>
          <input placeholder="Search here. . ."></input>
        </div>

        <div>
          <div className={css.btns}>
            <span>
              <BsSearchHeart onClick={openSearchBar}></BsSearchHeart>

              <RxCrossCircled
                className={search ? css.show_btn : css.hide_btn}
                onClick={closeSearchBar}
              ></RxCrossCircled>
            </span>
            <MdDensityMedium className={css.toggle_btn} onClick={toggled}></MdDensityMedium>
          </div>
        </div>

        
      </div>
    </>
  );
};

export default NavBar;