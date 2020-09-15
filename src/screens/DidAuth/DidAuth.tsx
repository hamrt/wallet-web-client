/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import classNames from "classnames";
import { EbsiDidAuth, DidAuthRequestPayload } from "@cef-ebsi/did-auth";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { parseJwt } from "../../utils/JWTHandler";
import { Panel, PanelTitle } from "../../components/Panel/Panel";
import REQUIRED_VARIABLES from "../../config/env";
import step1SVG from "../../assets/images/step1.svg";
import styles from "./DidAuth.module.css";
import * as issuer from "../../utils/issuer";
import { createResponse, decryptKeys } from "./DidAuth.utils";

export const DidAuth: React.FunctionComponent = () => {
  const location = useLocation();
  const [serviceUrl, setServiceUrl] = useState("");
  const [serviceDID, setServiceDID] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [didAuthRequestJwt, setDidAuthRequestJwt] = useState("");
  const [isModalAskingForPass, setIsModalAskingForPass] = useState(false);
  const [verifyingDidAuth, setVerifyingDidAuth] = useState(false);
  const [authenticationError, setAuthenticationError] = useState("");
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setVerifyingDidAuth(true);

      const requestPayload: DidAuthRequestPayload = await EbsiDidAuth.verifyDidAuthRequest(
        didAuthRequestJwt,
        REQUIRED_VARIABLES.DID_API_IDENTIFIERS
      );

      await decryptKeys(data.didAuthPassword);
      createResponse(requestPayload.nonce, serviceUrl);
    } catch (error) {
      setVerifyingDidAuth(false);
      setAuthenticationError(error.message);
    }
  };

  const openModalAskingPass = () => {
    setIsModalAskingForPass(true);
    setAuthenticationError("");
  };

  const closeModalAskingPass = () => {
    setIsModalAskingForPass(false);
  };

  const didAuth = async (urlParameters: URLSearchParams) => {
    if (!urlParameters) throw new Error("No URL Parameters provided");

    const clientId = urlParameters.get("client_id");
    const didAuthRequest = urlParameters.get("request");
    if (!clientId || !didAuthRequest)
      throw new Error("Error parsing DIDAuth request");

    const token = parseJwt(didAuthRequest);
    if (!token.iss) throw new Error("No issuer found in DIDAuth request token");
    const issuerName = await issuer.getIssuerName(token.iss);

    setServiceDID(token.iss);
    setServiceUrl(clientId);
    setServiceName(issuerName);
    setDidAuthRequestJwt(didAuthRequest);
  };

  // ComponentDidMount
  useEffect(() => {
    async function componentDidMount() {
      const urlParameters = new URLSearchParams(location.search);
      try {
        await didAuth(urlParameters);
      } catch (error) {
        // do nothing
      }
    }
    componentDidMount();
  }, [location]);

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <Panel>
          <PanelTitle>Authorization</PanelTitle>
          <div className="panelBody">
            <div className="panelImageContainer">
              <img
                src={step1SVG}
                alt=""
                role="presentation"
                className="panelImage"
              />
            </div>
            <div className="panelMainContent">
              {serviceName === "-" && (
                <div>
                  <h3 className="panelBodyTitle">
                    Connect with the service with DID:
                  </h3>
                  <p
                    className="panelBodyText"
                    style={{ wordWrap: "break-word" }}
                  >
                    {serviceDID}
                  </p>
                </div>
              )}
              {serviceName !== "-" && (
                <h3 className="panelBodyTitle">
                  {serviceName} wants to connects you
                </h3>
              )}
              <p className="panelBodyText" style={{ wordWrap: "break-word" }}>
                {serviceUrl}
              </p>
            </div>
          </div>
          <div className={styles.panelFooter}>
            <button
              className="ecl-button ecl-button--call"
              type="button"
              onClick={openModalAskingPass}
            >
              Authorize
            </button>
          </div>
        </Panel>
      </main>
      <Modal show={isModalAskingForPass} onHide={closeModalAskingPass}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="ModalHeader" closeButton>
            <Modal.Title>Password</Modal.Title>
          </Modal.Header>
          <Modal.Body className="ModalBody">
            <div className="ecl-form-group">
              <label className="ecl-form-label" htmlFor="did-auth-password">
                Please type your password to authorize the connection.
              </label>
              {errors.didAuthPassword && (
                <div className="ecl-feedback-message">
                  {errors.didAuthPassword.message || "Invalid password!"}
                </div>
              )}
              <input
                type="password"
                id="did-auth-password"
                name="didAuthPassword"
                className={classNames("ecl-text-input ecl-u-width-100", {
                  "ecl-text-input--invalid": errors.didAuthPassword,
                })}
                placeholder="Password"
                ref={register({ required: true })}
              />
            </div>
            {authenticationError && (
              <div
                role="alert"
                className="ecl-message ecl-message--error ecl-u-mt-m"
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
                  <div className="ecl-message__title">
                    {authenticationError}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="ecl-button ecl-button--primary"
              disabled={verifyingDidAuth}
            >
              {verifyingDidAuth ? (
                <>
                  <svg
                    focusable="false"
                    aria-hidden="true"
                    className={classNames(
                      "ecl-icon ecl-icon--xs",
                      styles.spinner
                    )}
                  >
                    <use xlinkHref={`${eclIcons}#general--spinner`} />
                  </svg>{" "}
                  Checking...
                </>
              ) : (
                "Authorize"
              )}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};
export default DidAuth;
