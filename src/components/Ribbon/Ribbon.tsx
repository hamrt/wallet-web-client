import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Ribbon.css";
import REQUIRED_VARIABLES from "../../config/env";

const DEMONSTRATOR_URL = REQUIRED_VARIABLES.REACT_APP_DEMO;

export const Ribbon: React.FunctionComponent = () => (
  <>
    <Container>
      <Row>
        <Col className="col" />
      </Row>
    </Container>
    <div className="ribbon" data-tut="reactour_header">
      <a className="ribbonText" href={DEMONSTRATOR_URL}>
        EBSI DEMO
      </a>
    </div>
  </>
);
export default Ribbon;
