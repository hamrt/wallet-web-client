/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import "./Notifications.css";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { Modal } from "react-bootstrap";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import colors from "../../config/colors";
import { getJWT } from "../../utils/DataStorage";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import { strB64dec } from "../../utils/strB64dec";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as wallet from "../../apis/wallet";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import NotificationModal from "../../components/NotificationModal/NotificationModal";
import ToastEbsi from "../../components/ToastEbsi/ToastEbsi";
import EbsiBanner from "../../components/EbsiBanner/EbsiBanner";
import REQUIRED_VARIABLES from "../../config/env";
import { INotification } from "../../dtos/notifications";
import {
  getBodyWithNotificationSigned,
  decryptKeys,
} from "./Notifications.utils";

const DEMO = REQUIRED_VARIABLES.REACT_APP_DEMO;

type Props = {
  history: any;
};

export enum NotificationsStatus {
  Loading,
  Success,
  Error,
}

export enum NotificationProcessingStatus {
  None,
  Validating,
  Success,
  Error,
}

function Notifications(props: Props) {
  const [notifications, setNotifications] = useState<JSX.Element[]>([]);
  const [notificationsStatus, setNotificationsStatus] = useState<
    NotificationsStatus
  >(NotificationsStatus.Loading);
  const [notificationsError, setNotificationsError] = useState<string>("");
  const [notification, setNotification] = useState<INotification>(
    models.notification
  );
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastColor, setToastColor] = useState(colors.EC_GREEN);
  const [toastMessage, setToastMessage] = useState("Error");
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalAskingForPass, setIsModalAskingForPass] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [
    notificationProcessingStatus,
    setNotificationProcessingStatus,
  ] = useState<NotificationProcessingStatus>(NotificationProcessingStatus.None);
  const [
    notificationProcessingError,
    setNotificationProcessingError,
  ] = useState("");
  const { register, handleSubmit, errors } = useForm();

  const redirectTo = (whereRedirect: string) => {
    const { history } = props;
    history.push(`/${whereRedirect}`);
  };

  const openToast = (message: string) => {
    setIsToastOpen(true);
    setToastMessage(message);
    setToastColor(colors.EC_RED);
    setIsLoadingOpen(false);
  };

  const openSuccessToast = (message: string) => {
    setIsToastOpen(true);
    setToastMessage(message);
    setToastColor(colors.EC_GREEN);
    setIsLoadingOpen(false);
  };

  const closeToast = () => {
    setIsToastOpen(false);
  };

  const openNotificationModal = (notif: INotification) => {
    setIsModalNotificationOpen(true);
    setNotification(notif);
  };

  const closeNotificationModal = () => {
    setIsModalNotificationOpen(false);
    // Clean up errors
    setNotificationProcessingStatus(NotificationProcessingStatus.None);
    setNotificationProcessingError("");
  };

  const openNotification = async (notif: INotification) => {
    const notificationToOpen = notif;
    notificationToOpen.selectedCredentials = [];
    notificationToOpen.selectedCredsTypes = [];
    notificationToOpen.dataDecoded = strB64dec(notif.message.data.base64);
    openNotificationModal(notificationToOpen);
  };

  const openModalAskingForPass = () => {
    closeNotificationModal();
    setIsModalAskingForPass(true);
  };

  const disableBody = (target: HTMLDivElement) => {
    disableBodyScroll(target);
  };

  const enableBody = (target: HTMLDivElement) => {
    enableBodyScroll(target);
  };

  const closeModalAskingForPass = () => {
    setIsModalAskingForPass(false);
  };

  const openTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const acceptNotification = async (notificationToAccept: INotification) => {
    try {
      const type = notificationToAccept.message.notificationType;
      let body = {};
      const idNotification = notificationToAccept.id;

      if (type === 2) {
        body = {
          selectedCredentials: notificationToAccept.selectedCredentials,
        };
      }
      const response = await wallet.acceptNotification(idNotification, body);
      if (response.status === 200 || response.status === 201) {
        openSuccessToast(response.data.message);
        closeNotificationModal();
        window.location.reload();
      } else {
        if (response.status === 404) {
          openToast("Token invalid.");
          redirectTo("");
        }
        openToast(`Error signing the notification. ${response.data}`);
      }
    } catch (error) {
      closeNotificationModal();
      openToast("Error sending the notification.");
    }
  };

  const signNotification = async (
    secureEnclave: SecureEnclave,
    userPassword: string,
    notificationToSign: INotification
  ) => {
    try {
      const idNotification = notificationToSign.id;
      const body = await getBodyWithNotificationSigned(
        secureEnclave,
        userPassword,
        notificationToSign
      );
      const response = await wallet.acceptNotification(idNotification, body);
      if (response.status === 200 || response.status === 201) {
        openSuccessToast(response.data.message);
        closeModalAskingForPass();
        if (response.data.id !== undefined && response.data.id !== "") {
          window.location.assign(response.data.id);
        } else {
          window.location.reload();
        }
      } else if (response.status === 404) {
        setNotificationProcessingError("Token invalid.");
      } else {
        setNotificationProcessingError(
          `Error signing the notification ${response.data}`
        );
      }
    } catch (error) {
      setNotificationProcessingError("Error signing the notification.");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setNotificationProcessingStatus(NotificationProcessingStatus.Validating);

      const userPassword = data.passwordForKeyGeneration;
      if (!userPassword) throw new Error("No password provided");

      const se = SecureEnclave.Instance;
      await decryptKeys(se, userPassword);
      await signNotification(se, userPassword, notification);
      setNotificationProcessingStatus(NotificationProcessingStatus.Success);
      closeModalAskingForPass();
    } catch (error) {
      setNotificationProcessingError(error.toString());
      setNotificationProcessingStatus(NotificationProcessingStatus.Error);
    }
  };

  // ComponentDidMount
  useEffect(() => {
    async function componentDidMount() {
      setIsLoadingOpen(true);
      setNotificationsStatus(NotificationsStatus.Loading);
      const response = await wallet.getNotifications(getJWT() || "");
      if (response.status === 200 || response.status === 201) {
        const outNotifications = response.data.items as INotification[];
        const notifs = outNotifications.map((n) => (
          <NotificationItem
            notification={n}
            key={n.id}
            methodToOpen={openNotification}
          />
        ));

        setNotifications(notifs);
        setNotificationsStatus(NotificationsStatus.Success);
        setIsLoadingOpen(false);
      } else {
        setIsLoadingOpen(false);
        setNotificationsError(
          `Error getting the notifications: ${response.data}`
        );
        setNotificationsStatus(NotificationsStatus.Error);
      }
    }
    componentDidMount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <ToastEbsi
        isToastOpen={isToastOpen}
        methodToClose={closeToast}
        toastColor={toastColor}
        colorText={colors.WHITE}
        toastMessage={toastMessage}
      />
      <EbsiBanner
        title="Notifications Page"
        subtitle="List of the pending notifications to be signed."
        isLoadingOpen={isLoadingOpen}
      />
      <main className="ecl-container ecl-u-flex-grow-1 ecl-u-mb-l">
        <Modal show={isModalAskingForPass} onHide={closeModalAskingForPass}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header className="ModalHeader" closeButton>
              <Modal.Title>Sign It</Modal.Title>
            </Modal.Header>
            <Modal.Body className="ModalBody">
              <div className="ecl-form-group">
                <label className="ecl-form-label" htmlFor="password-key-gen">
                  Please enter your secret to unlock your private key for
                  signing.
                </label>
                {errors.passwordForKeyGeneration && (
                  <div className="ecl-feedback-message">
                    {errors.passwordForKeyGeneration.message ||
                      "Invalid password!"}
                  </div>
                )}
                <input
                  type="password"
                  id="password-key-gen"
                  name="passwordForKeyGeneration"
                  className={classNames("ecl-text-input ecl-u-width-100", {
                    "ecl-text-input--invalid": errors.passwordForKeyGeneration,
                  })}
                  placeholder="Password"
                  ref={register({ required: "The password can't be empty!" })}
                />
              </div>
              {notificationProcessingError && (
                <div
                  role="alert"
                  className="ecl-message ecl-message--error ecl-u-mt-m"
                  data-ecl-message="true"
                >
                  <svg
                    focusable="false"
                    aria-hidden="true"
                    className="ecl-message__icon ecl-icon ecl-icon--l"
                  >
                    <use xlinkHref={`${eclIcons}#notifications--error`} />
                  </svg>
                  <div className="ecl-message__content">
                    <div className="ecl-message__title">
                      {notificationProcessingError}
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button
                className="ecl-button ecl-button--ghost"
                type="button"
                onClick={closeModalAskingForPass}
              >
                Cancel
              </button>
              <button
                className="ecl-button ecl-button--primary"
                type="submit"
                disabled={
                  notificationProcessingStatus ===
                  NotificationProcessingStatus.Validating
                }
              >
                {notificationProcessingStatus ===
                NotificationProcessingStatus.Validating
                  ? "Validating..."
                  : "Validate"}
              </button>
            </Modal.Footer>
          </form>
        </Modal>
        <NotificationModal
          notification={notification}
          isModalNotificationOpen={isModalNotificationOpen}
          methodToClose={closeNotificationModal}
          methodToAccept={acceptNotification}
          methodToSign={openModalAskingForPass}
        />
        {notificationsStatus === NotificationsStatus.Error && (
          <div
            role="alert"
            className="ecl-message ecl-message--error"
            data-ecl-message="true"
          >
            <svg
              focusable="false"
              aria-hidden="true"
              className="ecl-message__icon ecl-icon ecl-icon--l"
            >
              <use xlinkHref={`${eclIcons}#notifications--error`} />
            </svg>
            <div className="ecl-message__content">
              <div className="ecl-message__title">Error</div>
              <p className="ecl-message__description">{notificationsError}</p>
            </div>
          </div>
        )}
        {notificationsStatus === NotificationsStatus.Success &&
          notifications.length === 0 && (
            <p>
              You don&#8217;t have any notification at the moment. Follow the{" "}
              <a className="ecl-link" href={DEMO}>
                demonstrator
              </a>{" "}
              to create some.
            </p>
          )}
        <div data-tut="reactour_notifications">{notifications}</div>
      </main>
      <Footer />
      <button
        onClick={openTour}
        className="ecl-button ecl-button--primary tourButton"
        type="button"
        title="Open guided tour"
      >
        ?
      </button>
      <Tour
        steps={tour.stepsNotifications}
        isOpen={isTourOpen}
        onRequestClose={closeTour}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
      />
    </>
  );
}

export default Notifications;
