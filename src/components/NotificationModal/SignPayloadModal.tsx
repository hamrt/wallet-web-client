import React from "react";
import { Modal } from "react-bootstrap";
import "./NotificationModal.css";
import * as transform from "../../utils/StringTransformation";
import { INotification } from "../../dtos/notifications";

type CallbackFunction = () => void;
type CallbackFunctionAccept = (
  notification: INotification,
  ...args: any[]
) => void;

type Props = {
  notification: INotification;
  isModalNotificationOpen: boolean;
  methodToClose: CallbackFunction;
  methodToSign: CallbackFunction;
};

function SignPayloadModal(props: Props) {
  const {
    notification,
    methodToClose,
    isModalNotificationOpen,
    methodToSign,
  } = props;

  return (
    <Modal
      show={
        isModalNotificationOpen && notification.message.notificationType === 3
      }
      onHide={methodToClose}
    >
      <Modal.Header className="ModalHeader" closeButton>
        <Modal.Title>
          {transform.notificationType(
            notification.message.notificationType,
            notification.message.name,
            notification.message.redirectURL
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="ModalBody">
        Please sign with your private key your eID presentation before sending
        it.
      </Modal.Body>
      <Modal.Footer>
        <button
          className="ecl-button ecl-button--ghost"
          type="button"
          onClick={methodToClose}
        >
          Close
        </button>
        <button
          className="ecl-button ecl-button--primary"
          type="button"
          onClick={methodToSign}
        >
          Sign It
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignPayloadModal;
