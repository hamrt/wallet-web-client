import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import Credentials from "./Credentials";
import * as DataStorage from "../../utils/DataStorage";
import * as JWTHandler from "../../utils/JWTHandler";
import * as mocks from "../../test/mocks/mocks";
import * as values from "../../test/mocks/values";
import * as idHub from "../../apis/idHub";
import * as wallet from "../../apis/wallet";
import * as ecas from "../../apis/ecas";
import colors from "../../config/colors";
import * as signToken from "../../utils/auth";

const mockResponse = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    assign: mockResponse,
  },
  writable: true,
});
describe("credentials", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mockedHistory: any[] = [];
    const mockedLocation: any[] = [];
    const wrapper = mount(
      <BrowserRouter>
        <Credentials location={mockedLocation} history={mockedHistory} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should call the method manageAccess if ticket is coming form the url", () => {
    expect.assertions(1);

    const { ticketUrl } = mocks;
    const { ticket } = mocks;
    const historyMock: any[] = [];
    const mockedLocation = { search: ticketUrl };
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const manageAccessMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "manageAccess"
    );
    (credentialsComponent.instance() as Credentials).handleKeys();

    expect(manageAccessMock).toHaveBeenCalledWith(ticket);
    manageAccessMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should call the method redirectIfUserIsNotLogged if ticket is not coming form the url", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation = { search: "" };
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const redirectIfUserIsNotLoggedMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "redirectIfUserIsNotLogged"
    );
    (credentialsComponent.instance() as Credentials).handleKeys();

    expect(redirectIfUserIsNotLoggedMock).toHaveBeenCalledWith();
    redirectIfUserIsNotLoggedMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should go to redirect to Profile if it gets the ticket but the keys doesn't exist", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const { ticket } = mocks;
    const mockedLocation = { search: ticket };
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(DataStorage, "keysNotExist");
    spy.mockReturnValue(true);
    const redirectToMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "redirectTo"
    );

    (credentialsComponent.instance() as Credentials).manageAccess(ticket);

    expect(redirectToMock).toHaveBeenCalledWith(`profile?ticket=${ticket}`);
    spy.mockRestore();
    redirectToMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should ask for the password if it gets the ticket and the keys exist", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const { ticket } = mocks;
    const mockedLocation = { search: ticket, assign: jest.fn() };
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const openModalAskingPassMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "openModalAskingPass"
    );

    (credentialsComponent.instance() as Credentials).manageAccess(ticket);

    expect(openModalAskingPassMock).toHaveBeenCalledWith();

    openModalAskingPassMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should redirect if non ticket is got and user is not logged", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "", assign: jest.fn() };
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(true);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    (credentialsComponent.instance() as Credentials).redirectIfUserIsNotLogged();

    expect(historyMock.push.mock.calls[0]).toMatchObject(["/"]);
    jest.restoreAllMocks();
  });

  it("should call the loginLink if page if JWT is expired", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "", assign: jest.fn() };
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(false);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(true);

    const mockEcas = jest.spyOn(ecas, "loginLink").mockReturnValue("/link");

    (credentialsComponent.instance() as Credentials).redirectIfUserIsNotLogged();

    expect(mockEcas).toHaveBeenCalledWith();
    jest.restoreAllMocks();
  });

  it("should call the method getCredentials if non ticket is got but user is logged", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "", assign: jest.fn() };
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(false);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    const getCredentialsMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "getCredentials"
    );

    (credentialsComponent.instance() as Credentials).redirectIfUserIsNotLogged();

    expect(getCredentialsMock).toHaveBeenCalledWith();
    jest.restoreAllMocks();
  });

  it("should get all the credentials and generate a CredentialItem for each one", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockResolvedValue({ status: 200, data: mocks.getCredentials });

    await (credentialsComponent.instance() as Credentials).getCredentials();

    expect(credentialsComponent.state("credentials")).toHaveLength(1);

    spy.mockRestore();
    jest.restoreAllMocks();
  });

  it("should call the method openToast if something is wrong fetching the credentials", async () => {
    expect.assertions(2);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockResolvedValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "openToast"
    );

    await (credentialsComponent.instance() as Credentials).getCredentials();

    expect(credentialsComponent.state("credentials")).toHaveLength(0);
    expect(openToastMock).toHaveBeenCalledWith(
      `${values.errorGettingCredentials}${" "}Error`
    );

    spy.mockRestore();
    openToastMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should decrypt the Keys when click the button Continue", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
    (credentialsComponent.instance() as Credentials).passwordForKeyGeneration = {
      current: { value: "1234" },
    } as any;
    (credentialsComponent.instance() as Credentials).setState({
      ticketFromUrl: mocks.ticket,
    });

    const decryptKeysMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "decryptKeys"
    );

    await (credentialsComponent.instance() as Credentials).onContinueClick();

    expect(decryptKeysMock).toHaveBeenCalledWith("1234");

    decryptKeysMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should call the method getCredential and store the JWT received after establish Connection", async () => {
    expect.assertions(2);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    jest
      .spyOn(signToken, "default")
      .mockResolvedValue(mocks.jwtToEstablishBond);
    const spy = jest.spyOn(wallet, "establishBond");
    spy.mockResolvedValue({ status: 200, data: mocks.connectionResponse });

    const getCredentialsMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "getCredentials"
    );
    const storeConnectionMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "storeConnection"
    );

    await (credentialsComponent.instance() as Credentials).establishBond(
      mocks.ticket,
      "1234"
    );

    expect(storeConnectionMock).toHaveBeenCalledWith(
      mocks.connectionResponse.accessToken
    );
    expect(getCredentialsMock).toHaveBeenCalledWith();

    jest.restoreAllMocks();
  });

  it("should call the method openToast if something is wrong establishing the connection", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spyToken = jest
      .spyOn(signToken, "default")
      .mockResolvedValue(mocks.jwtToEstablishBond);
    const spy = jest.spyOn(wallet, "establishBond");
    spy.mockResolvedValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "openToast"
    );

    await (credentialsComponent.instance() as Credentials).establishBond(
      "",
      ""
    );

    expect(openToastMock).toHaveBeenCalledWith("Error");

    spy.mockRestore();
    spyToken.mockRestore();
    openToastMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should call the method openToast when signToken fails", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spyToken = jest
      .spyOn(signToken, "default")
      .mockRejectedValue(new Error("Signature error"));

    const openToastMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "openToast"
    );

    await (credentialsComponent.instance() as Credentials).establishBond(
      "",
      ""
    );

    expect(openToastMock).toHaveBeenCalledWith(
      "Could not sign token and establish connection to the wallet: Signature error"
    );
    spyToken.mockRestore();
    openToastMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should retrieve and display the credential", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredential");
    spy.mockResolvedValue({ status: 200, data: mocks.getCredential });

    const openCredentialModalMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "openCredentialModal"
    );

    await (credentialsComponent.instance() as Credentials).displayCredential(
      undefined as any
    );

    expect(openCredentialModalMock).toHaveBeenCalledWith(mocks.getCredential);

    spy.mockRestore();
    openCredentialModalMock.mockRestore();
    jest.restoreAllMocks();
  });

  it("should call the method openToast if something is wrong retrieven the credential", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredential");
    spy.mockResolvedValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      credentialsComponent.instance() as Credentials,
      "openToast"
    );

    await (credentialsComponent.instance() as Credentials).displayCredential(
      undefined as any
    );

    expect(openToastMock).toHaveBeenCalledWith(
      `${values.errorGettingTheCredential} Error`
    );

    spy.mockRestore();
    openToastMock.mockRestore();
    jest.restoreAllMocks();
  });
});

