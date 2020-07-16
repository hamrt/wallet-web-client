import url from "url";
import REACT_APP_EULOGIN from "../config/env";

const options = {
  cas_url: REACT_APP_EULOGIN.REACT_APP_EULOGIN,
  service_url: REACT_APP_EULOGIN.REACT_APP_WALLET,
  cas_version: "3.0",
  session_name: "ecas_session",
  session_info: "ecas_session_info",
  destroy_session: true,
  renew: false,
};
/**
 * @typedef {Object} CAS_options
 * @property {string}  cas_url
 * @property {string}  service_url
 * @property {('1.0'|'2.0'|'3.0')} [cas_version='3.0']
 * @property {boolean} [renew=false]
 * @property {boolean} [is_dev_mode=false]
 * @property {string}  [dev_mode_user='']
 * @property {Object}  [dev_mode_info={}]
 * @property {string}  [session_name='cas_user']
 * @property {string}  [session_info=false]
 * @property {boolean} [destroy_session=false]
 */
class Ecas {
  constructor() {
    if (!options || typeof options !== "object") {
      throw new Error(
        "CAS Authentication was not given a valid configuration object."
      );
    }
    if (options.cas_url === undefined) {
      throw new Error("CAS Authentication requires a cas_url parameter.");
    }
    if (options.service_url === undefined) {
      throw new Error("CAS Authentication requires a service_url parameter.");
    }
  }

  loginLink = (): string => {
    const query = {
      service: `${options.service_url}/credentials`,
      renew: options.renew !== undefined ? !!options.renew : false,
    };
    const urlLogin =
      options.cas_url + url.format({ pathname: "/login", query });
    return urlLogin;
  };

  logout = (): void => {
    const query = {
      service: options.service_url,
      renew: options.renew !== undefined ? !!options.renew : false,
    };
    window.location.assign(
      options.cas_url +
        url.format({
          pathname: "/logout",
          query,
        })
    );
  };
}
export const { loginLink, logout } = new Ecas();
