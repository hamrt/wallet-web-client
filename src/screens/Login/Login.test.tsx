import React from "react";
import { Router, BrowserRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, fireEvent, act } from "@testing-library/react";
import Login from "./Login";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import * as DataStorage from "../../utils/DataStorage";
import * as JWTHandler from "../../utils/JWTHandler";
import * as LoginUtils from "./Login.utils";

describe("login", () => {
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it("should render without crashing", () => {
    expect.assertions(1);

    const { container } = render(
      <BrowserRouter>
        <Login>TestChildren</Login>
      </BrowserRouter>
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="app"
      >
        <main
          class="main"
        >
          <div>
            <div
              class="panelTitle"
            >
              EBSI Wallet
            </div>
            <div
              class="panelBody"
            >
              <div
                class="panelImageContainer"
              >
                <img
                  alt=""
                  class="panelImage"
                  role="presentation"
                  src="step1.svg"
                />
              </div>
              <div
                class="panelMainContent"
              >
                
                <p
                  class="panelBodyText"
                >
                  Authenticate via EU Login to access your EBSI Wallet.
                </p>
              </div>
              <div
                class="panelButtonContainer"
              >
                <a
                  class="panelLink ecl-button ecl-button--call"
                  href="https://ecas.ec.europa.eu/cas/login?service=https%3A%2F%2Fapp.intebsi.xyz%2Fwallet%2Fcredentials&renew=false"
                  role="button"
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    `);
  });

  it("should handle the ticket and ask the user to create a new password", async () => {
    expect.assertions(5);
    const history = createMemoryHistory();
    const route = "/some-route?ticket=xyz";
    history.push(route);

    sessionStorage.setItem(
      "urlBeforeLogin",
      "http://localhost/some-other-route"
    );

    const historySpy = jest.spyOn(history, "replace");

    const { getByText, getByLabelText, getByRole } = render(
      <Router history={history}>
        <Login>TestChildren</Login>
      </Router>
    );

    // The user should have been redirected to the previous route
    expect(historySpy).toHaveBeenCalledWith("/some-other-route");

    // The user should be asked to create a new password
    expect(getByText("Generate Keys")).toBeDefined();

    // The user types a new password but makes a mistake in the confirmation
    const passwordInput = getByLabelText("Please enter your password:");
    const confirmPasswordInput = getByLabelText("Confirm your password:");
    const submitButton = getByRole("button", { name: "Generate" });

    fireEvent.change(passwordInput, { target: { value: "test" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "testerror" } });

    // Submit
    fireEvent.click(submitButton);
    await act(() => Promise.resolve());

    // The user should see an error
    expect(
      getByText("Your password and confirmation password do not match.")
    ).toBeDefined();

    // Now, the user types twice the same password
    fireEvent.change(passwordInput, { target: { value: "test" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "test" } });

    // Prepare mocks
    const setUpKeysSpy = jest
      .spyOn(LoginUtils, "setUpKeys")
      .mockImplementationOnce(async () => Promise.resolve());
    const handleTicketSpy = jest
      .spyOn(LoginUtils, "handleTicket")
      .mockImplementationOnce(async () => Promise.resolve());

    // Submit form
    fireEvent.click(submitButton);
    await act(() => Promise.resolve());

    // Check spies
    expect(setUpKeysSpy).toHaveBeenCalledWith("test");
    expect(handleTicketSpy).toHaveBeenCalledWith("xyz", "test");

    sessionStorage.removeItem("urlBeforeLogin");
  });

  it("should handle the ticket and ask the user to enter the existing password", async () => {
    expect.assertions(4);
    const history = createMemoryHistory();
    const route = "/some-route?ticket=xyz";
    history.push(route);

    const historySpy = jest.spyOn(history, "replace");

    jest.spyOn(DataStorage, "keysNotExist").mockImplementationOnce(() => false);

    const { getByText, getByLabelText, getByRole } = render(
      <Router history={history}>
        <Login>TestChildren</Login>
      </Router>
    );

    // The user should have been redirected to the same location, without "ticket" in the url
    expect(historySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/some-route",
        search: "",
      })
    );

    // The user should be asked to open the wallet with the existing password
    expect(getByText("Open Wallet")).toBeDefined();

    // The user types a new password but makes a mistake in the confirmation
    const passwordInput = getByLabelText("Please enter your password:");
    const submitButton = getByRole("button", { name: "Open wallet" });

    fireEvent.change(passwordInput, { target: { value: "test" } });

    // Prepare mocks
    jest.spyOn(DataStorage, "getKeys").mockImplementationOnce(() => "keys");
    const restoreWalletSpy = jest
      .spyOn(SecureEnclave.Instance, "restoreWallet")
      .mockImplementationOnce(async () => Promise.resolve(""));
    const handleTicketSpy = jest
      .spyOn(LoginUtils, "handleTicket")
      .mockImplementationOnce(async () => Promise.resolve());

    // Submit form
    fireEvent.click(submitButton);
    await act(() => Promise.resolve());

    // Check spies
    expect(restoreWalletSpy).toHaveBeenCalledWith({
      encryptedKey: "keys",
      password: "test",
    });
    expect(handleTicketSpy).toHaveBeenCalledWith("xyz", "test");
  });

  it("should render the children elements if the user is authenticated", () => {
    expect.assertions(3);

    jest.spyOn(DataStorage, "getJWT").mockImplementation(() => "");
    const isTokenExpiredSpy = jest
      .spyOn(JWTHandler, "isTokenExpired")
      .mockImplementation(() => false);
    const connectionNotEstablishedSpy = jest
      .spyOn(DataStorage, "connectionNotEstablished")
      .mockImplementation(() => false);

    const { container } = render(
      <BrowserRouter>
        <Login>TestChildren</Login>
      </BrowserRouter>
    );

    expect(container).toHaveTextContent("TestChildren");
    expect(isTokenExpiredSpy).toHaveBeenCalledTimes(1);
    expect(connectionNotEstablishedSpy).toHaveBeenCalledTimes(1);
  });
});
