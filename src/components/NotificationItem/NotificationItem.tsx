import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import styles from "./NotificationItem.module.css";
import * as transform from "../../utils/StringTransformation";
import { getIssuerName } from "../../utils/issuer";
import EUimage from "../../assets/images/european-union.png";
import { INotification } from "../../dtos/notifications";

type CallbackFunctionOpen = (notification: INotification) => void;

type Props = {
  notification: INotification;
  methodToOpen: CallbackFunctionOpen;
};

type State = {
  issuerName: string;
};

export class NotificationItem extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      issuerName: "",
    };
  }

  async componentDidMount(): Promise<void> {
    const { notification } = this.props;
    const issuerName = await getIssuerName(notification.sender);
    this.setState({
      issuerName,
    });
  }

  parseDate = (date: string): string => {
    return moment(date).format("LLL");
  };

  render(): JSX.Element {
    const { notification, methodToOpen } = this.props;
    const { issuerName } = this.state;
    return (
      <article
        className={`ecl-card ecl-card--tile ${styles.notificationItem}`}
        key={notification.id}
      >
        <header className="ecl-card__header">
          <h1 className="ecl-card__title">
            <img
              src={EUimage}
              height="32"
              width="32"
              className="rounded mr-2"
              alt=""
            />{" "}
            <Link
              to="/notifications"
              onClick={(e) => {
                e.preventDefault();
                methodToOpen(notification);
              }}
              className="ecl-link ecl-link--standalone"
            >
              {transform.notificationType(
                notification.message.notificationType,
                notification.message.name,
                notification.message.redirectURL
              )}
            </Link>
          </h1>
        </header>
        <div className="ecl-card__body">
          <div className="ecl-card__description">{issuerName}</div>
        </div>
        <footer className="ecl-card__footer">
          <ul className="ecl-card__info-container">
            <li className="ecl-card__info-item">
              <svg
                focusable="false"
                aria-hidden="true"
                className="ecl-icon ecl-icon--xs"
              >
                <use xlinkHref={`${eclIcons}#general--calendar`} />
              </svg>
              <span className="ecl-card__info-label">
                {this.parseDate(notification?.message?.timestamp || "")}
              </span>
            </li>
          </ul>
        </footer>
      </article>
    );
  }
}

export default NotificationItem;
