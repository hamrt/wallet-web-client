/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { setUpKeys } from "../Login.utils";

type Props = {
  verifyTicket: (password: string) => Promise<void>;
  goToChooseMethodScreen: (data: any) => void;
};

export const NewWallet = ({ verifyTicket, goToChooseMethodScreen }: Props) => {
  const { register, watch, handleSubmit, errors } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const onSubmitNewPass = async (data: any) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationError("");

    try {
      const userPassword = data.passwordForKeyGeneration;
      if (!userPassword) throw new Error("No password provided");

      await setUpKeys(userPassword);
      await verifyTicket(userPassword);
    } catch (error) {
      setGenerationError(error.toString());
      setIsGenerating(false);
    }
  };

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
          Please note that if you will not be able to recover your wallet unless
          you download your keys. Note that clicking on &ldquo;Restart User
          Journey&rdquo; will delete your access to your current wallet.
        </p>
        <form onSubmit={handleSubmit(onSubmitNewPass)}>
          <div className="ecl-form-group">
            <label className="ecl-form-label" htmlFor="password-key-gen">
              Please enter your password:
            </label>
            {errors.passwordForKeyGeneration && (
              <div className="ecl-feedback-message">
                {errors.passwordForKeyGeneration.message || "Invalid password!"}
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
            className="ecl-button ecl-button--primary ecl-u-mt-l ecl-u-mr-m"
            type="submit"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
          <button
            className="ecl-button ecl-button--ghost ecl-u-mt-l"
            type="button"
            onClick={goToChooseMethodScreen}
          >
            Choose another method
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
};

export default NewWallet;
