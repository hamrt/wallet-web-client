import React, { Component } from "react";
import "./Credentials.css";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import Header from "../../components/Header/Header";
import EbsiBanner from "../../components/EbsiBanner/EbsiBanner";
import Footer from "../../components/Footer/Footer";
import CredentialItem from "../../components/CredentialItem/CredentialItem";
import ToastEbsi from "../../components/ToastEbsi/ToastEbsi";
import CredentialModal from "../../components/CredentialModal/CredentialModal";
import colors from "../../config/colors";
import { getJWT, connectionNotEstablished } from "../../utils/DataStorage";
import { strB64dec } from "../../utils/strB64dec";
import { isTokenExpired } from "../../utils/JWTHandler";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import REQUIRED_VARIABLES from "../../config/env";
import { loginLink } from "../../apis/ecas";
import { IAttribute } from "../../dtos/attributes";

const DEMO = REQUIRED_VARIABLES.REACT_APP_DEMO;

export enum CredentialsStatus {
  Loading,
  Success,
  Error,
}

type Props = {
  history: any;
  location: any;
};

type State = {
  credentials: JSX.Element[];
  credentialsStatus: CredentialsStatus;
  credentialsError: string;
  credential: IAttribute;
  isModalCredentialOpen: boolean;
  isToastOpen: boolean;
  toastMessage: string;
  toastColor: string;
  isLoadingOpen: boolean;
  isTourOpen: boolean;
};

class Credentials extends Component<Props, State> {
  passwordForKeyGeneration: React.RefObject<HTMLInputElement>;

  constructor(props: Readonly<Props>) {
    super(props);

    this.passwordForKeyGeneration = React.createRef();

    this.state = {
      credentials: [],
      credentialsStatus: CredentialsStatus.Loading,
      credentialsError: "",
      credential: models.credential,
      isModalCredentialOpen: false,
      isToastOpen: false,
      toastMessage: "Error",
      toastColor: colors.EC_GREEN,
      isLoadingOpen: false,
      isTourOpen: false,
    };
    this.closeToast = this.closeToast.bind(this);
    this.closeCredentialModal = this.closeCredentialModal.bind(this);
    this.displayCredential = this.displayCredential.bind(this);
  }

  componentDidMount() {
    if (connectionNotEstablished()) {
      this.redirectTo("");
    } else if (isTokenExpired(getJWT())) {
      window.location.assign(loginLink());
    } else {
      this.getCredentials();
    }
  }

  async getCredentials() {
    this.startLoading();
    const context = this;
    const response = await idHub.getCredentials();
    if (response.status === 200 || response.status === 201) {
      const outAttrs = response.data.items as IAttribute[];
      const credentials = outAttrs
        .filter(
          (credential) =>
            Array.isArray(credential.type) &&
            credential.type.length > 0 &&
            credential.type.includes("VerifiableCredential")
        )
        .map((attrTemp) => (
          <CredentialItem
            credential={attrTemp}
            key={attrTemp.id}
            methodToOpen={context.displayCredential}
          />
        ));
      this.stopLoading();
      this.setState({
        isLoadingOpen: false,
        credentialsStatus: CredentialsStatus.Success,
        credentials,
      });
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }

      this.setState({
        isLoadingOpen: false,
        credentialsStatus: CredentialsStatus.Error,
        credentialsError: response.data,
      });
    }
  }

  closeTour = () => {
    this.setState({
      isTourOpen: false,
    });
  };

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

  async displayCredential(hash: string) {
    const response = await idHub.getCredential(hash);
    if (response.status === 200 || response.status === 201) {
      this.openCredentialModal(response.data);
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }
      this.openToast(`Error getting the credential. ${response.data}`);
    }
  }

  openCredentialModal(credential: IAttribute) {
    const credentialDecoded = credential;
    credentialDecoded.dataDecoded = strB64dec(credential.data.base64);
    this.setState({
      isModalCredentialOpen: true,
      credential: credentialDecoded,
    });
  }

  openSuccessToast() {
    this.setState({
      isToastOpen: true,
      toastMessage: "The key decryption was successful.",
      toastColor: colors.EC_GREEN,
    });
  }

  openToast(message: string) {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      isLoadingOpen: false,
      toastColor: colors.EC_RED,
    });
  }

  closeCredentialModal() {
    this.setState({
      isModalCredentialOpen: false,
    });
  }

  closeToast() {
    this.setState({
      isToastOpen: false,
    });
  }

  redirectTo(whereRedirect: string) {
    const { history } = this.props;
    history.push(`/${whereRedirect}`);
  }

  startLoading() {
    this.setState({
      isLoadingOpen: true,
    });
  }

  stopLoading() {
    this.setState({
      isLoadingOpen: false,
    });
  }

  render() {
    const {
      credentials,
      credentialsError,
      credentialsStatus,
      credential,
      isModalCredentialOpen,
      isLoadingOpen,
      isToastOpen,
      toastColor,
      toastMessage,
      isTourOpen,
    } = this.state;

    return (
      <>
        <Header />
        <ToastEbsi
          isToastOpen={isToastOpen}
          methodToClose={this.closeToast}
          toastColor={toastColor}
          colorText={colors.WHITE}
          toastMessage={toastMessage}
        />
        <EbsiBanner
          title="Credentials Page"
          subtitle="List of your credentials."
          isLoadingOpen={isLoadingOpen}
        />
        <main className="ecl-container ecl-u-flex-grow-1 ecl-u-mb-l">
          <CredentialModal
            credential={credential}
            isModalCredentialOpen={isModalCredentialOpen}
            methodToClose={this.closeCredentialModal}
          />
          {credentialsStatus === CredentialsStatus.Error && (
            <div
              role="alert"
              className="ecl-message ecl-message--error"
              data-ecl-message="true"
            >
              <svg
                focusable="false"
                aria-hidden="true"
                className="ecl-message__icon ecl-icon ecl-icon--l"
              >
                <use xlinkHref={`${eclIcons}#notifications--error`} />
              </svg>
              <div className="ecl-message__content">
                <div className="ecl-message__title">Error</div>
                <p className="ecl-message__description">{credentialsError}</p>
              </div>
            </div>
          )}
          {credentialsStatus === CredentialsStatus.Success &&
            credentials.length === 0 && (
              <p>
                You don&#8217;t have any credential at the moment. Follow the{" "}
                <a className="ecl-link" href={DEMO}>
                  demonstrator
                </a>{" "}
                to create some.
              </p>
            )}
          <div data-tut="reactour_credentials">{credentials}</div>
        </main>
        <Footer />
        <button
          onClick={this.openTour}
          className="ecl-button ecl-button--primary tourButton"
          type="button"
          title="Open guided tour"
        >
          ?
        </button>
        <Tour
          steps={tour.stepsCredentials}
          isOpen={isTourOpen}
          onRequestClose={this.closeTour}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />
      </>
    );
  }
}

export default Credentials;
