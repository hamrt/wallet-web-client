import React, { Component } from "react";
import "./VID.css";
import colors from "../../../config/colors";

type Props = {
  data: any;
};

class VID extends Component<Props> {
  componentDidMount() {}

  render() {
    const { data } = this.props;
    try {
      const parsedData = JSON.parse(data);
      return (
        <div className="credentialData">
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Person Identifier</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.personIdentifier}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Family Name</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.currentFamilyName}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Given Name</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.currentGivenName}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Birth Name</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.birthName}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Date of Birth</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.dateOfBirth}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Address</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.currentAddress}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Gender</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.gender}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>DID</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{parsedData.credentialSubject.id}</b>
          </p>
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Government ID</u>
            </b>
          </p>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>
              {parsedData.credentialSubject.govId !== ""
                ? parsedData.credentialSubject.govId
                : " - "}
            </b>
          </p>
        </div>
      );
    } catch (error) {
      return (
        <div className="credentialData">
          <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
            <b>
              <u>Error Parsing the Verifiable eID.</u>
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

export default VID;
