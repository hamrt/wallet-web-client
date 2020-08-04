import React, { Component } from "react";
import queryString from "query-string";
import "./Profile.css";
import { Button, Badge, Modal, Form } from "react-bootstrap";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
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
import { strB64dec } from "../../utils/strB64dec";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import * as wallet from "../../apis/wallet";
import * as transform from "../../utils/StringTransformation";
import * as keysManager from "../../utils/KeysHandler";
import signToken from "../../utils/auth";
import { INotification } from "../../dtos/notifications";
import { IAttribute } from "../../dtos/attributes";
import { attributes } from "../../dtos";

type Props = {
  history: any;
  location: any;
};

type State = {
  isKeysGeneratorOpen: boolean;
  isModalImportOpen: boolean;
  isToastOpen: boolean;
  toastMessage: string;
  isLoadingOpen: boolean;
  toastColor: string;
  username: string;
  did: string;
  passwordForKeyGeneration: string;
  confirmPassword: string;
  notifications: INotification[];
  notification1: INotification;
  notification2: INotification;
  notification3: INotification;
  credentials: IAttribute[];
  credential1: IAttribute;
  credential2: IAttribute;
  credential3: IAttribute;
  isTourOpen: boolean;
  credentialsName: string[];
  dataInBase64: string;
};

class Profile extends Component<Props, State> {
  passwordForKeyGeneration: React.RefObject<HTMLInputElement>;

  constructor(props: Readonly<Props>) {
    super(props);

    this.passwordForKeyGeneration = React.createRef();

    this.state = {
      isKeysGeneratorOpen: false,
      isModalImportOpen: false,
      isToastOpen: false,
      toastMessage: "Error",
      isLoadingOpen: false,
      toastColor: colors.EC_GREEN,
      username: getUserName() || "",
      did: getDID() || "",
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
      credentialsName: [],
      dataInBase64: "",
    };
    this.closeToast = this.closeToast.bind(this);
  }

  componentDidMount() {
    this.handleKeys();
  }

  onGenerateClick = async () => {
    try {
      this.closeKeysGenerator();
      this.startLoading();

      const userPassword = this.passwordForKeyGeneration.current?.value;
      if (!userPassword) throw new Error("No password provided");

      await this.setUpKeys(userPassword);
      await this.handleTicket(userPassword);

      this.stopLoading();
    } catch (error) {
      this.closeKeysGenerator();
      this.stopLoading();
      this.openToast(error.toString());
    }
  };

  getNotifications = async (): Promise<void> => {
    const jwt = getJWT();
    if (!jwt) return;

    const response = await wallet.getNotifications(jwt);
    if (response.status === 200 || response.status === 201) {
      this.stopLoading();
      this.setState({
        notifications: response.data.items,
        notification1: response.data.items[0],
        notification2: response.data.items[1],
        notification3: response.data.items[2],
      });
    }
  };

  setCredentialsName = async (
    credentials: attributes.IAttribute[]
  ): Promise<string[]> => {
    const credentialsName = credentials.map(async (credential) =>
      transform.modifyName(
        credential.name,
        "credential",
        credential.issuer || ""
      )
    );
    return Promise.all(credentialsName);
  };

  async getCredentials() {
    const response = await idHub.getCredentials();
    if (response.status === 200 || response.status === 201) {
      const list = this.displayJustCredentials(response.data.items);
      this.setState({
        credentials: list,
        credential1: list[0],
        credential2: list[1],
        credential3: list[2],
        credentialsName: await this.setCredentialsName(list),
      });
    }
  }

