import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <footer className="footer ecl-footer-core">
          <div className="ecl-container ecl-footer-core__container">
            <div className="ecl-footer-core__section ecl-footer-core__section1" />
          </div>
        </footer>
      </>
    );
  }
}

export default Footer;
