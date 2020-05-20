import React from "react";
import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import Login from "./Login/Login";
import Profile from "./Profile/Profile";
import DidAuth from "./DidAuth/DidAuth";
import Credentials from "./Credentials/Credentials";
import Notifications from "./Notifications/Notifications";
import Presentations from "./Presentations/Presentations";
import Terms from "./Terms/Terms";
import TermsConditions from "./TermsConditions/TermsConditions";
import { REACT_APP_WALLET } from "../config/env";

const publicUrl = REACT_APP_WALLET;
const basename = publicUrl ? new URL(publicUrl).pathname : "";

function App() {
  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <BrowserRouter basename={basename}>
              <Switch>
                <Route exact path="/" component={Terms} />
                <Route
                  exact
                  path="/termsAndConditions"
                  component={TermsConditions}
                />
                <Route exact path="/login" component={Login} />
                <Route path="/auth" component={DidAuth} />
                <Route path="/profile" component={Profile} />
                <Route path="/notifications" component={Notifications} />
                <Route path="/presentations" component={Presentations} />
                <Route path="/credentials" component={Credentials} />
              </Switch>
            </BrowserRouter>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
