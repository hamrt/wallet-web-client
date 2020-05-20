import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroup } from "react-bootstrap";
import moment from "moment";
import "./NotificationItem.css";
import colors from "../../config/colors";
import * as transform from "../../utils/StringTransformation";
import * as config from "../../config/config";
import * as models from "../../models/Models";
import { getDID, getUserName } from "../../utils/DataStorage";

const EUimage = require("../../assets/images/european-union.png");

class NotificationItem extends Component {
  getEmisorName = (emisor) => {
    let emisorName = emisor;
    if (emisor === getDID()) {
      emisorName = getUserName();
    }
    if (config.DID_EBSI_SERVICES[emisor] !== undefined) {
      emisorName = config.DID_EBSI_SERVICES[emisor];
    }
    return emisorName;
  };

  parseDate = (date) => {
    return moment(date).format("LLL");
  };

  render() {
    const { notification, methodToOpen } = this.props;
    return (
      <ListGroup.Item
        className="notification ecl-card ecl-card--title"
        action
        onClick={() => methodToOpen(notification)}
        key={notification.id}
        style={{ backgroundColor: colors.EC_YELLOW }}
      >
        <img
          src={EUimage}
          height="32"
          width="32"
          className="logo rounded mr-2"
          alt=""
        />
        <p style={{ color: colors.EC_BLUE, wordWrap: "break-word" }}>
          <b>{this.getEmisorName(notification.sender)}</b>
        </p>
        <p style={{ color: colors.EC_BLUE, wordWrap: "break-word" }}>
          {transform.notificationType(
            notification.message.notificationType,
            notification.message.name,
            notification.message.redirectURL
          )}
          <br />
          {this.parseDate(notification.timestamp)}
        </p>
      </ListGroup.Item>
    );
  }
}

export default NotificationItem;
NotificationItem.propTypes = {
  notification: PropTypes.shape(models.notificationShape).isRequired,
  methodToOpen: PropTypes.func.isRequired,
};
NotificationItem.defaultTypes = {
  notification: models.notification,
};
