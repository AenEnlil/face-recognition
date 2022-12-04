import { React, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router";

import AuthService from "../../services/AuthService";

import "./header.scss";
import Logo from "../../assets/images/logo.jpg";

function Header() {
  const isLogged = Cookies.get("isLogged");
  let location = useLocation();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (isLogged === "true") {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, [isLogged, location]);

  function logOut() {
    AuthService.signOut();
    Cookies.remove("isLogged");
    Cookies.remove("access");
    Cookies.remove("refresh");
  }

  function renderTopBtns() {
    if (logged && logged === true) {
      return (
        <>
          <li>
            <NavLink className="navItem" to="/user-profile">
              Profile
            </NavLink>
          </li>
          <li>
            <button className="navItemBtn" onClick={() => logOut()}>
              LogOut
            </button>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <NavLink className="navItem" to="/sign-in">
              Sign In
            </NavLink>
          </li>
          <li>
            <NavLink className="navItem" to="/sign-up">
              Sign Up
            </NavLink>
          </li>
        </>
      );
    }
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
        <ul className="nav">{renderTopBtns()}</ul>
      </nav>
    </header>
  );
}

export default Header;
