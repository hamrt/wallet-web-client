import React, { Component } from "react";
import queryString from "query-string";
import "./Profile.css";
import { Button, Badge, Modal, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import moment from "moment";
import { parseJwt, isTokenExpired } from "../../utils/JWTHandler";
import { loginLink } from "../../apis/ecas";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  connectionNotEstablished,
  storeJWT,
  storeUserName,
  getUserName,
  storeDID,
  getDID,
  storeKeys,
  keysNotExist,
  getJWT,
} from "../../utils/DataStorage";
import ToastEbsi from "../../components/ToastEbsi/ToastEbsi";
import EbsiBanner from "../../components/EbsiBanner/EbsiBanner";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import colors from "../../config/colors";
import strB64dec from "../../utils/strB64dec";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import * as wallet from "../../apis/wallet";
import * as config from "../../config/config";
import * as transform from "../../utils/StringTransformation";
import * as keysManager from "../../utils/KeysHandler";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.passwordForKeyGeneration = React.createRef();

    this.state = {
      isKeysGeneratorOpen: false,
      isModalImportOpen: false,
      isToastOpen: false,
      toastMessage: "Error",
      isLoadingOpen: false,
      toastColor: colors.EC_GREEN,
      username: getUserName(),
      did: getDID(),
      passwordForKeyGeneration: "",
      confirmPassword: "",
      notifications: [],
      notification1: models.notification,
      notification2: models.notification,
      notification3: models.notification,
      credentials: [],
      credential1: models.credential,
      credential2: models.credential,
      credential3: models.credential,
      isTourOpen: false,
    };
    this.closeToast = this.closeToast.bind(this);
  }

  componentDidMount() {
    this.handleKeys();
  }

  async onGenerateClick() {
    try {
      this.closeKeysGenerator();
      this.startLoading();

      const userPassword = this.passwordForKeyGeneration.current.value;

      await this.setUpKeys(userPassword);
      await this.handleTicket(userPassword);

      this.stopLoading();
    } catch (error) {
      this.closeKeysGenerator();
      this.stopLoading();
      this.openToast(error.toString());
    }
  }

  async getNotifications() {
    const response = await wallet.getNotifications(getJWT());
    if (response.status === 200 || response.status === 201) {
      this.stopLoading();
      this.setState({
        notifications: response.data.items,
        notification1: response.data.items[0],
        notification2: response.data.items[1],
        notification3: response.data.items[2],
      });
    }
  }

  async getCredentials() {
    const response = await idHub.getCredentials();
    if (response.status === 200 || response.status === 201) {
      const list = this.displayJustCredentials(response.data.items);
      this.setState({
        credentials: list,
        credential1: list[0],
        credential2: list[1],
        credential3: list[2],
      });
    }
  }

  setUpKeys = async (userPassword) => {
    const se = SecureEnclave.Instance;
    const options = {
      password: userPassword,
    };
    const did = await se.addNewWallet(options);
    const keys = se.exportEncryptedKeys(did);
    storeDID(did);
    storeKeys(keys);
    this.openSuccessToast("The key generation was successful");
  };

  displayJustCredentials = (list) => {
    const listOfCredentials = [];
    Object.keys(list).forEach(function fetchCredentials(credential) {
      if (list[credential].type !== "VerifiablePresentation") {
        listOfCredentials.push(list[credential]);
      }
    });
    return listOfCredentials;
  };

  handleChangeConfirmPass = (e) => {
    this.setState({
      confirmPassword: e.target.value,
    });
  };

  handleChangePass = (e) => {
    this.setState({
      passwordForKeyGeneration: e.target.value,
    });
  };

  disableBody = (target) => {
    disableBodyScroll(target);
  };

  enableBody = (target) => {
    enableBodyScroll(target);
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
      this.stopLoading();
      this.openToast("Token invalid.");
      this.redirectTo("");
    }
    const username = transform.transformUserName(token.userName);
    this.stopLoading();
    this.setState({
      did: token.did,
      username,
    });

    storeUserName(username);
    storeDID(token.did);
  };

  async handleTicket(password) {
    const { location } = this.props;
    const ticketFromUrl = queryString.parse(location.search).ticket;

    if (ticketFromUrl !== undefined) {
      await this.establishBond(ticketFromUrl, password);
    } else {
      this.redirectIfUserIsNotLogged();
    }
  }

  redirectIfUserIsNotLogged() {
    if (connectionNotEstablished()) {
      this.redirectTo("");
    } else if (isTokenExpired(getJWT())) {
      window.location.assign(loginLink());
    } else {
      this.getNotifications();
      this.getCredentials();
    }
  }

  handleKeys() {
    const { location } = this.props;
    const ticketFromUrl = queryString.parse(location.search).ticket;
    if (ticketFromUrl !== undefined) {
      if (keysNotExist()) {
        this.openKeysGenerator();
      }
    } else {
      this.redirectIfUserIsNotLogged();
    }
  }

  async establishBond(ticketFromUrl, password) {
    const token = await this.signToken(ticketFromUrl, password);

    const response = await wallet.establishBond(token);
    if (response.status === 200 || response.status === 201) {
      this.storeConnection(response.data.accessToken);
      this.getNotifications();
      this.getCredentials();
    } else {
      if (response.status === 404) {
        this.stopLoading();
        this.openToast("Token invalid.");
        this.redirectTo("");
      }
      this.closeToast();
      this.stopLoading();
      this.openToast(response.data);
    }
  }

  openKeysGenerator() {
    this.setState({
      isKeysGeneratorOpen: true,
    });
  }

  closeKeysGenerator() {
    this.setState({
      isKeysGeneratorOpen: false,
    });
  }

  openModalImport() {
    this.setState({
      isModalImportOpen: true,
    });
  }

  closeModalImport() {
    this.setState({
      isModalImportOpen: false,
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

  openToast(message) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      toastColor: colors.EC_RED,
    });
  }

  openSuccessToast(message) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      toastColor: colors.EC_GREEN,
    });
  }

  closeToast() {
    this.setState({
      isToastOpen: false,
    });
  }

  async uploadDocument() {
    const { dataInBase64 } = this.state;
    const keys = await strB64dec(dataInBase64);
    storeKeys(JSON.parse(keys));
    this.closeModalImport();
    this.redirectTo("credentials");
  }

  redirectTo(whereRedirect) {
    const { history } = this.props;
    history.push(`/${whereRedirect}`);
  }

  render() {
    const {
      isLoadingOpen,
      username,
      did,
      isToastOpen,
      isModalImportOpen,
      toastMessage,
      toastColor,
      isKeysGeneratorOpen,
      confirmPassword,
      passwordForKeyGeneration,
      notifications,
      notification1,
      notification2,
      notification3,
      credentials,
      credential1,
      credential2,
      credential3,
      isTourOpen,
    } = this.state;
    return (
      <div>
        <Header className="header" />

        <ToastEbsi
          isToastOpen={isToastOpen}
          methodToClose={this.closeToast}
          toastColor={toastColor}
          colorText={colors.WHITE}
          toastMessage={toastMessage}
        />

        <Modal
          show={isKeysGeneratorOpen}
          onHide={() => this.closeKeysGenerator}
        >
          <Modal.Header
            className="ModalHeader"
            style={{ backgroundColor: colors.EC_BLUE }}
            closeButton
          >
            <Modal.Title className="ModalTitle">Generate Keys</Modal.Title>
          </Modal.Header>
          <Modal.Body className="ModalBody">
            <h4> Please type a password for the key generation. </h4>
            <p style={{ color: colors.EC_RED }}>
              {" "}
              Please keep this password, you will need it for signing
              credentials{" "}
            </p>
            <div className="ecl-fact-figures__description">
              {" "}
              Please note that if you will not be able to recover your wallet
              unless you download your keys. Note that clicking on
              &ldquo;Restart User Journey&rdquo; will delete your access to your
              current wallet.
            </div>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={this.passwordForKeyGeneration}
              value={passwordForKeyGeneration}
              onChange={this.handleChangePass}
            />
            <br />
            <p style={{ color: colors.BLACK }}> Confirm your Password </p>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={this.handleChangeConfirmPass}
            />
            {confirmPassword !== "" &&
              passwordForKeyGeneration !== confirmPassword && (
                <p style={{ color: colors.EC_RED }}>
                  {" "}
                  Your password and confirmation password do not match.
                </p>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => this.onGenerateClick()}
              disabled={
                passwordForKeyGeneration === "" ||
                passwordForKeyGeneration !== confirmPassword
              }
            >
              Generate
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={isModalImportOpen} onHide={() => this.closeModalImport()}>
          <Modal.Header
            className="ModalHeader"
            style={{ backgroundColor: colors.EC_BLUE }}
            closeButton
          >
            <Modal.Title className="ModalTitle">Import Keys</Modal.Title>
          </Modal.Header>
          <Modal.Body className="ModalBody">
            <Form.Group controlId="formFile" style={{ marginBottom: 15 }}>
              <Form.Control
                type="file"
                accept=".json"
                onChange={(e) => keysManager.importKeys(e, this)}
                className="input-file"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.uploadDocument()}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>

        <EbsiBanner
          title="Welcome to your EBSI wallet"
          subtitle="My Profile"
          isLoadingOpen={isLoadingOpen}
        />

        <div className="profile ecl-fact-figures--col-4">
          <div className="ecl-fact-figures__items">
            <div className="ecl-fact-figures__item">
              <div className="ecl-fact-figures__value">Personal</div>
              <div className="ecl-fact-figures__description"> {username}</div>
              <div className="ecl-fact-figures__title">My DID Address</div>
              <div
                className="ecl-fact-figures__description"
                data-tut="reactour_center"
                style={{ wordWrap: "break-word" }}
              >
                {did}
              </div>
              <div className="ecl-fact-figures__description">
                {" "}
                Please note that if you will not be able to recover your wallet
                unless you download your keys. Note that clicking on
                &ldquo;Restart User Journey&rdquo; will delete your access to
                your current wallet.
              </div>
              <Button variant="info" onClick={() => this.openModalImport()}>
                Import Keys
              </Button>
              <div className="ecl-fact-figures__description"> </div>
              <Button variant="info" onClick={() => keysManager.exportKeys()}>
                Export Keys
              </Button>
            </div>
            <div className="ecl-fact-figures__item">
              <div className="ecl-fact-figures__value">
                Notifications{" "}
                {notifications.length > 0 && (
                  <Badge variant="danger">{notifications.length}</Badge>
                )}
              </div>
              <div className="ecl-fact-figures__description" />
              <div className="ecl-fact-figures__description" />
              <div className="ecl-fact-figures__description" />
              <div className="ecl-fact-figures__title">
                Latest Notifications
              </div>

              <dl className="ecl-fact-figures__description">
                <dd style={{ wordWrap: "break-word" }}>
                  {notification1 !== undefined
                    ? transform.notificationType(
                        notification1.message.notificationType,
                        notification1.message.name,
                        notification1.message.redirectURL
                      )
                    : "-"}
                </dd>
                <dd style={{ wordWrap: "break-word" }}>
                  {notification2 !== undefined
                    ? transform.notificationType(
                        notification2.message.notificationType,
                        notification2.message.name,
                        notification2.message.redirectURL
                      )
                    : "-"}
                </dd>
                <dd style={{ wordWrap: "break-word" }}>
                  {notification3 !== undefined
                    ? transform.notificationType(
                        notification3.message.notificationType,
                        notification3.message.name,
                        notification3.message.redirectURL
                      )
                    : "-"}
                </dd>
              </dl>
              <Button
                variant="info"
                onClick={() => this.redirectTo("notifications")}
              >
                See All Pending Notifications
              </Button>
            </div>
            <div className="ecl-fact-figures__item">
              <div className="ecl-fact-figures__value">
                Credentials{" "}
                {credentials.length > 0 && (
                  <Badge variant="danger">{credentials.length}</Badge>
                )}
              </div>
              <div className="ecl-fact-figures__description" />
              <div className="ecl-fact-figures__description" />
              <div className="ecl-fact-figures__description" />
              <div className="ecl-fact-figures__title">Latest Credentials</div>
              <dl className="ecl-fact-figures__description">
                <dd style={{ wordWrap: "break-word" }}>
                  {credential1 !== undefined
                    ? transform.modifyName(
                        credential1.name,
                        "credential",
                        credential1.issuer
                      )
                    : "-"}
                </dd>
                <dd style={{ wordWrap: "break-word" }}>
                  {credential2 !== undefined
                    ? transform.modifyName(
                        credential2.name,
                        "credential",
                        credential2.issuer
                      )
                    : "-"}
                </dd>
                <dd style={{ wordWrap: "break-word" }}>
                  {credential3 !== undefined
                    ? transform.modifyName(
                        credential3.name,
                        "credential",
                        credential3.issuer
                      )
                    : "-"}
                </dd>
              </dl>
              <Button
                variant="info"
                onClick={() => this.redirectTo("credentials")}
              >
                See All Credentials
              </Button>
            </div>
          </div>
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
          steps={tour.stepsProfile}
          isOpen={isTourOpen}
          onRequestClose={() => this.closeTour()}
          onAfterOpen={() => this.disableBody()}
          onBeforeClose={() => this.enableBody()}
        />
      </div>
    );
  }
}

export default Profile;

Profile.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.any.isRequired,
};
