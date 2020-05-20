import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Ribbon.css";
import { REACT_APP_DEMO } from "../../config/env";

const DEMONSTRATOR_URL = REACT_APP_DEMO;

class Ribbon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
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
  }
}
export default Ribbon;