  setUpKeys = async (userPassword: string) => {
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

  displayJustCredentials = (list: attributes.IAttribute[]) => {
    const listOfCredentials = list.filter(
      (attribute) => attribute.type !== "VerifiablePresentation"
    );

    return listOfCredentials;
  };

  handleChangeConfirmPass = (e: { target: { value: any } }) => {
    this.setState({
      confirmPassword: e.target.value,
    });
  };

  handleChangePass = (e: { target: { value: any } }) => {
    this.setState({
      passwordForKeyGeneration: e.target.value,
    });
  };

  disableBody = (target: HTMLDivElement) => {
    disableBodyScroll(target);
  };

  enableBody = (target: HTMLDivElement) => {
    enableBodyScroll(target);
  };

  storeConnection = (jwt: string) => {
    storeJWT(jwt);
    try {
      const token = parseJwt(jwt);
      const username = transform.transformUserName(token.userName);
      this.stopLoading();
      this.setState({
        did: token.did,
        username,
      });

      storeUserName(username);
      storeDID(token.did);
    } catch (error) {
      this.stopLoading();
      this.openToast("Token invalid.");
      this.redirectTo("");
    }
  };

  closeKeysGenerator = () => {
    this.setState({
      isKeysGeneratorOpen: false,
    });
  };

  openModalImport = () => {
    this.setState({
      isModalImportOpen: true,
    });
  };

  closeModalImport = () => {
    this.setState({
      isModalImportOpen: false,
    });
  };

  openTour = () => {
    this.setState({
      isTourOpen: true,
    });
  };

  closeTour = () => {
    this.setState({
      isTourOpen: false,
    });
  };

  uploadDocument = () => {
    const { dataInBase64 } = this.state;
    const keys = strB64dec(dataInBase64);
    storeKeys(JSON.parse(keys));
    this.closeModalImport();
    this.redirectTo("credentials");
  };

  async handleTicket(password: string) {
    const { location } = this.props;
    const ticketFromUrl = queryString.parse(location.search).ticket;

    if (!ticketFromUrl) this.redirectIfUserIsNotLogged();
    if (typeof ticketFromUrl !== "string")
      throw new Error("ticket not in string format");
    await this.establishBond(ticketFromUrl, password);
  }

  redirectIfUserIsNotLogged() {
    if (connectionNotEstablished()) {
      this.redirectTo("");
      return;
    }
    if (isTokenExpired(getJWT() || "")) {
      window.location.assign(loginLink());
      return;
    }
    // other cases
    this.getNotifications();
    this.getCredentials();
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

  async establishBond(ticketFromUrl: string, password: string) {
    try {
      const token = await signToken(ticketFromUrl, password);

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
    } catch (error) {
      this.stopLoading();
      this.openToast(
        `Could not sign token and establish connection to the wallet: ${error.message}`
      );
    }
  }

  openKeysGenerator() {
    this.setState({
      isKeysGeneratorOpen: true,
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

  openToast(message: string) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      toastColor: colors.EC_RED,
    });
  }

  openSuccessToast(message: string) {
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

  redirectTo(whereRedirect: string) {
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
      credentialsName,
    } = this.state;
    return (
      <div>
        <Header />

        <ToastEbsi
          isToastOpen={isToastOpen}
          methodToClose={this.closeToast}
          toastColor={toastColor}
          colorText={colors.WHITE}
          toastMessage={toastMessage}
        />

        <Modal show={isKeysGeneratorOpen} onHide={this.closeKeysGenerator}>
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
              onClick={this.onGenerateClick}
              disabled={
                passwordForKeyGeneration === "" ||
                passwordForKeyGeneration !== confirmPassword
              }
            >
              Generate
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={isModalImportOpen} onHide={this.closeModalImport}>
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
            <Button variant="primary" onClick={this.uploadDocument}>
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
              <Button variant="info" onClick={this.openModalImport}>
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
                  {credential1 !== undefined ? credentialsName[0] : "-"}
                </dd>
                <dd style={{ wordWrap: "break-word" }}>
                  {credential2 !== undefined ? credentialsName[1] : "-"}
                </dd>
                <dd style={{ wordWrap: "break-word" }}>
                  {credential3 !== undefined ? credentialsName[2] : "-"}
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
            onClick={this.openTour}
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
          onRequestClose={this.closeTour}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />
      </div>
    );
  }
}

export default Profile;
