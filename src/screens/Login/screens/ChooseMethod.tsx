/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { keysNotExist } from "../../../utils/DataStorage";

type Props = {
  goToLocalStorageWalletScreen: () => void;
  goToNewWalletScreen: () => void;
  goToImportWalletScreen: () => void;
};

export const ChooseMethod = ({
  goToLocalStorageWalletScreen,
  goToNewWalletScreen,
  goToImportWalletScreen,
}: Props) => {
  const hasLocalWallet = !keysNotExist();

  return (
    <div className="ecl-u-bg-blue-130 ecl-u-flex-grow-1">
      <main className="ecl-container ecl-u-bg-white ecl-u-pa-xl ecl-u-mt-xl">
        <h1 className="ecl-u-type-heading-1">
          Welcome{hasLocalWallet && " back"} on EBSI Wallet!
        </h1>
        {hasLocalWallet ? (
          <>
            <p className="ecl-u-type-paragraph">
              We&apos;ve detected that you already have a wallet on this
              browser.
            </p>
            <button
              type="button"
              onClick={goToLocalStorageWalletScreen}
              className="ecl-button ecl-button--primary ecl-u-mt-s ecl-u-mr-m"
            >
              Use your existing wallet
            </button>
            <p className="ecl-u-type-paragraph ecl-u-mt-xl">
              You can also decide to create a new wallet or to import an
              existing one:
            </p>
          </>
        ) : (
          <p className="ecl-u-type-paragraph">
            To get started, create a new wallet or import an existing one:
          </p>
        )}
        <button
          type="button"
          onClick={goToNewWalletScreen}
          className={`ecl-button ecl-button--${
            !hasLocalWallet ? "primary" : "secondary"
          } ecl-u-mt-s ecl-u-mr-m`}
        >
          Create a new wallet
        </button>
        <button
          type="button"
          onClick={goToImportWalletScreen}
          className={`ecl-button ecl-button--${
            !hasLocalWallet ? "primary" : "secondary"
          } ecl-u-mt-s ecl-u-mr-m`}
        >
          Import an existing wallet
        </button>
      </main>
    </div>
  );
};

export default ChooseMethod;
