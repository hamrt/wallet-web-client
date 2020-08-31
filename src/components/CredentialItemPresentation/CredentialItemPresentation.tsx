import React from "react";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import styles from "./CredentialItemPresentation.module.css";
import * as transform from "../../utils/StringTransformation";
import { getIssuer } from "../../utils/issuer";
import diplomaImage from "../../assets/images/diploma.png";
import { IAttribute } from "../../dtos/attributes";

type CallbackFunctionSelect = (
  hash: string,
  type: string[],
  ...args: any[]
) => void;

type Props = {
  credential: IAttribute;
  methodToSelect: CallbackFunctionSelect;
  defaultChecked: boolean;
};

type State = {
  issuer: string;
  name: string;
};

class CredentialItemPresentation extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      issuer: "",
      name: "",
    };
  }

  async componentDidMount() {
    const { credential } = this.props;
    const issuer = await getIssuer(credential);
    const name = await transform.modifyName(
      credential.name,
      "credential",
      credential.did
    );
    this.setState({
      issuer,
      name,
    });
  }

  render() {
    const { credential, methodToSelect, defaultChecked } = this.props;
    const { issuer, name } = this.state;
    return (
      <label htmlFor={credential.id}>
        <article
          className={`${styles.credentialItem} ecl-card`}
          key={credential.id}
        >
          <div className={`${styles.checkbox} ecl-checkbox`}>
            <input
              className="ecl-checkbox__input"
              id={credential.id}
              name={credential.id}
              type="checkbox"
              defaultChecked={defaultChecked}
              onChange={() =>
                methodToSelect(credential.hash, credential.type as string[])
              }
            />
            <div className="ecl-checkbox__label">
              <span className="ecl-checkbox__box">
                <svg
                  focusable="false"
                  aria-hidden="true"
                  className="ecl-checkbox__icon ecl-icon ecl-icon--s"
                >
                  <use xlinkHref={`${eclIcons}#ui--check`} />
                </svg>
              </span>
            </div>
          </div>
          <header className="ecl-card__header">
            <h1 className="ecl-card__title">
              <img
                src={diplomaImage}
                height="32"
                width="32"
                className="rounded mr-2"
                alt=""
              />{" "}
              {name}
            </h1>
          </header>
          <div className="ecl-card__body">
            <div className="ecl-card__description">Issued by: {issuer}</div>
          </div>
        </article>
      </label>
    );
  }
}

export default CredentialItemPresentation;
