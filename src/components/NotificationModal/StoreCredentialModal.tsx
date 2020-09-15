import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import JSONPretty from "react-json-pretty";
import "./NotificationModal.css";
import * as transform from "../../utils/StringTransformation";
import { VID } from "../CredentialTypes/VID/VID";
import { Diploma } from "../CredentialTypes/Diploma/Diploma";
import { INotification } from "../../dtos/notifications";

type CallbackFunction = () => void;
type CallbackFunctionAccept = (notification: INotification) => void;

type Props = {
  notification: INotification;
  isModalNotificationOpen: boolean;
  methodToClose: CallbackFunction;
  methodToAccept: CallbackFunctionAccept;
};

export const StoreCredentialModal: React.FunctionComponent<Props> = ({
  notification,
  methodToClose,
  isModalNotificationOpen,
  methodToAccept,
}: Props) => {
  const [isFullCredentialDisplayed, setIsFullCredentialDisplayed] = useState(
    false
  );
  const [title, setTitle] = useState("");

  const closeDetails = () => {
    if (isFullCredentialDisplayed) {
      setIsFullCredentialDisplayed(false);
    }
  };

  const openDetails = () => {
    setIsFullCredentialDisplayed(true);
  };

  useEffect(() => {
    const updateTitle = async (notif: INotification) => {
      const newTitle = await transform.modifyNotificationTitle(
        notif.message.name,
        notif.message.notificationType
      );

      if (title !== newTitle) {
        setTitle(newTitle);
      }
    };

    updateTitle(notification);
  }, [notification]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      show={
        isModalNotificationOpen &&
        (notification.message.notificationType === 0 ||
          notification.message.notificationType === 1)
      }
      onHide={methodToClose}
      size="lg"
    >
      <Modal.Header className="ModalHeader" closeButton>
        <Modal.Title className="ModalTitleCredential">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isFullCredentialDisplayed && (
          <>
            {notification.message.notificationType === 1 && (
              <VID data={notification.dataDecoded || ""} />
            )}
            {notification.message.notificationType === 0 && (
              <Diploma data={notification.dataDecoded || ""} />
            )}
          </>
        )}
        {isFullCredentialDisplayed && (
          <JSONPretty id="json-pretty-store" data={notification.dataDecoded} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="ecl-button ecl-button--ghost"
          type="button"
          onClick={methodToClose}
        >
          Close
        </button>
        {!isFullCredentialDisplayed ? (
          <button
            className="ecl-button ecl-button--secondary"
            type="button"
            onClick={openDetails}
          >
            Open Details
          </button>
        ) : (
          <button
            className="ecl-button ecl-button--secondary"
            type="button"
            onClick={closeDetails}
          >
            Close Details
          </button>
        )}
        <button
          className="ecl-button ecl-button--primary"
          type="button"
          onClick={() => methodToAccept(notification)}
        >
          Accept
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default StoreCredentialModal;
