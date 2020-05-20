import React from "react";
import { BrowserRouter } from "react-router-dom";
import Credentials from "./Credentials";
import { mount, shallow } from "../../../enzyme";
import * as DataStorage from "../../utils/DataStorage";
import * as JWTHandler from "../../utils/JWTHandler";
import * as mocks from "../../test/mocks/mocks";
import * as values from "../../test/mocks/values";
import * as idHub from "../../apis/idHub";
import * as wallet from "../../apis/wallet";
import * as ecas from "../../apis/ecas";
import colors from "../../config/colors";

let credentialsComponent = "";

describe("credentials", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
  });
  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
  });
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const mockedHistory = [];
    const mockedLocation = [];
    const wrapper = mount(
      <BrowserRouter>
        <Credentials
          match={mock}
          location={mockedLocation}
          history={mockedHistory}
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should call the method manageAccess if ticket is coming form the url", () => {
    expect.assertions(1);
    const { ticketUrl } = mocks;
    const { ticket } = mocks;
    const historyMock = [];
    const mockedLocation = { search: ticketUrl };
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const manageAccessMock = jest.spyOn(
      credentialsComponent.instance(),
      "manageAccess"
    );
    credentialsComponent.instance().handleKeys();

    expect(manageAccessMock).toHaveBeenCalledWith(ticket);
    manageAccessMock.mockRestore();
  });

  it("should call the method redirectIfUserIsNotLogged if ticket is not coming form the url", () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = { search: "" };
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const redirectIfUserIsNotLoggedMock = jest.spyOn(
      credentialsComponent.instance(),
      "redirectIfUserIsNotLogged"
    );
    credentialsComponent.instance().handleKeys();

    expect(redirectIfUserIsNotLoggedMock).toHaveBeenCalledWith();
    redirectIfUserIsNotLoggedMock.mockRestore();
  });

  it("should go to redirect to Profile if it gets the ticket but the keys doesn't exist", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const { ticket } = mocks;
    const mockedLocation = { search: ticket };
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(DataStorage, "keysNotExist");
    spy.mockReturnValue(true);
    const redirectToMock = jest.spyOn(
      credentialsComponent.instance(),
      "redirectTo"
    );

    credentialsComponent.instance().manageAccess(ticket);

    expect(redirectToMock).toHaveBeenCalledWith(`profile?ticket=${ticket}`);
    spy.mockRestore();
    redirectToMock.mockRestore();
  });

  it("should ask for the password if it gets the ticket and the keys exist", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const { ticket } = mocks;
    const mockedLocation = { search: ticket };
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    // const spy = jest.spyOn(DataStorage, "nonDecryptedKey");
    // spy.mockReturnValue(true);
    const openModalAskingPassMock = jest.spyOn(
      credentialsComponent.instance(),
      "openModalAskingPass"
    );

    credentialsComponent.instance().manageAccess(ticket);

    expect(openModalAskingPassMock).toHaveBeenCalledWith();
    // spy.mockRestore();
    openModalAskingPassMock.mockRestore();
  });

  it("should redirect if non ticket is got and user is not logged", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(true);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    credentialsComponent.instance().redirectIfUserIsNotLogged();

    expect(historyMock.push.mock.calls[0]).toMatchObject(["/"]);
    spy.mockRestore();
    spyTokenExpired.mockRestore();
  });

  it("should call the loginLink if page if JWT is expired", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(false);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(true);

    const loginLinkMock = jest.spyOn(ecas, "loginLink");

    credentialsComponent.instance().redirectIfUserIsNotLogged();

    expect(loginLinkMock).toHaveBeenCalledWith();
    spy.mockRestore();
  });

  it("should call the method getCredentials if non ticket is got but user is logged", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(false);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    const getCredentialsMock = jest.spyOn(
      credentialsComponent.instance(),
      "getCredentials"
    );

    credentialsComponent.instance().redirectIfUserIsNotLogged();

    expect(getCredentialsMock).toHaveBeenCalledWith();
    spy.mockRestore();
    spyTokenExpired.mockRestore();
    getCredentialsMock.mockRestore();
  });

  it("should get all the credentials and generate a CredentialItem for each one", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockReturnValue({ status: 200, data: mocks.getCredentials });

    await credentialsComponent.instance().getCredentials();

    expect(credentialsComponent.state("credentials")).toHaveLength(1);

    spy.mockRestore();
  });

  it("should call the method openToast if something is wrong fetching the credentials", async () => {
    expect.assertions(2);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockReturnValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      credentialsComponent.instance(),
      "openToast"
    );

    await credentialsComponent.instance().getCredentials();

    expect(credentialsComponent.state("credentials")).toHaveLength(0);
    expect(openToastMock).toHaveBeenCalledWith(
      `${values.errorGettingCredentials}${" "}Error`
    );

    spy.mockRestore();
    openToastMock.mockRestore();
  });

  it("should decrypt the Keys when click the button Continue", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
    credentialsComponent.instance().passwordForKeyGeneration = {
      current: { value: "1234" },
    };
    credentialsComponent.instance().setState({ ticketFromUrl: mocks.ticket });

    const decryptKeysMock = jest.spyOn(
      credentialsComponent.instance(),
      "decryptKeys"
    );

    await credentialsComponent.instance().onContinueClick();

    expect(decryptKeysMock).toHaveBeenCalledWith("1234");

    decryptKeysMock.mockRestore();
  });

  it("should call the method getCredential and store the JWT received after establish Connection", async () => {
    expect.assertions(2);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spyToken = jest.spyOn(credentialsComponent.instance(), "signToken");
    spyToken.mockReturnValue(mocks.jwtToEstablishBond);
    const spy = jest.spyOn(wallet, "establishBond");
    spy.mockReturnValue({ status: 200, data: mocks.connectionResponse });

    const getCredentialsMock = jest.spyOn(
      credentialsComponent.instance(),
      "getCredentials"
    );
    const storeConnectionMock = jest.spyOn(
      credentialsComponent.instance(),
      "storeConnection"
    );

    await credentialsComponent.instance().establishBond(mocks.ticket, "1234");

    expect(storeConnectionMock).toHaveBeenCalledWith(
      mocks.connectionResponse.accessToken
    );
    expect(getCredentialsMock).toHaveBeenCalledWith();

    spy.mockRestore();
    spyToken.mockRestore();
    storeConnectionMock.mockRestore();
    getCredentialsMock.mockRestore();
  });

  it("should call the method openToast if something is wrong establishing the connection", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spyToken = jest.spyOn(credentialsComponent.instance(), "signToken");
    spyToken.mockReturnValue(mocks.jwtToEstablishBond);
    const spy = jest.spyOn(wallet, "establishBond");
    spy.mockReturnValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      credentialsComponent.instance(),
      "openToast"
    );

    await credentialsComponent.instance().establishBond();

    expect(openToastMock).toHaveBeenCalledWith("Error");

    spy.mockRestore();
    openToastMock.mockRestore();
  });

  it("should retrieve and display the credential", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredential");
    spy.mockReturnValue({ status: 200, data: mocks.getCredential });

    const openCredentialModalMock = jest.spyOn(
      credentialsComponent.instance(),
      "openCredentialModal"
    );

    await credentialsComponent.instance().displayCredential();

    expect(openCredentialModalMock).toHaveBeenCalledWith(mocks.getCredential);

    spy.mockRestore();
    openCredentialModalMock.mockRestore();
  });

  it("should call the method openToast if something is wrong retrieven the credential", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredential");
    spy.mockReturnValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      credentialsComponent.instance(),
      "openToast"
    );

    await credentialsComponent.instance().displayCredential();

    expect(openToastMock).toHaveBeenCalledWith(
      `${values.errorGettingTheCredential} Error`
    );

    spy.mockRestore();
    openToastMock.mockRestore();
  });
});

