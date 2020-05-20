import React, { Component } from "react";
import queryString from "query-string";
import "./Credentials.css";
import { ListGroup, Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import moment from "moment";
import Header from "../../components/Header/Header";
import EbsiBanner from "../../components/EbsiBanner/EbsiBanner";
import Footer from "../../components/Footer/Footer";
import CredentialItem from "../../components/CredentialItem/CredentialItem";
import ToastEbsi from "../../components/ToastEbsi/ToastEbsi";
import CredentialModal from "../../components/CredentialModal/CredentialModal";
import colors from "../../config/colors";
import {
  getDID,
  getJWT,
  getKeys,
  connectionNotEstablished,
  storeDID,
  storeJWT,
  storeUserName,
  keysNotExist,
} from "../../utils/DataStorage";
import strB64dec from "../../utils/strB64dec";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import { parseJwt, isTokenExpired } from "../../utils/JWTHandler";
import * as transform from "../../utils/StringTransformation";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import * as wallet from "../../apis/wallet";
import * as config from "../../config/config";
import { REACT_APP_DEMO } from "../../config/env";
import { loginLink } from "../../apis/ecas";

const DEMO = REACT_APP_DEMO;

class Credentials extends Component {
  constructor(props) {
    super(props);

    this.passwordForKeyGeneration = React.createRef();

    this.state = {
      credentials: [],
      credential: models.credential,
      isModalCredentialOpen: false,
      isToastOpen: false,
      toastMessage: "Error",
      toastColor: colors.EC_GREEN,
      isLoadingOpen: false,
      shouldAskToDecryptKey: false,
      isModalAskingForPass: false,
      isTourOpen: false,
      ticketFromUrl: "",
    };
    this.closeToast = this.closeToast.bind(this);
    this.openModalAskingPass = this.openModalAskingPass.bind(this);
    this.closeCredentialModal = this.closeCredentialModal.bind(this);
    this.displayCredential = this.displayCredential.bind(this);
  }

  componentDidMount() {
    this.handleKeys();
  }

  async onContinueClick() {
    try {
      const { ticketFromUrl } = this.state;
      this.closeModalAskingPass();
      this.startLoading();
      const userPassword = this.passwordForKeyGeneration.current.value;

      await this.decryptKeys(userPassword);
      await this.establishBond(ticketFromUrl, userPassword);
    } catch (error) {
      this.closeModalAskingPass();
      this.openToast(error.toString());
      this.setState({
        shouldAskToDecryptKey: true,
      });
    }
  }

  async getCredentials() {
    this.startLoading();
    const context = this;
    const response = await idHub.getCredentials();
    if (response.status === 200 || response.status === 201) {
      const credentials = [];
      response.data.items.forEach(function cred(credential) {
        if (credential.name !== "VerifiablePresentation") {
          credentials.push(
            <CredentialItem
              credential={credential}
              key={credential.id}
              methodToOpen={context.displayCredential}
            />
          );
        }
      });
      this.stopLoading();
      this.setState({
        credentials,
      });
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }
      this.openToast(`Error getting the credentials. ${response.data}`);
    }
  }

  decryptKeys = async (userPassword) => {
    const se = SecureEnclave.Instance;
    const options = {
      encryptedKey: getKeys(),
      password: userPassword,
    };
    await se.restoreWallet(options);
  };

  signToken = async (ticketFromUrl, password) => {
    const se = SecureEnclave.Instance;
    const request = {
      aud: config.COMPONENT_WALLET_ID,
      exp: moment().add(15, "minutes").unix(),
      ticket: ticketFromUrl,
      publicKey: se.getPublicKey(getDID()),
    };
    const buffer = Buffer.from(JSON.stringify(request));
    const token = await se.signJwt(getDID(), buffer, password);
    return token;
  };

  storeConnection = (jwt) => {
    storeJWT(jwt);
    const token = parseJwt(jwt);
    if (token === "Error") {
      this.openToast("Token invalid.");
      this.redirectTo("");
    }
    const username = transform.transformUserName(token.userName);
    storeUserName(username);
    storeDID(token.did);
  };

  disableBody = (target) => {
    disableBodyScroll(target);
  };

  enableBody = (target) => {
    enableBodyScroll(target);
  };

  async displayCredential(hash) {
    const response = await idHub.getCredential(hash);
    if (response.status === 200 || response.status === 201) {
      this.openCredentialModal(response.data);
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }
      this.openToast(`Error getting the credential. ${response.data}`);
    }
  }

  handleKeys() {
    const { location } = this.props;
    const ticketFromUrl = queryString.parse(location.search).ticket;
    if (ticketFromUrl !== undefined) {
      this.manageAccess(ticketFromUrl);
    } else {
      this.redirectIfUserIsNotLogged();
    }
  }

  manageAccess(ticketFromUrl) {
    if (keysNotExist()) {
      this.redirectTo(`profile?ticket=${ticketFromUrl}`);
    }
    this.setState({ ticketFromUrl });
    this.openModalAskingPass();
  }

  redirectTo(whereRedirect) {
    const { history } = this.props;
    history.push(`/${whereRedirect}`);
  }

  redirectIfUserIsNotLogged() {
    if (connectionNotEstablished()) {
      this.redirectTo("");
    } else if (isTokenExpired(getJWT())) {
      window.location.assign(loginLink());
    } else {
      this.getCredentials();
    }
  }

  async establishBond(ticketFromUrl, password) {
    const token = await this.signToken(ticketFromUrl, password);
    const response = await wallet.establishBond(token);
    if (response.status === 200 || response.status === 201) {
      this.storeConnection(response.data.accessToken);
      this.openSuccessToast();
      this.getCredentials();
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }
      this.openToast(response.data);
    }

    this.stopLoading();
  }

  openToast(message) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      isLoadingOpen: false,
      toastColor: colors.EC_RED,
    });
  }

  openSuccessToast() {
    this.setState({
      isToastOpen: true,
      toastMessage: "The key decryption was successful.",
      toastColor: colors.EC_GREEN,
      shouldAskToDecryptKey: false,
    });
  }

  closeToast() {
    this.setState({
      isToastOpen: false,
    });
  }

  startLoading() {
    this.setState({
      isLoadingOpen: true,
    });
  }

  stopLoading() {
    this.setState({
      isLoadingOpen: false,
    });
  }

  openModalAskingPass() {
    this.setState({
      isModalAskingForPass: true,
      shouldAskToDecryptKey: true,
    });
  }

  closeModalAskingPass() {
    this.setState({
      isModalAskingForPass: false,
    });
  }

  async openCredentialModal(credential) {
    const credentialDecoded = credential;
    credentialDecoded.dataDecoded = await strB64dec(credential.data.base64);
    this.setState({
      isModalCredentialOpen: true,
      credential: credentialDecoded,
    });
  }

  closeCredentialModal() {
    this.setState({
      isModalCredentialOpen: false,
    });
  }

  openTour() {
    this.setState({
      isTourOpen: true,
    });
  }

  closeTour() {
    this.setState({
      isTourOpen: false,
    });
  }

  render() {
    const {
      credentials,
      credential,
      isModalCredentialOpen,
      isModalAskingForPass,
      shouldAskToDecryptKey,
      isLoadingOpen,
      isToastOpen,
      toastColor,
      toastMessage,
      isTourOpen,
    } = this.state;

    return (
      <div className="credentials-container">
        <Header />

        <ToastEbsi
          isToastOpen={isToastOpen}
          methodToClose={this.closeToast}
          toastColor={toastColor}
          colorText={colors.WHITE}
          toastMessage={toastMessage}
        />
        <EbsiBanner
          title="Credentials Page"
          subtitle="List of your credentials."
          shouldAskToDecryptKey={shouldAskToDecryptKey}
          openModalAskingPass={this.openModalAskingPass}
          isLoadingOpen={isLoadingOpen}
        />
        <div className="table-container">
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
              <h4> Please type a password for the key decryption. </h4>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={this.passwordForKeyGeneration}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => this.onContinueClick()}>
                Continue
              </Button>
            </Modal.Footer>
          </Modal>

          <CredentialModal
            credential={credential}
            isModalCredentialOpen={isModalCredentialOpen}
            methodToClose={this.closeCredentialModal}
          />

          {credentials.length === 0 && (
            <p>
              You don&#8217;t have any credential at the moment. Follow the{" "}
              <a href={DEMO}> demonstrator</a> to create some.
            </p>
          )}
          <ListGroup
            className="list-credentials"
            data-tut="reactour_credentials"
          >
            {credentials}
          </ListGroup>
          <Button
            onClick={() => this.openTour()}
            className="tourButton"
            title="Open guided tour"
          >
            ?
          </Button>
        </div>
        <Footer />
        <Tour
          steps={tour.stepsCredentials}
          isOpen={isTourOpen}
          onRequestClose={() => this.closeTour()}
          onAfterOpen={() => this.disableBody()}
          onBeforeClose={() => this.enableBody()}
        />
      </div>
    );
  }
}

export default Credentials;
Credentials.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.any.isRequired,
};
