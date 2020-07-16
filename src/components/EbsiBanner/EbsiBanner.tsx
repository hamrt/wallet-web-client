import React from "react";
import { Jumbotron, Container, Spinner, Button } from "react-bootstrap";
import "./EbsiBanner.css";
import colors from "../../config/colors";

type CallbackFunction = () => void;

type Props = {
  title: string;
  subtitle: string;
  shouldAskToDecryptKey?: boolean;
  openModalAskingPass?: CallbackFunction;
  isLoadingOpen: boolean;
};

const EbsiBanner = ({
  title,
  subtitle,
  shouldAskToDecryptKey,
  openModalAskingPass,
  isLoadingOpen,
}: Props) => (
  <Jumbotron className="jumbotron" style={{ backgroundColor: colors.EC_BLUE }}>
    <Container style={{ color: colors.WHITE }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {shouldAskToDecryptKey && (
        <Button variant="danger" size="lg" block onClick={openModalAskingPass}>
          You still have to insert your password to decrypt the keys.
        </Button>
      )}
      <br />
      {isLoadingOpen && (
        <Spinner animation="border" role="status" variant="danger">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
    </Container>
  </Jumbotron>
);
export default EbsiBanner;
