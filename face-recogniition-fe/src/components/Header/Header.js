import {React} from "react";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";

import AuthService from "../../services/AuthService";

import "./header.scss";
import Logo from "../../assets/images/logo.jpg";

function Header() {
  const isLogged = Cookies.get("isLogged");

  function logOut() {
    AuthService.signOut();
    Cookies.set("isLogged", false)
  }

  return (
    <header className="header">
      <div className="identity">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>
        <h1>Face Recognizer</h1>
      </div>
      <nav className="navigationMenu">
        <ul className="nav">
          {isLogged && isLogged === true ? (
            <li>
              <button className='navItemBtn'onClick={() => logOut()}>LogOut</button>
            </li>
          ) : (
            <>
              <li>
                <NavLink className='navItem' to="/sign-in">Sign In</NavLink>
              </li>
              <li>
                <NavLink className='navItem' to="/sign-up">Sign Up</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
