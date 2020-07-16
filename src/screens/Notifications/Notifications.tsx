import React, { Component } from "react";
import "./Notifications.css";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import { TransactionRequest } from "ethers/providers";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import colors from "../../config/colors";
import {
  getJWT,
  getDID,
  connectionNotEstablished,
} from "../../utils/DataStorage";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import { strB64dec } from "../../utils/strB64dec";
import { isTokenExpired } from "../../utils/JWTHandler";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as wallet from "../../apis/wallet";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import NotificationModal from "../../components/NotificationModal/NotificationModal";
import ToastEbsi from "../../components/ToastEbsi/ToastEbsi";
import EbsiBanner from "../../components/EbsiBanner/EbsiBanner";
import REQUIRED_VARIABLES from "../../config/env";
import { loginLink } from "../../apis/ecas";
import { INotification, NotificationsOptions } from "../../dtos/notifications";
import { IWalletOptions } from "../../secureEnclave/UserWallet";

const DEMO = REQUIRED_VARIABLES.REACT_APP_DEMO;

type Props = {
  history: any;
  location: any;
};

type State = {
  notifications: JSX.Element[];
  notification: INotification;
  isLoadingOpen: boolean;
  isToastOpen: boolean;
  isAccepting: boolean;
  toastColor: string;
  toastMessage: string;
  isModalNotificationOpen: boolean;
  isModalAskingForPass: boolean;
  isTourOpen: boolean;
};

class Notifications extends Component<Props, State> {
  passwordForKeyGeneration: React.RefObject<HTMLInputElement>;

  constructor(props: Readonly<Props>) {
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
    } else if (isTokenExpired(getJWT() || "")) {
      window.location.assign(loginLink());
    }

    this.getNotifications();
  }

  async onValidateClick(notification: INotification) {
    try {
      this.closeModalAskingForPass();
      this.startLoading();

      const userPassword = this.passwordForKeyGeneration.current?.value;
      if (!userPassword) throw new Error("No password provided");

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
    const response = await wallet.getNotifications(getJWT() || "");
    if (response.status === 200 || response.status === 201) {
      const outNotifications = response.data.items as INotification[];
      const notifications = outNotifications.map((notification) => (
        <NotificationItem
          notification={notification}
          key={notification.id}
          methodToOpen={this.openNotification}
        />
      ));

      this.setState({
        notifications,
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

  disableBody = (target: HTMLDivElement) => {
    disableBodyScroll(target);
  };

  enableBody = (target: HTMLDivElement) => {
    enableBodyScroll(target);
  };

  decryptKeys = async (se: SecureEnclave, userPassword: string) => {
    const options: IWalletOptions = {
      encryptedKey: localStorage.getItem("Keys") || "",
      password: userPassword,
    };

    await se.restoreWallet(options);
  };

  getBodyWithNotificationSigned = async (
    secureEnclave: SecureEnclave,
    userPassword: string,
    notificationToSign: INotification
  ): Promise<NotificationsOptions> => {
    let body: NotificationsOptions = {};
    let signData: string;
    let txJSON: TransactionRequest;
    const dataDecoded = strB64dec(notificationToSign.message.data.base64);
    const type = notificationToSign.message.notificationType;
    const did = getDID();
    if (!did) throw new Error("User DID not found.");
    switch (type) {
      case 3:
        signData = await secureEnclave.signJwt(
          did,
          Buffer.from(dataDecoded),
          userPassword
        );
        body = {
          signature: signData,
        };
        break;
      case 4:
        txJSON = JSON.parse(dataDecoded);
        signData = await secureEnclave.signTx(did, txJSON, userPassword);
        body = {
          signature: signData,
        };
        break;
      default:
        throw new Error(`types supported are only 3 and 4`);
    }
    return body;
  };

  async acceptNotification(notification: INotification) {
    try {
      const type = notification.message.notificationType;
      let body = {};
      const idNotification = notification.id;

      if (type === 2) {
        body = {
          selectedCredentials: notification.selectedCredentials,
        };
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

  async signNotification(
    secureEnclave: SecureEnclave,
    userPassword: string,
    notificationToSign: INotification
  ) {
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

  redirectTo(whereRedirect: string) {
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

  openToast(message: string) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      isLoadingOpen: false,
      toastColor: colors.EC_RED,
    });
  }

  openSuccessToast(message: string) {
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

  openNotificationModal(notification: INotification) {
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

  async openNotification(notification: INotification) {
    const notificationToOpen = notification;
    notificationToOpen.selectedCredentials = [];
    notificationToOpen.selectedCredsTypes = [];
    notificationToOpen.dataDecoded = strB64dec(
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
          onAfterOpen={(e) => this.disableBody(e)}
          onBeforeClose={(e) => this.enableBody(e)}
        />
      </div>
    );
  }
}

export default Notifications;
