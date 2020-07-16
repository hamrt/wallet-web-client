import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  EbsiDidAuth,
  DidAuthResponseCall,
  DidAuthRequestPayload,
} from "@cef-ebsi/did-auth";
import { parseJwt } from "../../utils/JWTHandler";
import { Panel, PanelTitle } from "../../components/Panel/Panel";
import * as config from "../../config/config";
import colors from "../../config/colors";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import step1SVG from "../../assets/images/step1.svg";
import "./DidAuth.css";
import { getDID, getKeys } from "../../utils/DataStorage";
import * as issuer from "../../utils/issuer";
import { IWalletOptions } from "../../secureEnclave/UserWallet";

type Props = {
  location: any;
};

type State = {
  serviceUrl: string;
  serviceDID: string;
  serviceName: string;
  didAuthRequestJwt: string;
  passwordForKeyGeneration: string;
  isModalAskingForPass: boolean;
};

class DidAuth extends Component<Props, State> {
  passwordForKeyGeneration: React.RefObject<HTMLInputElement>;

  constructor(props: Readonly<Props>) {
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

  async componentDidMount() {
    const { location } = this.props;
    const urlParameters = new URLSearchParams(location.search);
    try {
      await this.didAuth(urlParameters);
    } catch (error) {
      // do nothing
    }
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

  redirectToRP = (urlToRedirect: string, jwtResponse: string) => {
    window.location.href = `${urlToRedirect}?response=${jwtResponse}`;
  };

  decryptKeys = async (password: string) => {
    const se = SecureEnclave.Instance;
    const encryptedKey = getKeys();
    if (!encryptedKey) throw new Error("No keys found.");
    const options: IWalletOptions = {
      encryptedKey,
      password,
    };
    await se.restoreWallet(options);
  };

  handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      passwordForKeyGeneration: e.target.value,
    });
  };

  async authorize() {
    this.openModalAskingPass();
  }

  async didAuth(urlParameters: URLSearchParams) {
    if (!urlParameters) throw new Error("No URL Parameters provided");

    const clientId = urlParameters.get("client_id");
    const didAuthRequestJwt = urlParameters.get("request");
    if (!clientId || !didAuthRequestJwt)
      throw new Error("Error parsing DIDAuth request");

    const token = parseJwt(didAuthRequestJwt);
    if (!token.iss) throw new Error("No issuer found in DIDAuth request token");
    const serviceName = await issuer.getIssuerName(token.iss);
    this.setState({
      serviceUrl: clientId,
      serviceDID: token.iss,
      serviceName,
      didAuthRequestJwt,
    });
  }

  async createResponse(requestPayload: DidAuthRequestPayload) {
    const { serviceUrl } = this.state;
    const se = SecureEnclave.Instance;
    const did = getDID();
    if (!did) throw new Error("No DID found on Local Storage.");
    const privateKey = se.getPrivateKey(did);
    const didAuthResponseCall: DidAuthResponseCall = {
      hexPrivatekey: privateKey, // private key managed by the user. Should be passed in hexadecimal format
      did, // User DID
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
