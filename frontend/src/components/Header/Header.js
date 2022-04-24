import React from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "./logo.png";
function Header() {
  const history = useNavigate();
  return (
    <nav className="nav">
      <img
        onClick={() => history("/")}
        src={logo}
        alt="Bankist logo"
        className="nav__logo"
        id="logo"
      />
      <ul className="nav__links">
        <li className="nav__item">
          <a className="nav__link" href="#section--1">
            Features
          </a>
        </li>
        <li className="nav__item">
          <a className="nav__link" href="#section--2">
            Operations
          </a>
        </li>
        <li className="nav__item">
          <Link
            to="/login"
            className="nav__link nav__link--btn btn--show-modal"
            style={{
              color: "white",
            }}
          >
            Start Now
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
