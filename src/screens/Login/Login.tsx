import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Panel, PanelTitle, PanelBody } from "../../components/Panel/Panel";
import step1SVG from "../../assets/images/step1.svg";
import "./Login.css";
import { getTerms } from "../../utils/DataStorage";

type Props = {};

type State = {
  redirect: boolean;
};
class Login extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  componentDidMount() {
    this.redirectToTermsAndConditionsIfNotAccepted();
  }

  redirectToTermsAndConditionsIfNotAccepted() {
    if (!getTerms()) {
      this.setState({ redirect: true });
    }
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    }

    return (
      <div className="app">
        <main className="main">
          <Panel>
            <PanelTitle>EBSI Wallet</PanelTitle>
            <PanelBody icon={step1SVG} linkLabel="Login">
              Authenticate via EU Login to access your EBSI Wallet.
            </PanelBody>
          </Panel>
        </main>
      </div>
    );
  }
}
export default Login;
