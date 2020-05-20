import React, { Component } from "react";
import colors from "../../../config/colors";

const backgroundEUimage = require("../../../assets/images/eu-background.svg");

class VP extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="credentialData">
        <img
          src={backgroundEUimage}
          height="196"
          width="196"
          className="logo rounded mr-2"
          alt=""
        />
        <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
          <b>Verifiable eID Presentation.</b>
        </p>
      </div>
    );
  }
}

export default VP;
