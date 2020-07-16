import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import "./CredentialItem.css";
import colors from "../../config/colors";
import * as transform from "../../utils/StringTransformation";
import { getIssuer } from "../../utils/issuer";
import logoDiploma from "../../assets/images/diploma.png";
import { IAttribute } from "../../dtos/attributes";

type CallbackFunctionOpen = (hash: string, ...args: any[]) => void;

type Props = {
  credential: IAttribute;
  methodToOpen: CallbackFunctionOpen;
};

type State = {
  issuer: string;
  name: string;
};

class CredentialItem extends Component<Props, State> {
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
    const { credential, methodToOpen } = this.props;
    const { issuer, name } = this.state;
    return (
      <ListGroup.Item
        className="credential"
        action
        onClick={() => methodToOpen(credential.hash)}
        key={credential.id}
        style={{ backgroundColor: colors.EC_BLUE }}
      >
        <img
          src={logoDiploma}
          height="32"
          width="32"
          className="logo rounded mr-2"
          alt=""
        />
        <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
          <b>{name}</b>
        </p>
        <p style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}>
          Issued By: {issuer}{" "}
        </p>
      </ListGroup.Item>
    );
  }
}

export default CredentialItem;
