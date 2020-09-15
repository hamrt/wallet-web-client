import React, { useState } from "react";
import "./Header.css";
import logo from "@ecl/ec-preset-website/dist/images/logo/logo--en.svg";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { Link, NavLink } from "react-router-dom";
import { Ribbon } from "../Ribbon/Ribbon";
import { logout } from "../../apis/ecas";

export const Header: React.FunctionComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const doLogOut = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.removeItem("Jwt");
    logout();
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="ecl-site-header-harmonised--group1 ecl-site-header-harmonised">
      <div className="ecl-site-header-harmonised__container ecl-container">
        <div className="ecl-site-header-harmonised__top">
          <Link
            className="ecl-link ecl-link--standalone ecl-site-header-harmonised__logo-link"
            to="/profile"
            aria-label="European Commission"
          >
            <img
              alt="European Commission logo"
              title="European Commission"
              className="ecl-site-header-harmonised__logo-image"
              src={logo}
            />
          </Link>
        </div>
      </div>
      {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
      <nav
        data-ecl-auto-init="Menu"
        className="ecl-menu--group1 ecl-menu"
        data-ecl-menu
        aria-expanded={isMenuOpen}
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div
          className="ecl-menu__overlay"
          data-ecl-menu-overlay
          onClick={closeMenu}
        />
        <div className="ecl-container ecl-menu__container">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link
            className="ecl-link ecl-link--standalone ecl-menu__open"
            to="#"
            data-ecl-menu-open
            onClick={openMenu}
          >
            <svg
              focusable="false"
              aria-hidden="true"
              className="ecl-icon ecl-icon--s"
            >
              <use xlinkHref={`${eclIcons}#general--hamburger`} />
            </svg>
            Menu
          </Link>
          <div className="ecl-menu__site-name">EBSI Wallet</div>
          <section className="ecl-menu__inner" data-ecl-menu-inner>
            <header className="ecl-menu__inner-header">
              <button
                data-ecl-menu-close
                type="button"
                className="ecl-menu__close ecl-button ecl-button--text"
                onClick={closeMenu}
              >
                <span className="ecl-menu__close-container ecl-button__container">
                  <svg
                    focusable="false"
                    aria-hidden="true"
                    data-ecl-icon
                    className="ecl-button__icon ecl-button__icon--before ecl-icon ecl-icon--s"
                  >
                    <use xlinkHref={`${eclIcons}#ui--close-filled`} />
                  </svg>
                  <span className="ecl-button__label" data-ecl-label>
                    Close
                  </span>
                </span>
              </button>
              <div className="ecl-menu__title">Menu</div>
              <button
                data-ecl-menu-back
                type="submit"
                className="ecl-menu__back ecl-button ecl-button--text"
              >
                <span className="ecl-button__container">
                  <svg
                    focusable="false"
                    aria-hidden="true"
                    data-ecl-icon
                    className="ecl-button__icon ecl-button__icon--before ecl-icon ecl-icon--s ecl-icon--rotate-270"
                  >
                    <use xlinkHref={`${eclIcons}#ui--corner-arrow`} />
                  </svg>
                  <span className="ecl-button__label" data-ecl-label>
                    Back
                  </span>
                </span>
              </button>
            </header>
            <ul className="ecl-menu__list">
              <li className="ecl-menu__item" data-ecl-menu-item>
                <NavLink
                  to="/profile"
                  className="ecl-menu__link"
                  activeClassName="ecl-menu__link--active"
                  data-ecl-menu-link
                >
                  My Profile
                </NavLink>
              </li>
              <li className="ecl-menu__item" data-ecl-menu-item>
                <NavLink
                  to="/credentials"
                  className="ecl-menu__link"
                  activeClassName="ecl-menu__link--active"
                  data-ecl-menu-link
                >
                  Credentials
                </NavLink>
              </li>
              <li className="ecl-menu__item" data-ecl-menu-item>
                <NavLink
                  to="/notifications"
                  className="ecl-menu__link"
                  activeClassName="ecl-menu__link--active"
                  data-ecl-menu-link
                >
                  Notifications
                </NavLink>
              </li>
              <li className="ecl-menu__item" data-ecl-menu-item>
                <NavLink
                  to="/presentations"
                  className="ecl-menu__link"
                  activeClassName="ecl-menu__link--active"
                  data-ecl-menu-link
                >
                  Presentations
                </NavLink>
              </li>
              <li className="ecl-menu__item" data-ecl-menu-item>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link
                  to="#"
                  onClick={doLogOut}
                  className="ecl-menu__link"
                  data-ecl-menu-link
                >
                  Logout
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </nav>
      <Ribbon />
    </header>
  );
};

export default Header;
