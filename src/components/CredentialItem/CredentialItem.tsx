import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./CredentialItem.module.css";
import * as transform from "../../utils/StringTransformation";
import { getIssuer } from "../../utils/issuer";
import logoDiploma from "../../assets/images/diploma.png";
import { IAttribute } from "../../dtos/attributes";

type CallbackFunctionOpen = (hash: string) => void;

type Props = {
  credential: IAttribute;
  methodToOpen: CallbackFunctionOpen;
};

type State = {
  issuer: string;
  name: string;
};

class CredentialItem extends Component<Props, State> {
  public isCredentialItemMounted: boolean;

  constructor(props: Readonly<Props>) {
    super(props);
    this.isCredentialItemMounted = false;
    this.state = {
      issuer: "",
      name: "",
    };
  }

  async componentDidMount(): Promise<void> {
    this.isCredentialItemMounted = true;
    const { credential } = this.props;
    const issuer = await getIssuer(credential);
    const name = await transform.modifyName(
      credential.name,
      "credential",
      credential.did
    );

    // Prevent memory leaks with this.isMounted
    if (this.isCredentialItemMounted) {
      this.setState({
        issuer,
        name,
      });
    }
  }

  componentWillUnmount(): void {
    this.isCredentialItemMounted = false;
  }

  render(): JSX.Element {
    const { credential, methodToOpen } = this.props;
    const { issuer, name } = this.state;
    return (
      <article
        className={`ecl-card ecl-card--tile ${styles.credentialItem}`}
        key={credential.id}
      >
        <header className="ecl-card__header">
          <h1 className="ecl-card__title">
            <img
              src={logoDiploma}
              height="32"
              width="32"
              className="logo rounded mr-2"
              alt=""
            />{" "}
            <Link
              to="/notifications"
              onClick={(e) => {
                e.preventDefault();
                methodToOpen(credential.hash);
              }}
              className="ecl-link ecl-link--standalone"
            >
              {name}
            </Link>
          </h1>
        </header>
        <div className="ecl-card__body">
          <div className="ecl-card__description">Issued By: {issuer}</div>
        </div>
      </article>
    );
  }
}

export default CredentialItem;
