import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import Profile from "./Profile";
import * as DataStorage from "../../utils/DataStorage";
import * as JWTHandler from "../../utils/JWTHandler";
import * as mocks from "../../test/mocks/mocks";
import * as wallet from "../../apis/wallet";
import * as idHub from "../../apis/idHub";
import * as ecas from "../../apis/ecas";
import colors from "../../config/colors";
import * as signToken from "../../utils/auth";

describe("profile renders", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
  });
  it("profile should renders without crashing", () => {
    expect.assertions(1);
    const mockedHistory: any[] = [];
    const mockedLocation: any[] = [];
    const wrapper = mount(
      <BrowserRouter>
        <Profile location={mockedLocation} history={mockedHistory} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should open the KeysGenerator if it gets the ticket but the keys doesn't exist", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const { ticketUrl } = mocks;
    const mockedLocation = { search: ticketUrl };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(DataStorage, "keysNotExist");
    spy.mockReturnValue(true);
    const openKeysGeneratorMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "openKeysGenerator"
    );

    (profileComponent.instance() as Profile).handleKeys();

    expect(openKeysGeneratorMock).toHaveBeenCalledWith();
    spy.mockRestore();
    openKeysGeneratorMock.mockRestore();
  });
  it("should open redirect to login if it doesn't gets the ticket", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "" };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(DataStorage, "keysNotExist");
    spy.mockReturnValue(true);
    const redirectIfUserIsNotLoggedMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "redirectIfUserIsNotLogged"
    );

    (profileComponent.instance() as Profile).handleKeys();

    expect(redirectIfUserIsNotLoggedMock).toHaveBeenCalledWith();
    spy.mockRestore();
    redirectIfUserIsNotLoggedMock.mockRestore();
  });

  it("should redirect if non ticket is got and user is not logged", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "" };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(true);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    (profileComponent.instance() as Profile).redirectIfUserIsNotLogged();

    expect(historyMock.push.mock.calls[0]).toMatchObject(["/"]);
    spy.mockRestore();
    spyTokenExpired.mockRestore();
  });

  it("should call the loginLink if page if JWT is expired", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(false);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(true);

    const loginLinkMock = jest.spyOn(ecas, "loginLink");

    (profileComponent.instance() as Profile).redirectIfUserIsNotLogged();

    expect(loginLinkMock).toHaveBeenCalledWith();
    spy.mockRestore();
    spyTokenExpired.mockRestore();
  });

  it("should call the method getCredentials and getNotifications if non ticket is got but user is logged", () => {
    expect.assertions(2);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "" };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(false);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    const getCredentialsMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "getCredentials"
    );
    const getNotificationsMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "getNotifications"
    );
    (profileComponent.instance() as Profile).redirectIfUserIsNotLogged();

    expect(getCredentialsMock).toHaveBeenCalledWith();
    expect(getNotificationsMock).toHaveBeenCalledWith();
    spy.mockRestore();
    spyTokenExpired.mockRestore();
    getCredentialsMock.mockRestore();
    getNotificationsMock.mockRestore();
  });

  it("should return an empty list with an invalid token", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "" };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    await (profileComponent.instance() as Profile).getNotifications();

    expect(profileComponent.state("notifications")).toHaveLength(0);
  });

  it("should get all the notifications", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "" };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );
    jest.spyOn(DataStorage, "getJWT").mockReturnValue("a valid token");
    const spy = jest.spyOn(wallet, "getNotifications");
    spy.mockResolvedValue({ status: 200, data: mocks.getNotifications });

    await (profileComponent.instance() as Profile).getNotifications();

    expect(profileComponent.state("notifications")).toHaveLength(2);

    spy.mockRestore();
    jest.restoreAllMocks();
  });
  it("should get all the credentials", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "" };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockResolvedValue({ status: 200, data: mocks.getCredentials });

    await (profileComponent.instance() as Profile).getCredentials();

    expect(profileComponent.state("credentials")).toHaveLength(1);

    spy.mockRestore();
  });

  it("should setup the Keys when click the button  generate", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation = { search: "" };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );
    const instance = profileComponent.instance() as Profile;
    instance.passwordForKeyGeneration = {
      current: { value: "1234" },
    } as any;

    const setUpKeysMock = jest.spyOn(instance, "setUpKeys");

    await instance.onGenerateClick();

    expect(setUpKeysMock).toHaveBeenCalledWith("1234");

    setUpKeysMock.mockRestore();
  });
  it("should get just the credentials (not the VP)", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: "" };
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    const list = (profileComponent.instance() as Profile).displayJustCredentials(
      mocks.getCredentials.items
    );

    expect(list).toHaveLength(1);
  });
  it("should call the method getCredentials, getNotifications and store the JWT received after establish Connection", async () => {
    expect.assertions(3);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    const spyToken = jest
      .spyOn(signToken, "default")
      .mockResolvedValue(mocks.jwtToEstablishBond);
    const spy = jest.spyOn(wallet, "establishBond");
    spy.mockResolvedValue({ status: 200, data: mocks.connectionResponse });

    const getCredentialsMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "getCredentials"
    );
    const getNotificationsMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "getNotifications"
    );
    const storeConnectionMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "storeConnection"
    );

    await (profileComponent.instance() as Profile).establishBond(
      mocks.ticket,
      "1234"
    );

    expect(storeConnectionMock).toHaveBeenCalledWith(
      mocks.connectionResponse.accessToken
    );
    expect(getCredentialsMock).toHaveBeenCalledWith();
    expect(getNotificationsMock).toHaveBeenCalledWith();

    spy.mockRestore();
    spyToken.mockRestore();
    storeConnectionMock.mockRestore();
    getCredentialsMock.mockRestore();
    getNotificationsMock.mockRestore();
  });

  it("should call the method openToast if something is wrong establishing the connection", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    const spyToken = jest
      .spyOn(signToken, "default")
      .mockResolvedValue(mocks.jwtToEstablishBond);
    const spy = jest.spyOn(wallet, "establishBond");
    spy.mockResolvedValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "openToast"
    );
    await (profileComponent.instance() as Profile).establishBond("", "");

    expect(openToastMock).toHaveBeenCalledWith("Error");

    spy.mockRestore();
    spyToken.mockRestore();
    openToastMock.mockRestore();
  });

  it("should call the method openToast when signToken fails", async () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    const spyToken = jest
      .spyOn(signToken, "default")
      .mockRejectedValue(new Error("Signature error"));

    const openToastMock = jest.spyOn(
      profileComponent.instance() as Profile,
      "openToast"
    );
    await (profileComponent.instance() as Profile).establishBond("", "");

    expect(openToastMock).toHaveBeenCalledWith(
      "Could not sign token and establish connection to the wallet: Signature error"
    );
    spyToken.mockRestore();
    openToastMock.mockRestore();
  });
});

