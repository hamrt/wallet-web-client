import React from "react";
import { Router, BrowserRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from "@testing-library/react";
import { Login } from "./Login";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import * as DataStorage from "../../utils/DataStorage";
import * as JWTHandler from "../../utils/JWTHandler";
import * as LoginUtils from "./Login.utils";
import * as keysManager from "../../utils/KeysHandler";

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
        </main>
      </div>
    `);
  });

  it("should handle the ticket and ask the user to create a new password", async () => {
    expect.assertions(7);
    const history = createMemoryHistory();
    history.push("/some-route?ticket=xyz");

    sessionStorage.setItem("urlBeforeLogin", "http://test/some-other-route");

    const historySpy = jest.spyOn(history, "replace");

    const { getByText, getByLabelText, getByRole } = render(
      <Router history={history}>
        <Login>TestChildren</Login>
      </Router>
    );

    // The user should have been redirected to the previous route
    expect(historySpy).toHaveBeenCalledWith("/some-other-route");

    // The user sees the "Choose method" screen
    expect(getByText("Welcome on EBSI Wallet!")).toBeDefined();

    // Option "Use your existing wallet" should be missing
    expect(() => getByText("Use your existing wallet")).toThrow();

    // The user clicks on "Create a new wallet"
    const createWalletButton = getByRole("button", {
      name: "Create a new wallet",
    });
    fireEvent.click(createWalletButton);
    await act(() => Promise.resolve());

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
    expect.assertions(6);
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

    // The user sees the "Choose method" screen
    expect(getByText("Welcome back on EBSI Wallet!")).toBeDefined();

    // Option "Use your existing wallet" should be present
    expect(getByText("Use your existing wallet")).toBeDefined();

    // The user clicks on "Use your existing wallet"
    const loadWalletButton = getByRole("button", {
      name: "Use your existing wallet",
    });
    fireEvent.click(loadWalletButton);
    await act(() => Promise.resolve());

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

  it("should handle the ticket and ask the user to import an existing wallet", async () => {
    expect.assertions(6);
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

    // The user sees the "Choose method" screen
    expect(getByText("Welcome back on EBSI Wallet!")).toBeDefined();

    // The user clicks on "Import an existing wallet"
    const importWalletButton = getByRole("button", {
      name: "Import an existing wallet",
    });
    fireEvent.click(importWalletButton);
    await act(() => Promise.resolve());

    // The user should be asked to import an existing wallet
    expect(getByText("Import an existing wallet")).toBeDefined();

    // The user types a new password and uploads a file
    const fileInput = getByLabelText("Keystore file");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByRole("button", { name: "Import wallet" });
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    Object.defineProperty(fileInput, "files", {
      value: [file],
      configurable: true,
    });
    // https://github.com/react-hook-form/react-hook-form/issues/685#issuecomment-567467204
    Object.defineProperty(fileInput, "value", {
      value: file.name,
    });
    fireEvent.change(fileInput);
    fireEvent.change(passwordInput, { target: { value: "test" } });

    // Submit form
    fireEvent.click(submitButton);
    await act(() => Promise.resolve());
    await waitFor(() => screen.getByText(/Error: Invalid extension/i));

    // Now the user uploads a JSON file
    const jsonFile = new File([""], "keystore.json", {
      type: "application/json",
    });
    Object.defineProperty(fileInput, "files", { value: [jsonFile] });
    // https://github.com/react-hook-form/react-hook-form/issues/685#issuecomment-567467204
    Object.defineProperty(fileInput, "value", {
      value: jsonFile.name,
    });
    fireEvent.change(fileInput);

    // Prepare mocks
    jest.spyOn(DataStorage, "getKeys").mockImplementation(() => "keys");
    const restoreWalletSpy = jest
      .spyOn(SecureEnclave.Instance, "restoreWallet")
      .mockImplementation(async () => Promise.resolve(""));
    const handleTicketSpy = jest
      .spyOn(LoginUtils, "handleTicket")
      .mockImplementation(async () => Promise.resolve());
    const importKeysSpy = jest
      .spyOn(keysManager, "importKeys")
      .mockImplementation(async () => Promise.resolve("a2V5cw=="));

    // Submit form
    fireEvent.click(submitButton);
    await act(() => Promise.resolve());

    // Check spies
    expect(restoreWalletSpy).toHaveBeenCalledWith({
      encryptedKey: "keys",
      password: "test",
    });
    expect(handleTicketSpy).toHaveBeenCalledWith("xyz", "test");
    expect(importKeysSpy).toHaveBeenCalledWith(jsonFile);
  });

  it("should render the children elements if the user is authenticated", () => {
    expect.assertions(4);

    jest.spyOn(DataStorage, "getJWT").mockImplementation(() => "");
    const isTokenExpiredSpy = jest
      .spyOn(JWTHandler, "isTokenExpired")
      .mockImplementation(() => false);
    const connectionNotEstablishedSpy = jest
      .spyOn(DataStorage, "connectionNotEstablished")
      .mockImplementation(() => false);
    const keysNotExistSpy = jest
      .spyOn(DataStorage, "keysNotExist")
      .mockImplementation(() => false);

    const { container } = render(
      <BrowserRouter>
        <Login>TestChildren</Login>
      </BrowserRouter>
    );

    expect(container).toHaveTextContent("TestChildren");
    expect(isTokenExpiredSpy).toHaveBeenCalledTimes(1);
    expect(connectionNotEstablishedSpy).toHaveBeenCalledTimes(1);
    expect(keysNotExistSpy).toHaveBeenCalledTimes(1);
  });
});
