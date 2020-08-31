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

function SignTransactionModal(props: Props) {
  const {
    notification,
    methodToClose,
    isModalNotificationOpen,
    methodToSign,
  } = props;

  return (
    <Modal
      show={
        isModalNotificationOpen && notification.message.notificationType === 4
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
        Your are about to sign {notification.message.name}
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

export default SignTransactionModal;
