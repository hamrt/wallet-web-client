import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import JSONPretty from "react-json-pretty";
import { TiArrowBack } from "react-icons/ti";
import "./CredentialModal.css";
import VID from "../CredentialTypes/VID/VID";
import Diploma from "../CredentialTypes/Diploma/Diploma";
import VP from "../CredentialTypes/VP/VP";
import colors from "../../config/colors";
import * as transform from "../../utils/StringTransformation";
import { IAttribute } from "../../dtos/attributes";

type CallbackFunction = () => void;

type Props = {
  credential: IAttribute;
  isModalCredentialOpen: boolean;
  methodToClose: CallbackFunction;
};

type State = {
  isFullCredentialDisplayed: boolean;
  name: string;
};

class CredentialModal extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      isFullCredentialDisplayed: false,
      name: "",
    };
  }

  async openDetails() {
    const { credential } = this.props;
    const name = await transform.modifyName(
      credential.name,
      "credential",
      credential.did
    );
    this.setState({
      isFullCredentialDisplayed: true,
      name,
    });
  }

  closeDetails() {
    const { isFullCredentialDisplayed } = this.state;
    if (isFullCredentialDisplayed) {
      this.setState({
        isFullCredentialDisplayed: false,
        name: "",
      });
    }
  }

  render() {
    const { methodToClose, credential, isModalCredentialOpen } = this.props;
    const { isFullCredentialDisplayed, name } = this.state;
    return (
      <Modal show={isModalCredentialOpen} onHide={methodToClose} size="lg">
        <Modal.Header
          className="ModalHeader"
          style={
            isFullCredentialDisplayed
              ? { backgroundColor: colors.EC_BLUE }
              : { backgroundColor: colors.EC_YELLOW }
          }
          closeButton
        >
          <TiArrowBack
            className="BackButton"
            style={
              isFullCredentialDisplayed
                ? { color: colors.WHITE }
                : { color: colors.EC_YELLOW }
            }
            onClick={() => this.closeDetails()}
          />
          <Modal.Title
            className="ModalTitleCredential"
            style={
              isFullCredentialDisplayed
                ? { color: colors.WHITE }
                : { color: colors.EC_BLUE }
            }
          >
            {name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="bodyDisplayCredential"
          style={
            isFullCredentialDisplayed
              ? { backgroundColor: colors.WHITE }
              : { backgroundColor: colors.EC_BLUE_BACK }
          }
        >
          {!isFullCredentialDisplayed && isModalCredentialOpen && (
            <div>
              {credential.name === "Verifiable ID" && (
                <div>
                  <VID data={credential.dataDecoded} />
                </div>
              )}
              {credential.name === "VerifiablePresentation" && (
                <div>
                  <VP />
                </div>
              )}
              {(credential.name === '["Europass Diploma"]' ||
                credential.name === "Europass Diploma") && (
                <div>
                  <Diploma data={credential.dataDecoded} />
                </div>
              )}
            </div>
          )}
          {isFullCredentialDisplayed && (
            <JSONPretty id="json-pretty-store" data={credential.dataDecoded} />
          )}
        </Modal.Body>
        <Modal.Footer
          style={
            isFullCredentialDisplayed
              ? { backgroundColor: colors.EC_BLUE }
              : { backgroundColor: colors.EC_YELLOW }
          }
        >
          {!isFullCredentialDisplayed && (
            <Button variant="primary" onClick={() => this.openDetails()}>
              Details
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CredentialModal;
