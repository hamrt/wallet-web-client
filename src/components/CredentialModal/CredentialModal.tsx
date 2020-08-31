import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import JSONPretty from "react-json-pretty";
import "./CredentialModal.css";
import VID from "../CredentialTypes/VID/VID";
import Diploma from "../CredentialTypes/Diploma/Diploma";
import VP from "../CredentialTypes/VP/VP";
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

  openDetails = async () => {
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
  };

  closeDetails = () => {
    const { isFullCredentialDisplayed } = this.state;
    if (isFullCredentialDisplayed) {
      this.setState({
        isFullCredentialDisplayed: false,
        name: "",
      });
    }
  };

  render() {
    const { methodToClose, credential, isModalCredentialOpen } = this.props;
    const { isFullCredentialDisplayed, name } = this.state;
    return (
      <Modal show={isModalCredentialOpen} onHide={methodToClose} size="lg">
        <Modal.Header className="ModalHeader" closeButton>
          <Modal.Title className="ModalTitleCredential">{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isFullCredentialDisplayed && isModalCredentialOpen && (
            <>
              {credential.name === "Verifiable ID" && (
                <VID data={credential.dataDecoded} />
              )}
              {credential.name === "VerifiablePresentation" && <VP />}
              {(credential.name === '["Europass Diploma"]' ||
                credential.name === "Europass Diploma") && (
                <Diploma data={credential.dataDecoded} />
              )}
            </>
          )}
          {isFullCredentialDisplayed && (
            <JSONPretty id="json-pretty-store" data={credential.dataDecoded} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="ecl-button ecl-button--ghost"
            type="button"
            onClick={methodToClose}
          >
            Close
          </button>
          {!isFullCredentialDisplayed ? (
            <button
              className="ecl-button ecl-button--primary"
              type="button"
              onClick={this.openDetails}
            >
              Open Details
            </button>
          ) : (
            <button
              className="ecl-button ecl-button--primary"
              type="button"
              onClick={this.closeDetails}
            >
              Close Details
            </button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CredentialModal;
