import React, { Component } from "react";
import PropTypes from "prop-types";
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
import CredentialItemPresentation from "../CredentialItemPresentation/CredentialItemPresentation";

class NotificationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      credentials: [],
      notificationForPresentations: models.notification,
      isFullCredentialDisplayed: false,
    };
    this.select = this.select.bind(this);
  }

  async componentDidUpdate(prevProps) {
    const { notification } = this.props;
    if (prevProps.notification !== notification) {
      await this.getCredentials(notification);
    }
  }

  async getCredentials(notification) {
    /* const response = await idHub.getCredentialsForPresentation(notification); */
    const response = await idHub.getCredentials();
    if (response.status === 200 || response.status === 201) {
      const credentials = response.data.items.map((credential) => {
        if (credential.name !== "VerifiablePresentation") {
          return (
            <CredentialItemPresentation
              credential={credential}
              key={credential.id}
              methodToSelect={this.select}
            />
          );
        }
        return "";
      });
      if (notification !== undefined) {
        this.setState({
          notificationForPresentations: notification,
        });
      }
      this.setState({
        credentials,
      });
    }
  }

  select(hash) {
    const { notificationForPresentations } = this.state;
    const notificationAux = notificationForPresentations;
    const index = notificationAux.selectedCredentials.indexOf(hash);
    if (index === -1) {
      notificationAux.selectedCredentials.push(hash);
    } else {
      notificationAux.selectedCredentials.splice(index, 1);
    }
    this.setState({
      notificationForPresentations: notificationAux,
    });
  }

  openDetails() {
    this.setState({
      isFullCredentialDisplayed: true,
    });
  }

  closeDetails() {
    const { isFullCredentialDisplayed } = this.state;
    if (isFullCredentialDisplayed) {
      this.setState({
        isFullCredentialDisplayed: false,
      });
    }
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
      notificationForPresentations,
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
              onClick={() => this.closeDetails()}
            />
            <Modal.Title
              className="ModalTitleCredential"
              style={
                isFullCredentialDisplayed
                  ? { color: colors.WHITE }
                  : { color: colors.EC_BLUE }
              }
            >
              {transform.modifyNotificationTitle(
                notification.message.name,
                notification.message.notificationType
              )}
            </Modal.Title>
            {isAccepting && (
              <Spinner
                className="spinner"
                animation="border"
                role="status"
                variant="danger"
                size="lg"
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
              <Button variant="warning" onClick={() => this.openDetails()}>
                Details
              </Button>
            )}
            <Button variant="secondary" onClick={() => methodToClose}>
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
              {transform.requestedCredentials(notification.message.name)}
            </Modal.Title>
            {isAccepting && (
              <Spinner
                className="spinner"
                animation="border"
                role="status"
                variant="danger"
                size="lg"
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
          </Modal.Header>

          <Modal.Body className="ModalBodyPresentation">
            {credentials.length === 0 && (
              <p>
                You don&#8217;t have any credential at the moment. Follow the
                demonstrator to create some.
              </p>
            )}
            <ListGroup className="list-credentials">{credentials}</ListGroup>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => methodToClose}>
              Close
            </Button>
            <Button
              variant="info"
              onClick={() => methodToAccept(notificationForPresentations)}
              disabled={
                notificationForPresentations.selectedCredentials.length < 1
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
            Notarization of the document: &apos;{notification.message.name}
            &apos;
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => methodToClose}>
              Close
            </Button>
            <Button variant="info" onClick={() => methodToSign()}>
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
            <Button variant="secondary" onClick={() => methodToClose}>
              Close
            </Button>
            <Button variant="info" onClick={() => methodToSign()}>
              Sign It
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default NotificationModal;
NotificationModal.propTypes = {
  notification: PropTypes.shape(models.notificationShape).isRequired,
  isModalNotificationOpen: PropTypes.bool.isRequired,
  methodToClose: PropTypes.func.isRequired,
  methodToAccept: PropTypes.func.isRequired,
  isAccepting: PropTypes.bool.isRequired,
  methodToSign: PropTypes.func.isRequired,
};
