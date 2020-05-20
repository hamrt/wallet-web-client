import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Notifications.css";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import colors from "../../config/colors";
import {
  getJWT,
  getDID,
  connectionNotEstablished,
} from "../../utils/DataStorage";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import strB64dec from "../../utils/strB64dec";
import { isTokenExpired } from "../../utils/JWTHandler";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as wallet from "../../apis/wallet";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import NotificationModal from "../../components/NotificationModal/NotificationModal";
import ToastEbsi from "../../components/ToastEbsi/ToastEbsi";
import EbsiBanner from "../../components/EbsiBanner/EbsiBanner";
import { REACT_APP_DEMO } from "../../config/env";
import { loginLink } from "../../apis/ecas";

const DEMO = REACT_APP_DEMO;

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.passwordForKeyGeneration = React.createRef();

    this.state = {
      notifications: [],
      notification: models.notification,
      isLoadingOpen: false,
      isToastOpen: false,
      isAccepting: false,
      toastColor: colors.EC_GREEN,
      toastMessage: "Error",
      isModalNotificationOpen: false,
      isModalAskingForPass: false,
      isTourOpen: false,
    };
    this.openNotification = this.openNotification.bind(this);
    this.closeToast = this.closeToast.bind(this);
    this.acceptNotification = this.acceptNotification.bind(this);
    this.closeNotificationModal = this.closeNotificationModal.bind(this);
    this.openModalAskingForPass = this.openModalAskingForPass.bind(this);
  }

  componentDidMount() {
    if (connectionNotEstablished()) {
      this.redirectTo("");
    } else if (isTokenExpired(getJWT())) {
      window.location.assign(loginLink());
    }

    this.getNotifications();
  }

  async onValidateClick(notification) {
    try {
      this.closeModalAskingForPass();
      this.startLoading();

      const userPassword = this.passwordForKeyGeneration.current.value;

      const se = SecureEnclave.Instance;
      await this.decryptKeys(se, userPassword);
      await this.signNotification(se, userPassword, notification);
    } catch (error) {
      this.closeModalAskingForPass();
      this.openToast(error.toString());
    }
  }

  async getNotifications() {
    this.startLoading();
    const response = await wallet.getNotifications(getJWT());
    if (response.status === 200 || response.status === 201) {
      this.setState({
        notifications: response.data.items.map((notification) => {
          return (
            <NotificationItem
              notification={notification}
              key={notification.id}
              methodToOpen={this.openNotification}
            />
          );
        }),
      });
      this.stopLoading();
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }
      this.openToast(`Error getting the notifications. ${response.data}`);
    }
  }

  disableBody = (target) => {
    disableBodyScroll(target);
  };

  enableBody = (target) => {
    enableBodyScroll(target);
  };

  decryptKeys = async (se, userPassword) => {
    const options = {
      encryptedKey: localStorage.getItem("Keys"),
      password: userPassword,
    };

    await se.restoreWallet(options);
  };

  getBodyWithNotificationSigned = async (
    secureEnclave,
    userPassword,
    notificationToSign
  ) => {
    let body = "";
    const dataDecoded = await strB64dec(notificationToSign.message.data.base64);
    const type = notificationToSign.message.notificationType;

    if (type === 3) {
      const signature = await secureEnclave.signJwt(
        getDID(),
        dataDecoded,
        userPassword
      );
      body = {
        signature,
      };
    } else if (type === 4) {
      const txJSON = JSON.parse(dataDecoded);
      const signatureTx = await secureEnclave.signTx(
        getDID(),
        txJSON,
        userPassword
      );
      body = {
        signature: signatureTx,
      };
    }
    return body;
  };

  async acceptNotification(notification) {
    try {
      const type = notification.message.notificationType;
      let body = "";
      const idNotification = notification.id;

      if (type === 2) {
        body = {
          selectedCredentials: notification.selectedCredentials,
        };
      } else {
        body = {};
      }
      const response = await wallet.acceptNotification(idNotification, body);
      if (response.status === 200 || response.status === 201) {
        this.openSuccessToast(response.data.message);
        this.closeNotificationModal();
        window.location.reload();
      } else {
        if (response.status === 404) {
          this.openToast("Token invalid.");
          this.redirectTo("");
        }
        this.openToast(`Error signing the notification. ${response.data}`);
      }
    } catch (error) {
      this.closeNotificationModal();
      this.openToast("Error sending the notification.");
    }
  }

  async signNotification(secureEnclave, userPassword, notificationToSign) {
    try {
      const idNotification = notificationToSign.id;
      const body = await this.getBodyWithNotificationSigned(
        secureEnclave,
        userPassword,
        notificationToSign
      );
      const response = await wallet.acceptNotification(idNotification, body);
      if (response.status === 200 || response.status === 201) {
        this.openSuccessToast(response.data.message);
        if (response.data.id !== undefined && response.data.id !== "") {
          window.location.assign(response.data.id);
        } else {
          window.location.reload();
        }
      } else {
        if (response.status === 404) {
          this.openToast("Token invalid.");
          this.redirectTo("");
        }
        this.openToast(`Error signing the notification ${response.data}`);
      }
    } catch (error) {
      this.openToast("Error signing the notification.");
    }
  }

  redirectTo(whereRedirect) {
    const { history } = this.props;
    history.push(`/${whereRedirect}`);
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

  openToast(message) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      isLoadingOpen: false,
      toastColor: colors.EC_RED,
    });
  }

  openSuccessToast(message) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      toastColor: colors.EC_GREEN,
      isAccepting: false,
    });
  }

  closeToast() {
    this.setState({
      isToastOpen: false,
    });
  }

  openNotificationModal(notification) {
    this.setState({
      isModalNotificationOpen: true,
      notification,
    });
  }

  closeNotificationModal() {
    this.setState({
      isModalNotificationOpen: false,
    });
  }

  async openNotification(notification) {
    const notificationToOpen = notification;
    notificationToOpen.selectedCredentials = [];
    notificationToOpen.dataDecoded = await strB64dec(
      notification.message.data.base64
    );
    this.openNotificationModal(notificationToOpen);
  }

  openModalAskingForPass() {
    this.closeNotificationModal();
    this.setState({
      isModalAskingForPass: true,
    });
  }

  closeModalAskingForPass() {
    this.setState({
      isModalAskingForPass: false,
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
      notifications,
      notification,
      toastColor,
      isToastOpen,
      toastMessage,
      isLoadingOpen,
      isModalAskingForPass,
      isModalNotificationOpen,
      isAccepting,
      isTourOpen,
    } = this.state;

    return (
      <div className="documents-container">
        <Header />

        <ToastEbsi
          isToastOpen={isToastOpen}
          methodToClose={this.closeToast}
          toastColor={toastColor}
          colorText={colors.WHITE}
          toastMessage={toastMessage}
        />
        <EbsiBanner
          title="Notifications Page"
          subtitle="List of the pending notifications to be signed."
          isLoadingOpen={isLoadingOpen}
        />
        <div className="table-container">
          <Modal
            show={isModalAskingForPass}
            onHide={() => this.closeModalAskingForPass()}
          >
            <Modal.Header
              className="ModalHeader"
              style={{ backgroundColor: colors.EC_BLUE }}
              closeButton
            >
              <Modal.Title className="ModalTitle">Sign It</Modal.Title>
            </Modal.Header>
            <Modal.Body className="ModalBody">
              <h4>
                {" "}
                Please enter your secret to unlock your private key for signing.{" "}
              </h4>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={this.passwordForKeyGeneration}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.closeModalAskingForPass()}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => this.onValidateClick(notification)}
              >
                Validate
              </Button>
            </Modal.Footer>
          </Modal>

          <NotificationModal
            notification={notification}
            isModalNotificationOpen={isModalNotificationOpen}
            methodToClose={this.closeNotificationModal}
            methodToAccept={this.acceptNotification}
            isAccepting={isAccepting}
            methodToSign={this.openModalAskingForPass}
          />

          {notifications.length === 0 && (
            <p>
              You don&#8217;t have any notification at the moment. Follow the{" "}
              <a href={DEMO}> demonstrator</a> to create some.
            </p>
          )}
          <ListGroup
            className="list-notifications"
            data-tut="reactour_notifications"
          >
            {notifications}
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
          steps={tour.stepsNotifications}
          isOpen={isTourOpen}
          onRequestClose={() => this.closeTour()}
          onAfterOpen={() => this.disableBody()}
          onBeforeClose={() => this.enableBody()}
        />
      </div>
    );
  }
}

export default Notifications;
Notifications.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.any.isRequired,
};
