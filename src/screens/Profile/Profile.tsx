import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";
import { Badge, Modal, Form } from "react-bootstrap";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import { isTokenExpired } from "../../utils/JWTHandler";
import { loginLink } from "../../apis/ecas";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  connectionNotEstablished,
  getUserName,
  getDID,
  storeKeys,
  getJWT,
} from "../../utils/DataStorage";
import EbsiBanner from "../../components/EbsiBanner/EbsiBanner";
import { strB64dec } from "../../utils/strB64dec";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import * as wallet from "../../apis/wallet";
import * as transform from "../../utils/StringTransformation";
import * as keysManager from "../../utils/KeysHandler";
import { INotification } from "../../dtos/notifications";
import { IAttribute } from "../../dtos/attributes";
import { attributes } from "../../dtos";

type Props = {
  history: any;
  location: any;
};

type State = {
  isModalImportOpen: boolean;
  username: string;
  did: string;
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
      isModalImportOpen: false,
      username: getUserName() || "",
      did: getDID() || "",
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
  }

  componentDidMount() {
    if (connectionNotEstablished()) {
      this.redirectTo("");
      return;
    }
    if (isTokenExpired(getJWT())) {
      window.location.assign(loginLink());
      return;
    }
    // other cases
    this.getNotifications();
    this.getCredentials();
  }

  getNotifications = async (): Promise<void> => {
    const jwt = getJWT();
    if (!jwt) return;

    const response = await wallet.getNotifications(jwt);
    if (response.status === 200 || response.status === 201) {
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

  displayJustCredentials = (list: attributes.IAttribute[]) => {
    const listOfCredentials = list.filter(
      (attribute) => attribute.type !== "VerifiablePresentation"
    );

    return listOfCredentials;
  };

  disableBody = (target: HTMLDivElement) => {
    disableBodyScroll(target);
  };

  enableBody = (target: HTMLDivElement) => {
    enableBodyScroll(target);
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

  redirectTo(whereRedirect: string) {
    const { history } = this.props;
    history.push(`/${whereRedirect}`);
  }

  render() {
    const {
      username,
      did,
      isModalImportOpen,
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
      <>
        <Header />
        <Modal show={isModalImportOpen} onHide={this.closeModalImport}>
          <Modal.Header className="ModalHeader" closeButton>
            <Modal.Title>Import Keys</Modal.Title>
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
            <button
              className="ecl-button ecl-button--primary"
              type="button"
              onClick={this.uploadDocument}
            >
              Upload
            </button>
          </Modal.Footer>
        </Modal>
        <EbsiBanner title="Welcome to your EBSI wallet" subtitle="My Profile" />
        <main className="ecl-container ecl-u-flex-grow-1 ecl-u-mb-l">
          <div className="ecl-row">
            <div className="ecl-col-lg-4">
              <h2 className="ecl-u-type-heading-2">Personal</h2>
              <p> {username}</p>
              <h3 className="ecl-u-type-heading-3">My DID Address</h3>
              <div
                data-tut="reactour_center"
                style={{ wordWrap: "break-word" }}
              >
                {did}
              </div>
              <p className="ecl-u-type-paragraph ecl-u-mt-m">
                Please note that if you will not be able to recover your wallet
                unless you download your keys. Note that clicking on
                &ldquo;Restart User Journey&rdquo; will delete your access to
                your current wallet.
              </p>
              <button
                className="ecl-button ecl-button--primary ecl-u-mr-s ecl-u-mb-s"
                type="button"
                onClick={this.openModalImport}
              >
                Import Keys
              </button>
              <button
                className="ecl-button ecl-button--primary"
                type="button"
                onClick={() => keysManager.exportKeys()}
              >
                Export Keys
              </button>
            </div>
            <div className="ecl-col-lg-4">
              <h2 className="ecl-u-type-heading-2">
                Notifications
                {notifications.length > 0 && (
                  <>
                    {" "}
                    <Badge variant="danger">{notifications.length}</Badge>
                  </>
                )}
              </h2>
              {notifications.length === 0 && (
                <p className="ecl-u-type-paragraph">
                  You don&apos;t have any pending notifications.
                </p>
              )}
              {notifications.length > 0 && (
                <>
                  <ul className="ecl-unordered-list">
                    {notification1 !== undefined && (
                      <li className="ecl-unordered-list__item">
                        {transform.notificationType(
                          notification1.message.notificationType,
                          notification1.message.name,
                          notification1.message.redirectURL
                        )}
                      </li>
                    )}
                    {notification2 !== undefined && (
                      <li className="ecl-unordered-list__item">
                        {transform.notificationType(
                          notification2.message.notificationType,
                          notification2.message.name,
                          notification2.message.redirectURL
                        )}
                      </li>
                    )}
                    {notification3 !== undefined && (
                      <li className="ecl-unordered-list__item">
                        {transform.notificationType(
                          notification3.message.notificationType,
                          notification3.message.name,
                          notification3.message.redirectURL
                        )}
                      </li>
                    )}
                  </ul>
                  <Link
                    to="/notifications"
                    className="ecl-link ecl-link--cta ecl-u-mt-s"
                  >
                    See All Pending Notifications
                  </Link>
                </>
              )}
            </div>
            <div className="ecl-col-lg-4">
              <h2 className="ecl-u-type-heading-2">
                Credentials
                {credentials.length > 0 && (
                  <>
                    {" "}
                    <Badge variant="danger">{credentials.length}</Badge>
                  </>
                )}
              </h2>
              {credentials.length === 0 && (
                <p className="ecl-u-type-paragraph">
                  You don&apos;t have any credentials yet.
                </p>
              )}
              {credentials.length > 0 && (
                <>
                  <ul className="ecl-unordered-list">
                    {credential1 !== undefined && (
                      <li className="ecl-unordered-list__item">
                        {credentialsName[0]}
                      </li>
                    )}
                    {credential2 !== undefined && (
                      <li className="ecl-unordered-list__item">
                        {credentialsName[1]}
                      </li>
                    )}
                    {credential3 !== undefined && (
                      <li className="ecl-unordered-list__item">
                        {credentialsName[2]}
                      </li>
                    )}
                  </ul>
                  <Link
                    to="/credentials"
                    className="ecl-link ecl-link--cta ecl-u-mt-s  "
                  >
                    See All Credentials
                  </Link>
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
        <button
          onClick={this.openTour}
          className="ecl-button ecl-button--primary tourButton"
          type="button"
          title="Open guided tour"
        >
          ?
        </button>
        <Tour
          steps={tour.stepsProfile}
          isOpen={isTourOpen}
          onRequestClose={this.closeTour}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />
      </>
    );
  }
}

export default Profile;
