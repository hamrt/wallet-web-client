import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Diploma.css";
import colors from "../../../config/colors";

class Diploma extends Component {
  componentDidMount() {}

  render() {
    const { data } = this.props;
    try {
      // No need to parse the data
      // const parsedData = JSON.parse(data);
      const parsedData = JSON.parse(data);
      return (
        <div className="credentialData">
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Issuer</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.issuer}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Title</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.achievements[0].title}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Issuance Date</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.achievements[0].issuedDate}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>ISCED-F Code</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>
              {
                parsedData.credentialSubject.achievements[0]
                  .learningSpecification.iscedFcode
              }
            </b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Target Framework</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>
              {
                parsedData.credentialSubject.achievements[0]
                  .learningSpecification.hasAccreditation.targetFramework
              }
            </b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Numeric Score</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>
              {
                parsedData.credentialSubject.achievements[0].hasPart[0]
                  .wasDerivedFrom.grade.numericScore
              }
            </b>
          </p>
        </div>
      );
    } catch (error) {
      return (
        <div className="credentialData">
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Error Parsing the Diploma.</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>Contact the issuer to check what happens.</b>
          </p>
        </div>
      );
    }
  }
}

export default Diploma;
Diploma.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any.isRequired,
};
