import React from "react";
import "./Panel.css";

import { loginLink } from "../../apis/ecas";

type TitleProps = {
  children: React.ReactNode;
};
export const PanelTitle = ({ children }: TitleProps) => (
  <div className="panelTitle">{children}</div>
);

type BodyProps = {
  icon: string;
  title?: React.ReactNode;
  linkLabel?: React.ReactNode;
  children: React.ReactNode;
};

export const PanelBody = ({ icon, title, linkLabel, children }: BodyProps) => (
  <div className="panelBody">
    <div className="panelImageContainer">
      <img src={icon} alt="" role="presentation" className="panelImage" />
    </div>
    <div className="panelMainContent">
      <h3 className="panelBodyTitle">{title}</h3>
      <p className="panelBodyText">{children}</p>
    </div>
    <div
      className="panelButtonContainer"
      role="button"
      tabIndex={0}
      onClick={() => loginLink()}
      onKeyDown={() => loginLink()}
    >
      <a className="panelLink" role="button" href={loginLink()}>
        {linkLabel}
      </a>
    </div>
  </div>
);

export const Panel = ({ children }: TitleProps) => <div>{children}</div>;
