/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import {
  connectionNotEstablished,
  getJWT,
  keysNotExist,
} from "../../utils/DataStorage";
import { isTokenExpired } from "../../utils/JWTHandler";
import REQUIRED_VARIABLES from "../../config/env";
import { handleTicket } from "./Login.utils";
import {
  ChooseMethod,
  EuLogin,
  ImportWallet,
  LocalStorageWallet,
  NewWallet,
} from "./screens";

type Props = {
  children: React.ReactNode;
};

export enum Screen {
  BLANK,
  EU_LOGIN,
  CHOOSE_METHOD,
  LOCAL_STORAGE,
  NEW_WALLET,
  IMPORT_WALLET,
}

const publicUrl = REQUIRED_VARIABLES.REACT_APP_WALLET;
const basename = publicUrl.startsWith("http")
  ? new URL(publicUrl).pathname
  : publicUrl;

export const Login: React.FunctionComponent<Props> = ({ children }: Props) => {
  const location = useLocation();
  const history = useHistory();
  const [ticket, setTicket] = useState("");
  const [screen, setScreen] = useState<Screen>(Screen.BLANK);

  const isConnected =
    !connectionNotEstablished() && !isTokenExpired(getJWT()) && !keysNotExist();

  useEffect(() => {
    if (!isConnected && !ticket) {
      // Return to EU Login screen whenever the user is disconnected (e.g. token has expired) and
      // the user is currently not logging in (no ticket)
      setScreen(Screen.EU_LOGIN);
    }
  }, [isConnected, ticket]);

  useEffect(() => {
    const ticketFromUrl = queryString.parse(location.search).ticket;
    if (ticketFromUrl) {
      setTicket(
        Array.isArray(ticketFromUrl) ? ticketFromUrl[0] : ticketFromUrl
      );

      setScreen(Screen.CHOOSE_METHOD);

      if (sessionStorage.getItem("urlBeforeLogin")) {
        const url = new URL(sessionStorage.getItem("urlBeforeLogin") || "");
        sessionStorage.removeItem("urlBeforeLogin");
        let pathname;
        if (url.pathname.indexOf(basename) === 0) {
          pathname = url.pathname.slice(basename.length);
        } else {
          pathname = url.pathname;
        }
        history.replace(pathname + url.search);
      } else {
        const params = new URLSearchParams(location.search);
        params.delete("ticket");
        history.replace({ ...location, search: params.toString() });
      }
    }
    // Run useEffect only on component first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyTicket = async (userPassword: string) => {
    await handleTicket(ticket, userPassword);
    setTicket("");
  };

  if (isConnected) {
    return <>{children}</>;
  }

  const goToLocalStorageWalletScreen = () => setScreen(Screen.LOCAL_STORAGE);
  const goToNewWalletScreen = () => setScreen(Screen.NEW_WALLET);
  const goToImportWalletScreen = () => setScreen(Screen.IMPORT_WALLET);
  const goToChooseMethodScreen = () => setScreen(Screen.CHOOSE_METHOD);

  if (screen === Screen.CHOOSE_METHOD) {
    return (
      <ChooseMethod
        goToLocalStorageWalletScreen={goToLocalStorageWalletScreen}
        goToNewWalletScreen={goToNewWalletScreen}
        goToImportWalletScreen={goToImportWalletScreen}
      />
    );
  }

  if (screen === Screen.LOCAL_STORAGE) {
    return (
      <LocalStorageWallet
        verifyTicket={verifyTicket}
        goToChooseMethodScreen={goToChooseMethodScreen}
      />
    );
  }

  if (screen === Screen.NEW_WALLET) {
    return (
      <NewWallet
        verifyTicket={verifyTicket}
        goToChooseMethodScreen={goToChooseMethodScreen}
      />
    );
  }

  if (screen === Screen.IMPORT_WALLET) {
    return (
      <ImportWallet
        verifyTicket={verifyTicket}
        goToChooseMethodScreen={goToChooseMethodScreen}
      />
    );
  }

  if (screen === Screen.EU_LOGIN) {
    return <EuLogin />;
  }

  // Blue screen
  return <div className="ecl-u-bg-blue-130 ecl-u-flex-grow-1" />;
};

export default Login;
