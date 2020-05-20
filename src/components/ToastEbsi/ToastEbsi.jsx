import React from "react";
import { Toast } from "react-bootstrap";
import PropTypes from "prop-types";
import colors from "../../config/colors";

const EUimage = require("../../assets/images/european-union.png");

const ToastEbsi = ({
  isToastOpen,
  methodToClose,
  toastColor,
  colorText,
  toastMessage,
}) => (
  <Toast
    show={isToastOpen}
    onClose={methodToClose}
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      margin: "0 auto",
      backgroundColor: "rgba(255,255,255,1)",
      border: "none",
      zIndex: 10,
    }}
  >
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
ToastEbsi.propTypes = {
  isToastOpen: PropTypes.bool.isRequired,
  methodToClose: PropTypes.func.isRequired,
  toastColor: PropTypes.string.isRequired,
  colorText: PropTypes.string.isRequired,
  toastMessage: PropTypes.string.isRequired,
};
