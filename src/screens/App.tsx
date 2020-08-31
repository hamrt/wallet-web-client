import React from "react";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import Login from "./Login/Login";
import Profile from "./Profile/Profile";
import DidAuth from "./DidAuth/DidAuth";
import Credentials from "./Credentials/Credentials";
import Notifications from "./Notifications/Notifications";
import Presentations from "./Presentations/Presentations";
import Terms from "./Terms/Terms";
import TermsConditions from "./TermsConditions/TermsConditions";
import REQUIRED_VARIABLES from "../config/env";

const publicUrl = REQUIRED_VARIABLES.REACT_APP_WALLET;
const basename = publicUrl.startsWith("http")
  ? new URL(publicUrl).pathname
  : publicUrl;

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route exact path="/terms" component={TermsConditions} />
        <Route exact path="/termsAndConditions">
          <Redirect to="/terms" />
        </Route>
        <Route path="*">
          <Terms>
            <Login>
              <Switch>
                <Route path="/auth" component={DidAuth} />
                <Route path="/profile" component={Profile} />
                <Route path="/notifications" component={Notifications} />
                <Route path="/presentations" component={Presentations} />
                <Route path="/credentials" component={Credentials} />
                <Route path="*">
                  <Redirect to="/profile" />
                </Route>
              </Switch>
            </Login>
          </Terms>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
