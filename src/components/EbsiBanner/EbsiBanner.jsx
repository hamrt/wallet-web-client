import React from "react";
import { Jumbotron, Container, Spinner, Button } from "react-bootstrap";
import "./EbsiBanner.css";
import PropTypes from "prop-types";
import colors from "../../config/colors";

const EbsiBanner = ({
  title,
  subtitle,
  shouldAskToDecryptKey,
  openModalAskingPass,
  isLoadingOpen,
}) => (
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
        <Spinner animation="border" role="status" variant="danger" size="lg">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
    </Container>
  </Jumbotron>
);
export default EbsiBanner;
EbsiBanner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  shouldAskToDecryptKey: PropTypes.bool,
  openModalAskingPass: PropTypes.func,
  isLoadingOpen: PropTypes.bool.isRequired,
};
EbsiBanner.defaultProps = {
  shouldAskToDecryptKey: false,
  openModalAskingPass: null,
};
