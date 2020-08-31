/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import queryString from "query-string";
import classNames from "classnames";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import { Panel, PanelTitle, PanelBody } from "../../components/Panel/Panel";
import {
  connectionNotEstablished,
  keysNotExist,
  getJWT,
  getKeys,
} from "../../utils/DataStorage";
import { isTokenExpired } from "../../utils/JWTHandler";
import REQUIRED_VARIABLES from "../../config/env";
import { setUpKeys, handleTicket } from "./Login.utils";
import step1SVG from "../../assets/images/step1.svg";
import "./Login.css";

type Props = {
  children: any;
};

const publicUrl = REQUIRED_VARIABLES.REACT_APP_WALLET;
const basename = publicUrl.startsWith("http")
  ? new URL(publicUrl).pathname
  : publicUrl;

function Login(props: Props) {
  const { children } = props;
  const location = useLocation();
  const history = useHistory();
  const [ticket, setTicket] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [isKeysGeneratorOpen, setIsKeysGeneratorOpen] = useState(false);
  const [isExistingPassOpen, setIsExistingPassOpen] = useState(false);
  const { register, watch, handleSubmit, errors } = useForm();

  if (!ticket) {
    const ticketFromUrl = queryString.parse(location.search).ticket;
    if (ticketFromUrl) {
      setTicket(
        Array.isArray(ticketFromUrl) ? ticketFromUrl[0] : ticketFromUrl
      );

      if (keysNotExist()) {
        setIsKeysGeneratorOpen(true);
      } else {
        setIsExistingPassOpen(true);
      }

      if (sessionStorage.getItem("urlBeforeLogin")) {
        const url = new URL(sessionStorage.getItem("urlBeforeLogin") || "");
        sessionStorage.removeItem("urlBeforeLogin");
        let pathname;
        if (url.pathname.indexOf(basename) === 0) {
          pathname = url.pathname.slice(basename.length);
        } else {
          pathname = url.pathname;
        }
        history.replace(pathname);
      } else {
        const params = new URLSearchParams(location.search);
        params.delete("ticket");
        history.replace({ ...location, search: params.toString() });
      }
    }
  }

  const onSubmitNewPass = async (data: any) => {
    setIsGenerating(true);
    setGenerationError("");
    try {
      const userPassword = data.passwordForKeyGeneration;
      if (!userPassword) throw new Error("No password provided");

      await setUpKeys(userPassword);
      await handleTicket(ticket, userPassword);
    } catch (error) {
      setGenerationError(error.toString());
    }

    setIsGenerating(false);
  };

  const onSubmitExistingPass = async (data: any) => {
    setIsGenerating(true);
    setGenerationError("");
    try {
      const userPassword = data.passwordForKeyGeneration;
      if (!userPassword) throw new Error("No password provided");

      await SecureEnclave.Instance.restoreWallet({
        encryptedKey: getKeys() || "",
        password: userPassword,
      });
      await handleTicket(ticket, userPassword);
    } catch (error) {
      setGenerationError(error.toString());
    }

    setIsGenerating(false);
  };

  if (!connectionNotEstablished() && !isTokenExpired(getJWT())) {
    return <>{children}</>;
  }

  if (isKeysGeneratorOpen) {
    return (
      <div className="ecl-u-bg-blue-130 ecl-u-flex-grow-1">
        <main className="ecl-container ecl-u-bg-white ecl-u-pa-xl ecl-u-mt-xl">
          <h1 className="ecl-u-type-heading-1">Generate Keys</h1>
          <h2 className="ecl-u-type-heading-2">
            Please type a password for the key generation.
          </h2>
          <p className="ecl-u-type-paragraph">
            Please keep this password, you will need it for signing credentials.
          </p>
          <p className="ecl-u-type-paragraph">
            Please note that if you will not be able to recover your wallet
            unless you download your keys. Note that clicking on &ldquo;Restart
            User Journey&rdquo; will delete your access to your current wallet.
          </p>
          <form onSubmit={handleSubmit(onSubmitNewPass)}>
            <div className="ecl-form-group">
              <label className="ecl-form-label" htmlFor="password-key-gen">
                Please enter your password:
              </label>
              {errors.passwordForKeyGeneration && (
                <div className="ecl-feedback-message">
                  {errors.passwordForKeyGeneration.message ||
                    "Invalid password!"}
                </div>
              )}
              <input
                type="password"
                id="password-key-gen"
                name="passwordForKeyGeneration"
                className={classNames("ecl-text-input ecl-text-input--m", {
                  "ecl-text-input--invalid": errors.passwordForKeyGeneration,
                })}
                placeholder="Password"
                ref={register({
                  required: "Password is required",
                })}
              />
            </div>
            <div className="ecl-form-group ecl-u-mt-m">
              <label className="ecl-form-label" htmlFor="password-confirm">
                Confirm your password:
              </label>
              {errors.confirmPassword && (
                <div className="ecl-feedback-message">
                  {errors.confirmPassword.message || "Invalid password!"}
                </div>
              )}
              <input
                type="password"
                id="password-confirm"
                name="confirmPassword"
                className={classNames("ecl-text-input ecl-text-input--m", {
                  "ecl-text-input--invalid": errors.confirmPassword,
                })}
                placeholder="Confirm password"
                ref={register({
                  required: "Password confirmation is required",
                  validate: (value) => {
                    return (
                      value === watch("passwordForKeyGeneration") ||
                      "Your password and confirmation password do not match."
                    );
                  },
                })}
              />
            </div>
            <button
              className="ecl-button ecl-button--primary ecl-u-mt-l"
              type="submit"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
            {generationError && (
              <div
                role="alert"
                className="ecl-message ecl-message--error ecl-u-mt-l"
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
                  <p className="ecl-message__description">{generationError}</p>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>
    );
  }

  if (isExistingPassOpen) {
    return (
      <div className="ecl-u-bg-blue-130 ecl-u-flex-grow-1">
        <main className="ecl-container ecl-u-bg-white ecl-u-pa-xl ecl-u-mt-xl">
          <h1 className="ecl-u-type-heading-1">Open Wallet</h1>
          <form onSubmit={handleSubmit(onSubmitExistingPass)}>
            <div className="ecl-form-group">
              <label className="ecl-form-label" htmlFor="password-key-gen">
                Please enter your password:
              </label>
              {errors.passwordForKeyGeneration && (
                <div className="ecl-feedback-message">
                  {errors.passwordForKeyGeneration.message ||
                    "Invalid password!"}
                </div>
              )}
              <input
                type="password"
                id="password-key-gen"
                name="passwordForKeyGeneration"
                className={classNames("ecl-text-input ecl-text-input--m", {
                  "ecl-text-input--invalid": errors.passwordForKeyGeneration,
                })}
                placeholder="Password"
                ref={register({
                  required: "Password is required",
                })}
              />
            </div>
            <button
              className="ecl-button ecl-button--primary ecl-u-mt-l"
              type="submit"
              disabled={isGenerating}
            >
              {isGenerating ? "Opening wallet..." : "Open wallet"}
            </button>
            {generationError && (
              <div
                role="alert"
                className="ecl-message ecl-message--error ecl-u-mt-l"
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
                  <p className="ecl-message__description">{generationError}</p>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>
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

export default Login;