describe("auxiliar methods for profile", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
  });
  it("should open the modal key generator", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).openKeysGenerator();

    expect(profileComponent.state("isKeysGeneratorOpen")).toBe(true);
  });

  it("should close the modal key generator", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).closeKeysGenerator();

    expect(profileComponent.state("isKeysGeneratorOpen")).toBe(false);
  });
  it("should open the modal for import keys", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).openModalImport();

    expect(profileComponent.state("isModalImportOpen")).toBe(true);
  });

  it("should close the modal for import keys", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).closeModalImport();

    expect(profileComponent.state("isModalImportOpen")).toBe(false);
  });

  it("should open the toast", () => {
    expect.assertions(3);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).openToast("message");

    expect(profileComponent.state("isToastOpen")).toBe(true);
    expect(profileComponent.state("toastMessage")).toBe("message");
    expect(profileComponent.state("toastColor")).toBe(colors.EC_RED);
  });

  it("should open the modal toast with a success message", () => {
    expect.assertions(3);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).openSuccessToast("message");

    expect(profileComponent.state("isToastOpen")).toBe(true);
    expect(profileComponent.state("toastMessage")).toBe("message");
    expect(profileComponent.state("toastColor")).toBe(colors.EC_GREEN);
  });

  it("should close the toast", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).closeToast();

    expect(profileComponent.state("isToastOpen")).toBe(false);
  });

  it("should start loading", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).startLoading();

    expect(profileComponent.state("isLoadingOpen")).toBe(true);
  });
  it("should stop loading", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).stopLoading();

    expect(profileComponent.state("isLoadingOpen")).toBe(false);
  });

  it("should open the tour", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).openTour();

    expect(profileComponent.state("isTourOpen")).toBe(true);
  });
  it("should close the tour", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const profileComponent = shallow(
      <Profile history={historyMock} location={mockedLocation} />
    );

    (profileComponent.instance() as Profile).closeTour();

    expect(profileComponent.state("isTourOpen")).toBe(false);
  });
});
