import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroup, Form } from "react-bootstrap";
import "./CredentialItemPresentation.css";
import colors from "../../config/colors";
import * as transform from "../../utils/StringTransformation";
import * as config from "../../config/config";
import * as models from "../../models/Models";
import { getDID, getUserName } from "../../utils/DataStorage";
import strB64dec from "../../utils/strB64dec";

const diplomaImage = require("../../assets/images/diploma.png");

class CredentialItemPresentation extends Component {
  getEmisorName = (emisor) => {
    let emisorName = emisor;
    if (emisor === getDID()) {
      emisorName = getUserName();
    }
    if (config.DID_EBSI_SERVICES[emisor] !== undefined) {
      emisorName = config.DID_EBSI_SERVICES[emisor];
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
    const { credential, methodToSelect } = this.props;
    return (
      <ListGroup.Item
        className="credential ecl-card ecl-card--title"
        key={credential.id}
        style={{ backgroundColor: colors.EC_BLUE }}
      >
        <img
          src={diplomaImage}
          height="32"
          width="32"
          className="logo rounded mr-2"
          alt=""
        />
        <div>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>
              {transform.modifyName(
                credential.name,
                "credential",
                credential.did
              )}
            </b>
          </p>
          <p
            className="credential-text"
            style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}
          >
            Issued by: {this.getIssuer(credential)}
          </p>
        </div>
        <div key="checkbox" className="checkbox mb-3">
          <Form.Check
            onChange={() => methodToSelect(credential.hash)}
            style={{ color: colors.EC_YELLOW }}
            type="checkbox"
            id={credential.id}
          />
        </div>
      </ListGroup.Item>
    );
  }
}

export default CredentialItemPresentation;
CredentialItemPresentation.propTypes = {
  credential: PropTypes.shape(models.credentialShape).isRequired,
  methodToSelect: PropTypes.func.isRequired,
};
CredentialItemPresentation.defaultTypes = {
  credential: models.credential,
};