describe("auxiliar methods for credentials", () => {
  it("should redirects to the url specified with the method", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );
    (credentialsComponent.instance() as Credentials).redirectTo("login");

    expect(historyMock.push.mock.calls[0]).toMatchObject(["/login"]);
    jest.restoreAllMocks();
  });

  it("should open the modal when openModalAskingPass is called", () => {
    expect.assertions(2);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    credentialsComponent.setState({
      isModalAskingForPass: false,
      shouldAskToDecryptKey: false,
    });
    (credentialsComponent.instance() as Credentials).openModalAskingPass();

    expect(credentialsComponent.state("isModalAskingForPass")).toBe(true);
    expect(credentialsComponent.state("shouldAskToDecryptKey")).toBe(true);
    jest.restoreAllMocks();
  });

  it("should close the modal asking for pass", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).closeModalAskingPass();

    expect(credentialsComponent.state("isModalAskingForPass")).toBe(false);
  });

  it("should open the toast", () => {
    expect.assertions(4);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).openToast("message");

    expect(credentialsComponent.state("isToastOpen")).toBe(true);
    expect(credentialsComponent.state("toastMessage")).toBe("message");
    expect(credentialsComponent.state("isLoadingOpen")).toBe(false);
    expect(credentialsComponent.state("toastColor")).toBe(colors.EC_RED);
  });

  it("should open the modal toast with a success message", () => {
    expect.assertions(4);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).openSuccessToast();

    expect(credentialsComponent.state("isToastOpen")).toBe(true);
    expect(credentialsComponent.state("toastMessage")).toBe(
      values.successMessage
    );
    expect(credentialsComponent.state("shouldAskToDecryptKey")).toBe(false);
    expect(credentialsComponent.state("toastColor")).toBe(colors.EC_GREEN);
  });

  it("should close the toast", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).closeToast();

    expect(credentialsComponent.state("isToastOpen")).toBe(false);
  });

  it("should start loading", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).startLoading();

    expect(credentialsComponent.state("isLoadingOpen")).toBe(true);
  });
  it("should stop loading", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).stopLoading();

    expect(credentialsComponent.state("isLoadingOpen")).toBe(false);
  });
  it("should open the credential modal", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).openCredentialModal(
      mocks.getCredential
    );

    expect(credentialsComponent.state("isModalCredentialOpen")).toBe(true);
  });
  it("should close the credential modal", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).closeCredentialModal();

    expect(credentialsComponent.state("isModalCredentialOpen")).toBe(false);
  });
  it("should open the tour", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).openTour();

    expect(credentialsComponent.state("isTourOpen")).toBe(true);
  });
  it("should close the tour", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    (credentialsComponent.instance() as Credentials).closeTour();

    expect(credentialsComponent.state("isTourOpen")).toBe(false);
  });
});
