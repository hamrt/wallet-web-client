import React, { Component } from "react";
import "./Presentations.css";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tour from "reactour";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import * as tour from "../../utils/Tour";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import { ToastEbsi } from "../../components/ToastEbsi/ToastEbsi";
import { EbsiBanner } from "../../components/EbsiBanner/EbsiBanner";
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

export enum PresentationsStatus {
  Loading,
  Success,
  Error,
}

type Props = {
  history: any;
  location: any;
};

type State = {
  presentations: JSX.Element[];
  presentationsStatus: PresentationsStatus;
  presentationsError: string;
  credential: IAttribute;
  isToastOpen: boolean;
  toastColor: string;
  isModalCredentialOpen: boolean;
  toastMessage: string;
  isLoadingOpen: boolean;
  isTourOpen: boolean;
};

export class Presentations extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      presentations: [],
      presentationsStatus: PresentationsStatus.Loading,
      presentationsError: "",
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

  componentDidMount(): void {
    if (connectionNotEstablished()) {
      this.redirectTo("");
    } else if (isTokenExpired(getJWT())) {
      window.location.assign(loginLink());
    }
    this.getCredentials();
  }

  async getCredentials(): Promise<void> {
    const response = await idHub.getCredentials();
    if (response.status === 200 || response.status === 201) {
      const outAttrs = response.data.items as IAttribute[];
      const presentations = outAttrs
        .filter((attr) => attr.name === "VerifiablePresentation")
        .map((attrTemp) => (
          <CredentialItem
            credential={attrTemp}
            key={attrTemp.id}
            methodToOpen={this.displayCredential}
          />
        ));

      this.setState({
        isLoadingOpen: false,
        presentationsStatus: PresentationsStatus.Success,
        presentations,
      });
    } else {
      if (response.status === 404) {
        this.openToast("Token invalid.");
        this.redirectTo("");
      }

      this.setState({
        isLoadingOpen: false,
        presentationsStatus: PresentationsStatus.Error,
        presentationsError: `Error getting the presentations: ${response.data}`,
      });
    }
  }

  disableBody = (target: HTMLDivElement): void => {
    disableBodyScroll(target);
  };

  enableBody = (target: HTMLDivElement): void => {
    enableBodyScroll(target);
  };

  openTour = (): void => {
    this.setState({
      isTourOpen: true,
    });
  };

  closeTour = (): void => {
    this.setState({
      isTourOpen: false,
    });
  };

  async displayCredential(hash: string): Promise<void> {
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

  openModalCredential(credential: IAttribute): void {
    const credentialToOpen = credential;
    credentialToOpen.dataDecoded = strB64dec(credential.data.base64);
    this.setState({
      isModalCredentialOpen: true,
      credential: credentialToOpen,
    });
  }

  closeModalCredential(): void {
    this.setState({
      isModalCredentialOpen: false,
    });
  }

  redirectTo(whereRedirect: string): void {
    const { history } = this.props;
    history.push(`/${whereRedirect}`);
  }

  openToast(message: string): void {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      isLoadingOpen: false,
      toastColor: colors.EC_RED,
    });
  }

  openSuccessToast(message: string): void {
    this.setState({
      isToastOpen: true,
      toastMessage: message,
      toastColor: colors.EC_GREEN,
      isLoadingOpen: false,
    });
  }

  closeToast(): void {
    this.setState({
      isToastOpen: false,
    });
  }

  render(): JSX.Element {
    const {
      presentations,
      presentationsStatus,
      presentationsError,
      credential,
      isToastOpen,
      isModalCredentialOpen,
      toastColor,
      toastMessage,
      isTourOpen,
      isLoadingOpen,
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
          title="Presentations Page"
          subtitle="List of your presentations history."
          isLoadingOpen={isLoadingOpen}
        />
        <main className="ecl-container ecl-u-flex-grow-1 ecl-u-mb-l">
          <CredentialModal
            credential={credential}
            isModalCredentialOpen={isModalCredentialOpen}
            methodToClose={this.closeModalCredential}
          />
          {presentationsStatus === PresentationsStatus.Error && (
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
                <p className="ecl-message__description">{presentationsError}</p>
              </div>
            </div>
          )}
          {presentationsStatus === PresentationsStatus.Success &&
            presentations.length === 0 && (
              <p>
                You don&#8217;t have any presentation at the moment. Follow the{" "}
                <a className="ecl-link" href={DEMO}>
                  demonstrator
                </a>{" "}
                to create some.
              </p>
            )}
          <div data-tut="reactour_presentations">{presentations}</div>
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
          steps={tour.stepsPresentations}
          isOpen={isTourOpen}
          onRequestClose={this.closeTour}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />
      </>
    );
  }
}

export default Presentations;
