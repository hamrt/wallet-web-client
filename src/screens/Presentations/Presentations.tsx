import React, { Component } from "react";
import "./Presentations.css";
import { Button, ListGroup } from "react-bootstrap";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import ToastEbsi from "../../components/ToastEbsi/ToastEbsi";
import EbsiBanner from "../../components/EbsiBanner/EbsiBanner";
import CredentialItem from "../../components/CredentialItem/CredentialItem";
import CredentialModal from "../../components/CredentialModal/CredentialModal";
import colors from "../../config/colors";
import { connectionNotEstablished, getJWT } from "../../utils/DataStorage";
import { isTokenExpired } from "../../utils/JWTHandler";
import { loginLink } from "../../apis/ecas";
import { strB64dec } from "../../utils/strB64dec";

import REQUIRED_VARIABLES from "../../config/env";
import { IAttribute } from "../../dtos/attributes";

const DEMO = REQUIRED_VARIABLES.REACT_APP_DEMO;

type Props = {
  history: any;
  location: any;
};

type State = {
  credentials: JSX.Element[];
  credential: IAttribute;
  isToastOpen: boolean;
  toastColor: string;
  isModalCredentialOpen: boolean;
  toastMessage: string;
  isLoadingOpen: boolean;
  isTourOpen: boolean;
};

class Presentations extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      credentials: [],
      credential: models.credential,
      isToastOpen: false,
      toastColor: colors.EC_GREEN,
      isModalCredentialOpen: false,
      toastMessage: "Error",
      isLoadingOpen: false,
      isTourOpen: false,
    };
    this.displayCredential = this.displayCredential.bind(this);
    this.closeModalCredential = this.closeModalCredential.bind(this);
  }

  componentDidMount() {
    if (connectionNotEstablished()) {
      this.redirectTo("");
    } else if (isTokenExpired(getJWT() || "")) {
      window.location.assign(loginLink());
    }
    this.getCredentials();
  }

  async getCredentials() {
    const context = this;
    const response = await idHub.getCredentials();
    if (response.status === 200 || response.status === 201) {
      const outAttrs = response.data.items as IAttribute[];
      const credentials = outAttrs
        .filter((attr) => attr.name === "VerifiablePresentation")
        .map((attrTemp) => (
          <CredentialItem
            credential={attrTemp}
            key={attrTemp.id}
            methodToOpen={context.displayCredential}
          />
        ));

      this.setState({
        credentials,
      });
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }
      this.openToast(`Error getting the credentials. ${response.data}`);
    }
  }

  disableBody = (target: HTMLDivElement) => {
    disableBodyScroll(target);
  };

  enableBody = (target: HTMLDivElement) => {
    enableBodyScroll(target);
  };

  openTour = () => {
    this.setState({
      isTourOpen: true,
    });
  };

  closeTour = () => {
    this.setState({
      isTourOpen: false,
    });
  };

  async displayCredential(hash: string) {
    const response = await idHub.getCredential(hash);
    if (response.status === 200 || response.status === 201) {
      this.openModalCredential(response.data);
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }
      this.openToast(`Error getting the credential. ${response.data}`);
    }
  }

  openModalCredential(credential: IAttribute) {
    const credentialToOpen = credential;
    credentialToOpen.dataDecoded = strB64dec(credential.data.base64);
    this.setState({
      isModalCredentialOpen: true,
      credential: credentialToOpen,
    });
  }

  closeModalCredential() {
    this.setState({
      isModalCredentialOpen: false,
    });
  }

  redirectTo(whereRedirect: string) {
    const { history } = this.props;
    history.push(`/${whereRedirect}`);
  }

  openToast(message: string) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      isLoadingOpen: false,
      toastColor: colors.EC_RED,
    });
  }

  openSuccessToast(message: string) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      toastColor: colors.EC_GREEN,
      isLoadingOpen: false,
    });
  }

  closeToast() {
    this.setState({
      isToastOpen: false,
    });
  }

  render() {
    const {
      credentials,
      credential,
      isToastOpen,
      isModalCredentialOpen,
      toastColor,
      toastMessage,
      isTourOpen,
      isLoadingOpen,
    } = this.state;

    return (
      <div className="credentials-container">
        <Header />

        <ToastEbsi
          isToastOpen={isToastOpen}
          methodToClose={this.closeToast}
          toastColor={toastColor}
          colorText={colors.WHITE}
          toastMessage={toastMessage}
        />

        <EbsiBanner
          title="Presentations Page"
          subtitle="List of your presentations history."
          isLoadingOpen={isLoadingOpen}
        />
        <div className="table-container">
          <CredentialModal
            credential={credential}
            isModalCredentialOpen={isModalCredentialOpen}
            methodToClose={this.closeModalCredential}
          />
          {credentials.length === 0 && (
            <p>
              You don&#8217;t have any presentation at the moment. Follow the{" "}
              <a href={DEMO}> demonstrator</a> to create some.
            </p>
          )}
          <ListGroup
            className="list-credentials"
            data-tut="reactour_presentations"
          >
            {credentials}
          </ListGroup>
          <Button
            onClick={this.openTour}
            className="tourButton"
            title="Open guided tour"
          >
            ?
          </Button>
        </div>
        <Footer />
        <Tour
          steps={tour.stepsPresentations}
          isOpen={isTourOpen}
          onRequestClose={this.closeTour}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />
      </div>
    );
  }
}

export default Presentations;
