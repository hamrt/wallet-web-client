import React, { Component } from "react";
import "./Header.css";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import colors from "../../config/colors";
import Ribbon from "../Ribbon/Ribbon";
import { logout } from "../../apis/ecas";

const euLogo = require("../../assets/images/logo_en.gif");

class Header extends Component {
  doLogOut = () => {
    sessionStorage.clear();
    logout();
  };

  render() {
    return (
      <header className="App-header">
        <Navbar collapseOnSelect expand="lg" variant="dark">
          <Navbar.Brand
            variant="dark"
            style={{ color: colors.EC_BLUE }}
            as={Link}
            to={{
              pathname: "/profile",
            }}
          >
            <img
              src={euLogo}
              className="d-inline-block align-top"
              alt="EU logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle
            className="items"
            aria-controls="responsive-navbar-nav"
            style={{ backgroundColor: colors.EC_BLUE }}
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" />
            <Nav className="items">
              <Nav.Item>
                <Nav.Link
                  style={{ color: colors.EC_BLUE }}
                  as={Link}
                  to={{
                    pathname: "/credentials",
                  }}
                >
                  Credentials
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  style={{ color: colors.EC_BLUE }}
                  as={Link}
                  to={{
                    pathname: "/notifications",
                  }}
                >
                  Notifications
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  style={{ color: colors.EC_BLUE }}
                  as={Link}
                  to={{
                    pathname: "/presentations",
                  }}
                >
                  Presentations
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  style={{ color: colors.EC_BLUE }}
                  as={Link}
                  to={{
                    pathname: "/profile",
                  }}
                >
                  My Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  style={{ color: colors.EC_BLUE }}
                  onClick={() => this.doLogOut()}
                >
                  Logout
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Ribbon />
      </header>
    );
  }
}

export default Header;
