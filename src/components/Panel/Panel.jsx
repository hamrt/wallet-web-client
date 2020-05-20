import React from "react";
import "./Panel.css";
import PropTypes from "prop-types";

import { loginLink } from "../../apis/ecas";

export const PanelTitle = ({ children }) => (
  <div className="panelTitle">{children}</div>
);
PanelTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export const PanelBody = ({ icon, title, linkLabel, children }) => (
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
PanelBody.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node,
  linkLabel: PropTypes.node,
  children: PropTypes.node.isRequired,
};

PanelBody.defaultProps = {
  icon: "",
  title: "",
  linkLabel: "",
};

export const Panel = ({ children }) => <div>{children}</div>;
Panel.propTypes = {
  children: PropTypes.node.isRequired,
};
