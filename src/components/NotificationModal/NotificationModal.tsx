import React, { Component } from "react";
import { Button, Modal, ListGroup, Spinner } from "react-bootstrap";
import JSONPretty from "react-json-pretty";
import { TiArrowBack } from "react-icons/ti";
import "./NotificationModal.css";
import colors from "../../config/colors";
import * as transform from "../../utils/StringTransformation";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import VID from "../CredentialTypes/VID/VID";
import Diploma from "../CredentialTypes/Diploma/Diploma";
import { parseDecodedData } from "../../utils/strB64dec";
import areStringArraysEqual from "../../utils/util";
import CredentialItemPresentation from "../CredentialItemPresentation/CredentialItemPresentation";
import { INotification } from "../../dtos/notifications";
import { presentations } from "../../dtos";
import { IAttribute } from "../../dtos/attributes";

type CallbackFunction = () => void;
type CallbackFunctionAccept = (
  notification: INotification,
  ...args: any[]
) => void;

type Props = {
  notification: INotification;
  isModalNotificationOpen: boolean;
  methodToClose: CallbackFunction;
  methodToAccept: CallbackFunctionAccept;
  isAccepting: boolean;
  methodToSign: CallbackFunction;
};

type State = {
  credentials: JSX.Element[];
  notificationForPresentations: INotification;
  isFullCredentialDisplayed: boolean;
  isReadingCreds: boolean;
  title: string;
};

