/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import eclIcons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import SecureEnclave from "../../../secureEnclave/SecureEnclave";
import { strB64dec } from "../../../utils/strB64dec";
import { storeKeys, storeDID } from "../../../utils/DataStorage";
import * as keysManager from "../../../utils/KeysHandler";

type Props = {
  verifyTicket: (password: string) => Promise<void>;
  goToChooseMethodScreen: () => void;
};

export const ImportWallet = ({
  verifyTicket,
  goToChooseMethodScreen,
}: Props) => {
  const { register, handleSubmit, errors } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const uploadDocument = async (data: any) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationError("");

    try {
      const dataInBase64 = await keysManager.importKeys(data.keystore[0]);
      const keys = strB64dec(dataInBase64);

      const did = await SecureEnclave.Instance.restoreWallet({
        encryptedKey: keys,
        password: data.passwordForKeyGeneration,
      });

      storeKeys(keys);
      storeDID(did);

      await verifyTicket(data.passwordForKeyGeneration);
    } catch (e) {
      setGenerationError(e.toString());
      setIsGenerating(false);
    }
  };

  return (
    <div className="ecl-u-bg-blue-130 ecl-u-flex-grow-1">
      <main className="ecl-container ecl-u-bg-white ecl-u-pa-xl ecl-u-mt-xl">
        <h1 className="ecl-u-type-heading-1">Import an existing wallet</h1>
        <form onSubmit={handleSubmit(uploadDocument)}>
          <div className="ecl-form-group no-js">
            <label className="ecl-form-label" htmlFor="keystore">
              Keystore file
            </label>
            <div className="ecl-help-block">
              This is the JSON file you have exported.
              <div className="ecl-u-mt-xs ecl-u-type-color-grey-75">
                Only <strong>.json</strong> files are accepted.
              </div>
            </div>
            {errors.keystore && (
              <div className="ecl-feedback-message">
                {errors.keystore.message || "Invalid keystore!"}
              </div>
            )}
            <input
              id="keystore"
              name="keystore"
              type="file"
              className="ecl-file-upload"
              ref={register({
                required: "Keystore is required",
              })}
            />
          </div>
          <div className="ecl-form-group ecl-u-mt-m">
            <label className="ecl-form-label" htmlFor="password-key-gen">
              Password
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
            {isGenerating ? "Importing wallet..." : "Import wallet"}
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

export default ImportWallet;
