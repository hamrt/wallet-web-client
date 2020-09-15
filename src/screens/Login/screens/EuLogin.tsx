import React from "react";
import { Panel, PanelTitle, PanelBody } from "../../../components/Panel/Panel";
import step1SVG from "../../../assets/images/step1.svg";
import styles from "./EuLogin.module.css";

export const EuLogin = () => (
  <div className={styles.app}>
    <main className={styles.main}>
      <Panel>
        <PanelTitle>EBSI Wallet</PanelTitle>
        <PanelBody icon={step1SVG} linkLabel="Login">
          Authenticate via EU Login to access your EBSI Wallet.
        </PanelBody>
      </Panel>
    </main>
  </div>
);

export default EuLogin;
