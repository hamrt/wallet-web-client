import React from "react";
import { ListGroup, Form } from "react-bootstrap";
import "./CredentialItemPresentation.css";
import colors from "../../config/colors";
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
    const { credential, methodToSelect } = this.props;
    const { issuer, name } = this.state;
    return (
      <ListGroup.Item
        className="credential ecl-card ecl-card--title"
        key={credential.id}
        style={{ backgroundColor: colors.EC_BLUE }}
      >
        <img
          src={diplomaImage}
          height="32"
          width="32"
          className="logo rounded mr-2"
          alt=""
        />
        <div>
          <p style={{ color: colors.WHITE, wordWrap: "break-word" }}>
            <b>{name}</b>
          </p>
          <p
            className="credential-text"
            style={{ color: colors.EC_YELLOW, wordWrap: "break-word" }}
          >
            Issued by: {issuer}
          </p>
        </div>
        <div key="checkbox" className="checkbox mb-3">
          <Form.Check
            onChange={() =>
              methodToSelect(credential.hash, credential.type as string[])
            }
            style={{ color: colors.EC_YELLOW }}
            type="checkbox"
            id={credential.id}
          />
        </div>
      </ListGroup.Item>
    );
  }
}

export default CredentialItemPresentation;
