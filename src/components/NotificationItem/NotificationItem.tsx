import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import moment from "moment";
import "./NotificationItem.css";
import colors from "../../config/colors";
import * as transform from "../../utils/StringTransformation";
import { getIssuerName } from "../../utils/issuer";
import EUimage from "../../assets/images/european-union.png";
import { INotification } from "../../dtos/notifications";

type CallbackFunctionOpen = (
  notification: INotification,
  ...args: any[]
) => void;

type Props = {
  notification: INotification;
  methodToOpen: CallbackFunctionOpen;
};

type State = {
  issuerName: string;
};

class NotificationItem extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      issuerName: "",
    };
  }

  async componentDidMount() {
    const { notification } = this.props;
    const issuerName = await getIssuerName(notification.sender);
    this.setState({
      issuerName,
    });
  }

  parseDate = (date: string) => {
    return moment(date).format("LLL");
  };

  render() {
    const { notification, methodToOpen } = this.props;
    const { issuerName } = this.state;
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
          <b>{issuerName}</b>
        </p>
        <p style={{ color: colors.EC_BLUE, wordWrap: "break-word" }}>
          {transform.notificationType(
            notification.message.notificationType,
            notification.message.name,
            notification.message.redirectURL
          )}
          <br />
          {this.parseDate(notification?.message?.timestamp || "")}
        </p>
      </ListGroup.Item>
    );
  }
}

export default NotificationItem;
