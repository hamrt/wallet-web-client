import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import queryString from "query-string";
import { EbsiDidAuth } from "@cef-ebsi/did-auth";
import { parseJwt } from "../../utils/JWTHandler";
import { Panel, PanelTitle } from "../../components/Panel/Panel";
import * as config from "../../config/config";
import colors from "../../config/colors";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import step1SVG from "../../assets/images/step1.svg";
import "./DidAuth.css";
import { getDID, getKeys } from "../../utils/DataStorage";

class DidAuth extends Component {
  constructor(props) {
    super(props);

    this.passwordForKeyGeneration = React.createRef();

    this.state = {
      serviceUrl: "",
      serviceDID: "",
      serviceName: "",
      didAuthRequestJwt: "",
      passwordForKeyGeneration: "",
      isModalAskingForPass: false,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const urlParameters = queryString.parse(location.search);
    this.didAuth(urlParameters);
  }

  async onAuthorizeClick() {
    try {
      const { didAuthRequestJwt, passwordForKeyGeneration } = this.state;
      this.closeModalAskingPass();
      const requestPayload = await EbsiDidAuth.verifyDidAuthRequest(
        didAuthRequestJwt,
        config.besu.didRegistry,
        config.besu.provider
      );
      await this.decryptKeys(passwordForKeyGeneration);
      this.createResponse(requestPayload);
    } catch (error) {
      this.closeModalAskingPass();
    }
  }

  getEmisorName = (emisor) => {
    let emisorName = "-";
    if (config.DID_EBSI_SERVICES[emisor] !== undefined) {
      emisorName = config.DID_EBSI_SERVICES[emisor];
    }
    if (emisor === "") {
      emisorName = "-";
    }
    return emisorName;
  };

  redirectToRP = (urlToRedirect, jwtResponse) => {
    window.location.href = `${urlToRedirect}?response=${jwtResponse}`;
  };

  decryptKeys = async (userPassword) => {
    const se = SecureEnclave.Instance;
    const options = {
      encryptedKey: getKeys(),
      password: userPassword,
    };
    await se.restoreWallet(options);
  };

  handleChangePass = (e) => {
    this.setState({
      passwordForKeyGeneration: e.target.value,
    });
  };

  async authorize() {
    this.openModalAskingPass();
  }

  didAuth(urlParameters) {
    const clientId = urlParameters.client_id;
    const didAuthRequestJwt = urlParameters.request;
    if (didAuthRequestJwt !== undefined) {
      const token = parseJwt(didAuthRequestJwt);
      this.setState({
        serviceUrl: clientId,
        serviceDID: token.iss,
        serviceName: this.getEmisorName(token.iss),
        didAuthRequestJwt,
      });
    }
  }

  async createResponse(requestPayload) {
    const { serviceUrl } = this.state;
    const se = SecureEnclave.Instance;
    const privateKey = await se.getPrivateKey(getDID());
    const didAuthResponseCall = {
      hexPrivatekey: privateKey, // private key managed by the user. Should be passed in hexadecimal format
      did: getDID(), // User DID
      nonce: requestPayload.nonce, // same nonce received as a Request Payload after verifying it
      redirectUri: serviceUrl, // parsed URI from the DID Auth Request payload
    };
    const didAuthResponseJwt = await EbsiDidAuth.createDidAuthResponse(
      didAuthResponseCall
    );
    this.redirectToRP(serviceUrl, didAuthResponseJwt);
  }

  openModalAskingPass() {
    this.setState({
      isModalAskingForPass: true,
    });
  }

  closeModalAskingPass() {
    this.setState({
      isModalAskingForPass: false,
    });
  }

  render() {
    const {
      serviceUrl,
      serviceDID,
      serviceName,
      isModalAskingForPass,
      passwordForKeyGeneration,
    } = this.state;

    return (
      <div className="app">
        <main className="main">
          <Panel>
            <PanelTitle>Authorization</PanelTitle>
            <div className="panelBody">
              <div className="panelImageContainer">
                <img
                  src={step1SVG}
                  alt=""
                  role="presentation"
                  className="panelImage"
                />
              </div>
              <div className="panelMainContent">
                {serviceName === "-" && (
                  <div>
                    <h3 className="panelBodyTitle">
                      Connect with the service with DID:
                    </h3>
                    <p
                      className="panelBodyText"
                      style={{ wordWrap: "break-word" }}
                    >
                      {serviceDID}
                    </p>
                  </div>
                )}
                {serviceName !== "-" && (
                  <h3 className="panelBodyTitle">
                    {serviceName} wants to connects you
                  </h3>
                )}
                <p className="panelBodyText" style={{ wordWrap: "break-word" }}>
                  {serviceUrl}
                </p>
              </div>
            </div>
            <div className="panelFooter">
              <button
                className="panelLink"
                type="button"
                tabIndex={0}
                onClick={() => this.authorize()}
              >
                Authorize
              </button>
            </div>
          </Panel>
        </main>
        <Modal
          show={isModalAskingForPass}
          onHide={() => this.closeModalAskingPass()}
        >
          <Modal.Header
            className="ModalHeader"
            style={{ backgroundColor: colors.EC_BLUE }}
            closeButton
          >
            <Modal.Title className="ModalTitle">Password</Modal.Title>
          </Modal.Header>
          <Modal.Body className="ModalBody">
            <h4> Please type a password to authorize the connection. </h4>
            <Form.Control
              type="password"
              placeholder="Password"
              value={passwordForKeyGeneration}
              onChange={this.handleChangePass}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.onAuthorizeClick()}>
              Authorize
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default DidAuth;
DidAuth.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.any.isRequired,
};
