/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import SecureEnclave from "../../../secureEnclave/SecureEnclave";
import { getKeys } from "../../../utils/DataStorage";

type Props = {
  verifyTicket: (password: string) => Promise<void>;
  goToChooseMethodScreen: () => void;
};

export const LocalStorageWallet = ({
  verifyTicket,
  goToChooseMethodScreen,
}: Props) => {
  const { register, handleSubmit, errors } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const onSubmitExistingPass = async (data: any) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationError("");

    try {
      const userPassword = data.passwordForKeyGeneration;
      if (!userPassword) throw new Error("No password provided");

      await SecureEnclave.Instance.restoreWallet({
        encryptedKey: getKeys() || "",
        password: userPassword,
      });
      await verifyTicket(userPassword);
    } catch (error) {
      setGenerationError(error.toString());
      setIsGenerating(false);
    }
  };

  return (
    <div className="ecl-u-bg-blue-130 ecl-u-flex-grow-1">
      <main className="ecl-container ecl-u-bg-white ecl-u-pa-xl ecl-u-mt-xl">
        <h1 className="ecl-u-type-heading-1">Open Wallet</h1>
        <p className="ecl-u-type-paragraph">
          The wallet will be loaded from your browser&apos;s local storage.
        </p>
        <form onSubmit={handleSubmit(onSubmitExistingPass)}>
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
          <button
            className="ecl-button ecl-button--primary ecl-u-mt-l ecl-u-mr-m"
            type="submit"
            disabled={isGenerating}
          >
            {isGenerating ? "Opening wallet..." : "Open wallet"}
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

export default LocalStorageWallet;