class NotificationModal extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      credentials: [],
      notificationForPresentations: models.notification,
      isFullCredentialDisplayed: false,
      isReadingCreds: true,
      title: "",
    };
    this.select = this.select.bind(this);
  }

  async componentDidUpdate(prevProps: Readonly<Props>) {
    const { notification } = this.props;
    if (prevProps.notification !== notification) {
      await this.getCredentials(notification);
    }

    await this.updateTitle(notification);
  }

  getRequiredCredsFormatedType() {
    const { notificationForPresentations } = this.state;
    const dataParsed = parseDecodedData(
      notificationForPresentations?.message?.data?.base64
    );
    const { type } = presentations.presentationInputFromJSON(dataParsed);
    const formatedTypes = transform.getSelectRequestedCredentialsText(type);
    return formatedTypes;
  }

  getRequiredCredsNumber() {
    const { notificationForPresentations } = this.state;
    const dataParsed = parseDecodedData(
      notificationForPresentations?.message?.data?.base64
    );
    const { type } = presentations.presentationInputFromJSON(dataParsed);
    if (!type) return 0;
    return type.length;
  }

  async getCredentials(notification: INotification) {
    const { status, data } = await idHub.getCredentialsForPresentation(
      notification
    );

    if (status === 200 || status === 201) {
      const credentials = (data.items as IAttribute[])
        .filter(
          (credential) =>
            Array.isArray(credential.type) &&
            credential.type.length > 0 &&
            credential.type.includes("VerifiableCredential")
        )
        .map((filteredCred) => (
          <CredentialItemPresentation
            credential={filteredCred}
            key={filteredCred.id}
            methodToSelect={this.select}
          />
        ));
      if (notification) {
        this.setState({
          notificationForPresentations: notification,
        });
      }
      this.setState({
        credentials,
        isReadingCreds: false,
      });
    }
  }

  closeDetails = () => {
    const { isFullCredentialDisplayed } = this.state;
    if (isFullCredentialDisplayed) {
      this.setState({
        isFullCredentialDisplayed: false,
      });
    }
  };

  openDetails = () => {
    this.setState({
      isFullCredentialDisplayed: true,
    });
  };

  async updateTitle(notification: INotification) {
    const { title: currentTitle } = this.state;

    const title = await transform.modifyNotificationTitle(
      notification.message.name,
      notification.message.notificationType
    );

    if (currentTitle !== title) {
      this.setState({ title });
    }
  }

  validateCredentialsType() {
    const { notificationForPresentations } = this.state;
    const dataParsed = parseDecodedData(
      notificationForPresentations.message.data.base64
    );
    const { type } = presentations.presentationInputFromJSON(dataParsed);
    if (!type || !notificationForPresentations.selectedCredsTypes) return true;
    if (notificationForPresentations.selectedCredsTypes.length <= 0)
      return true;
    if (!Array.isArray(notificationForPresentations.selectedCredsTypes[0]))
      return true;
    const { selectedCredsTypes } = notificationForPresentations;
    // check that all types requested are the ones selected
    const equals = areStringArraysEqual(type, selectedCredsTypes);
    return equals;
  }

  validateSelectedCredentialsNumber() {
    const { notificationForPresentations } = this.state;
    // the number of selected credentials should be the same as requested
    const nSelectedCreds =
      notificationForPresentations?.selectedCredentials?.length;
    return nSelectedCreds >= this.getRequiredCredsNumber();
  }

  select(hash: string, type: string[]) {
    const { notificationForPresentations } = this.state;
    const notificationAux = notificationForPresentations;
    const index = notificationAux.selectedCredentials.indexOf(hash);
    if (index === -1) {
      notificationAux.selectedCredentials.push(hash);
      notificationAux.selectedCredsTypes.push(type);
    } else {
      notificationAux.selectedCredentials.splice(index, 1);
      notificationAux.selectedCredsTypes.splice(index, 1);
    }
    this.setState({
      notificationForPresentations: notificationAux,
    });
  }

  render() {
    const {
      notification,
      methodToClose,
      isModalNotificationOpen,
      methodToAccept,
      isAccepting,
      methodToSign,
    } = this.props;

    const {
      credentials,
      isFullCredentialDisplayed,
      isReadingCreds,
      notificationForPresentations,
      title,
    } = this.state;

    return (
      <div>
        <Modal
          show={
            isModalNotificationOpen &&
            (notification.message.notificationType === 0 ||
              notification.message.notificationType === 1)
          }
          onHide={methodToClose}
          size="lg"
        >
          <Modal.Header
            className="ModalHeader"
            style={
              isFullCredentialDisplayed
                ? { backgroundColor: colors.EC_BLUE }
                : { backgroundColor: colors.EC_YELLOW }
            }
            closeButton
          >
            <TiArrowBack
              className="BackButton"
              style={
                isFullCredentialDisplayed
                  ? { color: colors.WHITE }
                  : { color: colors.EC_YELLOW }
              }
              onClick={this.closeDetails}
            />
            <Modal.Title
              className="ModalTitleCredential"
              style={
                isFullCredentialDisplayed
                  ? { color: colors.WHITE }
                  : { color: colors.EC_BLUE }
              }
            >
              {title}
            </Modal.Title>
            {isAccepting && (
              <Spinner
                className="spinner"
                animation="border"
                role="status"
                variant="danger"
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
          </Modal.Header>
          <Modal.Body
            className="bodyDisplayCredential"
            style={
              isFullCredentialDisplayed
                ? { backgroundColor: colors.WHITE }
                : { backgroundColor: colors.EC_BLUE_BACK }
            }
          >
            {!isFullCredentialDisplayed && (
              <div>
                {notification.message.notificationType === 1 && (
                  <div>
                    <VID data={notification.dataDecoded} />
                  </div>
                )}

                {notification.message.notificationType === 0 && (
                  <div>
                    <Diploma data={notification.dataDecoded} />
                  </div>
                )}
              </div>
            )}
            {isFullCredentialDisplayed && (
              <JSONPretty
                id="json-pretty-store"
                data={notification.dataDecoded}
              />
            )}
          </Modal.Body>
          <Modal.Footer
            style={
              isFullCredentialDisplayed
                ? { backgroundColor: colors.EC_BLUE }
                : { backgroundColor: colors.EC_YELLOW }
            }
          >
            {!isFullCredentialDisplayed && (
              <Button variant="warning" onClick={this.openDetails}>
                Details
              </Button>
            )}
            <Button variant="secondary" onClick={methodToClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => methodToAccept(notification)}
            >
              Accept
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={
            isModalNotificationOpen &&
            notification.message.notificationType === 2
          }
          onHide={methodToClose}
        >
          <Modal.Header
            className="ModalHeader"
            style={{ backgroundColor: colors.EC_BLUE }}
            closeButton
          >
            <Modal.Title className="ModalTitle">
              {!isReadingCreds && this.getRequiredCredsFormatedType()}
            </Modal.Title>
            {(isAccepting || isReadingCreds) && (
              <Spinner
                className="spinner"
                animation="border"
                role="status"
                variant="danger"
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
          </Modal.Header>

          <Modal.Body className="ModalBodyPresentation">
            {!isReadingCreds && credentials.length === 0 && (
              <p>
                You don&#8217;t have any credential at the moment. Follow the
                demonstrator to create some.
              </p>
            )}
            <ListGroup className="list-credentials">{credentials}</ListGroup>
            {this.validateSelectedCredentialsNumber() &&
              !this.validateCredentialsType() && (
                <p style={{ color: colors.EC_RED }}>
                  Please, select the Credentials types specified.
                </p>
              )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={methodToClose}>
              Close
            </Button>
            <Button
              variant="info"
              onClick={() => methodToAccept(notificationForPresentations)}
              disabled={
                !this.validateSelectedCredentialsNumber() ||
                !this.validateCredentialsType()
              }
            >
              Validate
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={
            isModalNotificationOpen &&
            notification.message.notificationType === 4
          }
          onHide={methodToClose}
        >
          <Modal.Header
            className="ModalHeader"
            style={{ backgroundColor: colors.EC_BLUE }}
            closeButton
          >
            <Modal.Title className="ModalTitle">
              {transform.notificationType(
                notification.message.notificationType,
                notification.message.name,
                notification.message.redirectURL
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="ModalBody">
            Your are about to sign {notification.message.name}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={methodToClose}>
              Close
            </Button>
            <Button variant="info" onClick={methodToSign}>
              Sign It
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={
            isModalNotificationOpen &&
            notification.message.notificationType === 3
          }
          onHide={methodToClose}
        >
          <Modal.Header
            className="ModalHeader"
            style={{ backgroundColor: colors.EC_BLUE }}
            closeButton
          >
            <Modal.Title className="ModalTitle">
              {transform.notificationType(
                notification.message.notificationType,
                notification.message.name,
                notification.message.redirectURL
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="ModalBody">
            Please sign with your private key your eID presentation before
            sending it.
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={methodToClose}>
              Close
            </Button>
            <Button variant="info" onClick={methodToSign}>
              Sign It
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default NotificationModal;
