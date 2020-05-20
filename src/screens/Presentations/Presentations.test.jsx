import React from "react";
import { BrowserRouter } from "react-router-dom";
import Presentations from "./Presentations";
import { mount, shallow } from "../../../enzyme";
import * as DataStorage from "../../utils/DataStorage";
import * as JWTHandler from "../../utils/JWTHandler";
import * as mocks from "../../test/mocks/mocks";
import * as idHub from "../../apis/idHub";
import * as values from "../../test/mocks/values";
import * as ecas from "../../apis/ecas";
import colors from "../../config/colors";

describe("presentations renders", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
  });

  it("presentations should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const mockedHistory = [];
    const wrapper = mount(
      <BrowserRouter>
        <Presentations match={mock} location={mock} history={mockedHistory} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should redirect to login page if it has not a jwt", () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );
    const instance = presentationsComponent.instance();

    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(true);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    const redirectToMock = jest.spyOn(instance, "redirectTo");
    instance.componentDidMount();

    expect(redirectToMock).toHaveBeenCalledWith("");
    spy.mockRestore();
    spyTokenExpired.mockRestore();
    redirectToMock.mockRestore();
  });

  it("should call the loginLink if page if JWT is expired", () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );
    const instance = presentationsComponent.instance();

    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(false);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(true);

    const loginLinkMock = jest.spyOn(ecas, "loginLink");
    instance.componentDidMount();

    expect(loginLinkMock).toHaveBeenCalledWith();
    spy.mockRestore();
    spyTokenExpired.mockRestore();
    loginLinkMock.mockRestore();
  });

  it("should get all the credentials and generate a CredentialItem for each one", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockReturnValue({ status: 200, data: mocks.getCredentialsVP });

    await presentationsComponent.instance().getCredentials();

    expect(presentationsComponent.state("credentials")).toHaveLength(1);

    spy.mockRestore();
  });

  it("should call the method openToast if something is wrong fetching the credentials", async () => {
    expect.assertions(2);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockReturnValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      presentationsComponent.instance(),
      "openToast"
    );

    await presentationsComponent.instance().getCredentials();

    expect(presentationsComponent.state("credentials")).toHaveLength(0);
    expect(openToastMock).toHaveBeenCalledWith(
      `${values.errorGettingCredentials}${" "}Error`
    );

    spy.mockRestore();
    openToastMock.mockRestore();
  });

  it("should retrieve and display the credential", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredential");
    spy.mockReturnValue({ status: 200, data: mocks.getCredential });

    const openCredentialModalMock = jest.spyOn(
      presentationsComponent.instance(),
      "openModalCredential"
    );

    await presentationsComponent.instance().displayCredential();

    expect(openCredentialModalMock).toHaveBeenCalledWith(mocks.getCredential);

    spy.mockRestore();
    openCredentialModalMock.mockRestore();
  });
  it("should call the method openToast if something is wrong retrieven the credential", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredential");
    spy.mockReturnValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      presentationsComponent.instance(),
      "openToast"
    );

    await presentationsComponent.instance().displayCredential();

    expect(openToastMock).toHaveBeenCalledWith(
      `${values.errorGettingTheCredential} Error`
    );

    spy.mockRestore();
    openToastMock.mockRestore();
  });
});

describe("auxiliar methods for presentations", () => {
  it("should open the toast", () => {
    expect.assertions(4);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    presentationsComponent.instance().openToast("message");

    expect(presentationsComponent.state("isToastOpen")).toBe(true);
    expect(presentationsComponent.state("toastMessage")).toBe("message");
    expect(presentationsComponent.state("isLoadingOpen")).toBe(false);
    expect(presentationsComponent.state("toastColor")).toBe(colors.EC_RED);
  });

  it("should open the modal toast with a success message", () => {
    expect.assertions(4);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    presentationsComponent.instance().openSuccessToast("message");

    expect(presentationsComponent.state("isToastOpen")).toBe(true);
    expect(presentationsComponent.state("toastMessage")).toBe("message");
    expect(presentationsComponent.state("isLoadingOpen")).toBe(false);
    expect(presentationsComponent.state("toastColor")).toBe(colors.EC_GREEN);
  });

  it("should close the toast", () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    presentationsComponent.instance().closeToast();

    expect(presentationsComponent.state("isToastOpen")).toBe(false);
  });
  it("should open the credential modal", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    // const spy = jest.spyOn(strB64dec, "strB64dec");
    // spy.mockReturnValue("data decoded");

    await presentationsComponent
      .instance()
      .openModalCredential(mocks.getCredential);

    expect(presentationsComponent.state("isModalCredentialOpen")).toBe(true);
    // expect(credentialsComponent.state("credential").dataDecoded).toBe("data decoded");
    // spy.mockRestore();
  });
  it("should close the credential modal", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    presentationsComponent.instance().closeModalCredential();

    expect(presentationsComponent.state("isModalCredentialOpen")).toBe(false);
  });
  it("should open the tour", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    presentationsComponent.instance().openTour();

    expect(presentationsComponent.state("isTourOpen")).toBe(true);
  });
  it("should close the tour", async () => {
    expect.assertions(1);
    const historyMock = [];
    const mockedLocation = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    presentationsComponent.instance().closeTour();

    expect(presentationsComponent.state("isTourOpen")).toBe(false);
  });
});
