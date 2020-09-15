import React from "react";
import "./NotificationModal.css";
import { INotification } from "../../dtos/notifications";
import { StoreCredentialModal } from "./StoreCredentialModal";
import { RequestPresentationModal } from "./RequestPresentationModal";
import { SignTransactionModal } from "./SignTransactionModal";
import { SignPayloadModal } from "./SignPayloadModal";

type CallbackFunction = () => void;
type CallbackFunctionAccept = (notification: INotification) => void;

type Props = {
  notification: INotification;
  isModalNotificationOpen: boolean;
  methodToClose: CallbackFunction;
  methodToAccept: CallbackFunctionAccept;
  methodToSign: CallbackFunction;
};

export const NotificationModal: React.FunctionComponent<Props> = ({
  notification,
  methodToClose,
  isModalNotificationOpen,
  methodToAccept,
  methodToSign,
}: Props) => {
  if (
    notification.message.notificationType === 0 ||
    notification.message.notificationType === 1
  ) {
    return (
      <StoreCredentialModal
        notification={notification}
        isModalNotificationOpen={isModalNotificationOpen}
        methodToClose={methodToClose}
        methodToAccept={methodToAccept}
      />
    );
  }

  if (notification.message.notificationType === 2) {
    return (
      <RequestPresentationModal
        notification={notification}
        isModalNotificationOpen={isModalNotificationOpen}
        methodToClose={methodToClose}
        methodToAccept={methodToAccept}
      />
    );
  }

  if (notification.message.notificationType === 3) {
    return (
      <SignPayloadModal
        notification={notification}
        isModalNotificationOpen={isModalNotificationOpen}
        methodToClose={methodToClose}
        methodToSign={methodToSign}
      />
    );
  }

  if (notification.message.notificationType === 4) {
    return (
      <SignTransactionModal
        notification={notification}
        isModalNotificationOpen={isModalNotificationOpen}
        methodToClose={methodToClose}
        methodToSign={methodToSign}
      />
    );
  }

  return null;
};

export default NotificationModal;
