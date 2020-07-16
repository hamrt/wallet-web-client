import { loginLink, logout } from "./ecas";
import REACT_APP_EULOGIN from "../config/env";
import * as values from "../test/mocks/values";

describe("ecas api", () => {
  it("should return the EU login url", () => {
    expect.assertions(1);

    const urlLogin = loginLink();
    expect(urlLogin).toBe(
      `${REACT_APP_EULOGIN.REACT_APP_EULOGIN}/${values.loginURL}`
    );
  });

  it("should call the assign method with the url link in EU logout", () => {
    expect.assertions(1);
    const urlFormated = encodeURIComponent(REACT_APP_EULOGIN.REACT_APP_WALLET);
    jest.spyOn(window.location, "assign").mockImplementation();
    logout();
    expect(window.location.assign).toHaveBeenCalledWith(
      `${REACT_APP_EULOGIN.REACT_APP_EULOGIN}/logout?service=${urlFormated}&renew=false`
    );
  });
});
