import "react"
import css from "./Navbar.module.scss";

const NavBar = () => {
    
  return (
    <>
      <div className={css.wrapper}>
        <div className={css.nav_left}>
            <img src="src/assets/react.svg"></img>
          <h3>Music Quiz</h3>
        </div>

        <div className={css.main_menu}>
          <ul>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>About</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
        </div>

      </div>
    </>
  );
};

export default NavBar;