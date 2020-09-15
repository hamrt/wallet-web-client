import React from "react";
import "./Panel.css";

import { loginLink } from "../../apis/ecas";

type TitleProps = {
  children: React.ReactNode;
};

export const PanelTitle: React.FunctionComponent<TitleProps> = ({
  children,
}: TitleProps) => <div className="panelTitle">{children}</div>;

type BodyProps = {
  icon: string;
  title?: React.ReactNode;
  linkLabel?: React.ReactNode;
  children: React.ReactNode;
};

export const PanelBody: React.FunctionComponent<BodyProps> = ({
  icon,
  title,
  linkLabel,
  children,
}: BodyProps) => (
  <div className="panelBody">
    <div className="panelImageContainer">
      <img src={icon} alt="" role="presentation" className="panelImage" />
    </div>
    <div className="panelMainContent">
      {title && <h3 className="panelBodyTitle">{title}</h3>}
      <p className="panelBodyText">{children}</p>
    </div>
    <div className="panelButtonContainer">
      <a
        className="panelLink ecl-button ecl-button--call"
        role="button"
        href={loginLink()}
      >
        {linkLabel}
      </a>
    </div>
  </div>
);

PanelBody.defaultProps = {
  title: "",
  linkLabel: "",
} as Partial<BodyProps>;

export const Panel: React.FunctionComponent<TitleProps> = ({
  children,
}: TitleProps) => <>{children}</>;
