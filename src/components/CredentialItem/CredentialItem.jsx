import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroup } from "react-bootstrap";
import "./CredentialItem.css";
import colors from "../../config/colors";
import * as transform from "../../utils/StringTransformation";
import * as config from "../../config/config";
import * as models from "../../models/Models";
import strB64dec from "../../utils/strB64dec";
import { getDID, getUserName } from "../../utils/DataStorage";

const logoDiploma = require("../../assets/images/diploma.png");

class CredentialItem extends Component {
  getEmisorName = (emisor) => {
    let emisorName = emisor;
    if (config.DID_EBSI_SERVICES[emisor] !== undefined) {
      emisorName = config.DID_EBSI_SERVICES[emisor];
    }
    if (emisor === getDID()) {
      emisorName = getUserName();
    }
    return emisorName;
  };

  getIssuer(credential) {
    try {
      let issuer;
      if (credential.name === "VerifiablePresentation") {
        issuer = this.getEmisorName(credential.did);
      } else {
        const dataInBase64 = credential.data.base64;
        const data = strB64dec(dataInBase64);
        const dataInJSON = JSON.parse(data);
        issuer = this.getEmisorName(dataInJSON.issuer);
      }
      return issuer;
    } catch (error) {
      return "-";
    }
  }

  render() {
    const { credential, methodToOpen } = this.props;
    return (
      <ListGroup.Item
        className="credential"
        action
        onClick={() => methodToOpen(credential.hash)}
        key={credential.id}
        style={{ backgroundColor: colors.EC_BLUE }}
      >
        <img
          src={logoDiploma}
          height="32"
          width="32"
          className="logo rounded mr-2"
          alt=""
        />
        <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
          <b>
            {transform.modifyName(
              credential.name,
              "credential",
              credential.did
            )}
          </b>
        </p>
        <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
          Issued By: {this.getIssuer(credential)}{" "}
        </p>
      </ListGroup.Item>
    );
  }
}

export default CredentialItem;
CredentialItem.defaultProps = {
  methodToOpen: () => {},
};
CredentialItem.propTypes = {
  credential: PropTypes.shape(models.credentialShape).isRequired,
  methodToOpen: PropTypes.func,
};
