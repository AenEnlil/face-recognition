import React from "react";
import { NavLink } from "react-router-dom";

import "./header.scss";
import Logo from "../../assets/images/logo.jpg";

function Header() {
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
          <li>
            <NavLink to="/sign-in">Sign In</NavLink>
          </li>
          <li>
            <NavLink to="/sign-up">Sign Up</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