describe("auxiliar methods for credentials", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
  });
  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
  });
  it("should redirects to the url specified with the method", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
    credentialsComponent.instance().redirectTo("login");

    expect(historyMock.push.mock.calls[0]).toMatchObject(["/login"]);
  });

  it("should open the modal when openModalAskingPass is called", () => {
    expect.assertions(2);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.setState({
      isModalAskingForPass: false,
      shouldAskToDecryptKey: false,
    });
    credentialsComponent.instance().openModalAskingPass();

    expect(credentialsComponent.state("isModalAskingForPass")).toBe(true);
    expect(credentialsComponent.state("shouldAskToDecryptKey")).toBe(true);
  });

  it("should close the modal asking for pass", () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().closeModalAskingPass();

    expect(credentialsComponent.state("isModalAskingForPass")).toBe(false);
  });

  it("should open the toast", () => {
    expect.assertions(4);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().openToast("message");

    expect(credentialsComponent.state("isToastOpen")).toBe(true);
    expect(credentialsComponent.state("toastMessage")).toBe("message");
    expect(credentialsComponent.state("isLoadingOpen")).toBe(false);
    expect(credentialsComponent.state("toastColor")).toBe(colors.EC_RED);
  });

  it("should open the modal toast with a success message", () => {
    expect.assertions(4);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().openSuccessToast();

    expect(credentialsComponent.state("isToastOpen")).toBe(true);
    expect(credentialsComponent.state("toastMessage")).toBe(
      values.successMessage
    );
    expect(credentialsComponent.state("shouldAskToDecryptKey")).toBe(false);
    expect(credentialsComponent.state("toastColor")).toBe(colors.EC_GREEN);
  });

  it("should close the toast", () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().closeToast();

    expect(credentialsComponent.state("isToastOpen")).toBe(false);
  });

  it("should start loading", () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().startLoading();

    expect(credentialsComponent.state("isLoadingOpen")).toBe(true);
  });
  it("should stop loading", () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().stopLoading();

    expect(credentialsComponent.state("isLoadingOpen")).toBe(false);
  });
  it("should open the credential modal", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    // const spy = jest.spyOn(strB64dec, "strB64dec");
    // spy.mockReturnValue("data decoded");

    await credentialsComponent
      .instance()
      .openCredentialModal(mocks.getCredential);

    expect(credentialsComponent.state("isModalCredentialOpen")).toBe(true);
    // expect(credentialsComponent.state("credential").dataDecoded).toBe("data decoded");
    // spy.mockRestore();
  });
  it("should close the credential modal", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().closeCredentialModal();

    expect(credentialsComponent.state("isModalCredentialOpen")).toBe(false);
  });
  it("should open the tour", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().openTour();

    expect(credentialsComponent.state("isTourOpen")).toBe(true);
  });
  it("should close the tour", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.instance().closeTour();

    expect(credentialsComponent.state("isTourOpen")).toBe(false);
  });
});
