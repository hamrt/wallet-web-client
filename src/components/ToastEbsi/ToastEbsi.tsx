import React from "react";
import { Toast } from "react-bootstrap";
import colors from "../../config/colors";
import EUimage from "../../assets/images/european-union.png";

type CallbackFunction = () => void;

type Props = {
  isToastOpen: boolean;
  methodToClose: CallbackFunction;
  toastColor: string;
  colorText: string;
  toastMessage: string;
};

const toastStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  margin: "0 auto",
  backgroundColor: "rgba(255,255,255,1)",
  border: "none",
  zIndex: 10,
};

export const ToastEbsi: React.FunctionComponent<Props> = ({
  isToastOpen,
  methodToClose,
  toastColor,
  colorText,
  toastMessage,
}: Props) => (
  <Toast show={isToastOpen} onClose={methodToClose} style={toastStyle}>
    <Toast.Header style={{ backgroundColor: toastColor, color: colorText }}>
      <img
        src={EUimage}
        height="16"
        width="16"
        className="rounded mr-2"
        alt=""
      />
      <strong className="mr-auto">
        {toastColor === colors.EC_GREEN ? "Success" : "Error"}
      </strong>
      <small>Ebsi Wallet</small>
    </Toast.Header>
    <Toast.Body>{toastMessage}</Toast.Body>
  </Toast>
);
export default ToastEbsi;
