import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import Presentations, { PresentationsStatus } from "./Presentations";
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

  it("presentations should render without crashing", () => {
    expect.assertions(1);
    const mockedLocation: any[] = [];
    const mockedHistory: any[] = [];
    const wrapper = mount(
      <BrowserRouter>
        <Presentations location={mockedLocation} history={mockedHistory} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should redirect to login page if it has not a jwt", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );
    const instance = presentationsComponent.instance() as Presentations;

    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(true);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    const redirectToMock = jest.spyOn(instance as Presentations, "redirectTo");
    instance.componentDidMount();

    expect(redirectToMock).toHaveBeenCalledWith("");
    spy.mockRestore();
    spyTokenExpired.mockRestore();
    redirectToMock.mockRestore();
  });

  it("should call the loginLink if page if JWT is expired", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );
    const instance = presentationsComponent.instance() as Presentations;

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

  it("should get all the presentations and generate a CredentialItem for each one", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockResolvedValue({ status: 200, data: mocks.getCredentialsVP });

    await (presentationsComponent.instance() as Presentations).getCredentials();

    expect(presentationsComponent.state("presentations")).toHaveLength(1);

    spy.mockRestore();
  });

  it("should have presentationsStatus == 'error' if something is wrong fetching the presentations", async () => {
    expect.assertions(2);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockResolvedValue({ status: 400, data: "Error" });

    await (presentationsComponent.instance() as Presentations).getCredentials();

    expect(presentationsComponent.state("presentations")).toHaveLength(0);
    expect(presentationsComponent.state("presentationsStatus")).toStrictEqual(
      PresentationsStatus.Error
    );

    spy.mockRestore();
  });

  it("should retrieve and display the credential", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredential");
    spy.mockResolvedValue({ status: 200, data: mocks.getCredential });

    const openCredentialModalMock = jest.spyOn(
      presentationsComponent.instance() as Presentations,
      "openModalCredential"
    );

    const hash = "a hash";
    await (presentationsComponent.instance() as Presentations).displayCredential(
      hash
    );

    expect(openCredentialModalMock).toHaveBeenCalledWith(mocks.getCredential);

    spy.mockRestore();
    openCredentialModalMock.mockRestore();
  });
  it("should call the method openToast if something is wrong retrieven the credential", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredential");
    spy.mockResolvedValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(
      presentationsComponent.instance() as Presentations,
      "openToast"
    );

    const hash = "a hash";
    await (presentationsComponent.instance() as Presentations).displayCredential(
      hash
    );

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
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    (presentationsComponent.instance() as Presentations).openToast("message");

    expect(presentationsComponent.state("isToastOpen")).toBe(true);
    expect(presentationsComponent.state("toastMessage")).toBe("message");
    expect(presentationsComponent.state("isLoadingOpen")).toBe(false);
    expect(presentationsComponent.state("toastColor")).toBe(colors.EC_RED);
  });

  it("should open the modal toast with a success message", () => {
    expect.assertions(4);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    (presentationsComponent.instance() as Presentations).openSuccessToast(
      "message"
    );

    expect(presentationsComponent.state("isToastOpen")).toBe(true);
    expect(presentationsComponent.state("toastMessage")).toBe("message");
    expect(presentationsComponent.state("isLoadingOpen")).toBe(false);
    expect(presentationsComponent.state("toastColor")).toBe(colors.EC_GREEN);
  });

  it("should close the toast", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    (presentationsComponent.instance() as Presentations).closeToast();

    expect(presentationsComponent.state("isToastOpen")).toBe(false);
  });
  it("should open the credential modal", () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    (presentationsComponent.instance() as Presentations).openModalCredential(
      mocks.getCredential
    );

    expect(presentationsComponent.state("isModalCredentialOpen")).toBe(true);
  });
  it("should close the credential modal", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    (presentationsComponent.instance() as Presentations).closeModalCredential();

    expect(presentationsComponent.state("isModalCredentialOpen")).toBe(false);
  });
  it("should open the tour", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    (presentationsComponent.instance() as Presentations).openTour();

    expect(presentationsComponent.state("isTourOpen")).toBe(true);
  });
  it("should close the tour", async () => {
    expect.assertions(1);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];
    const presentationsComponent = shallow(
      <Presentations history={historyMock} location={mockedLocation} />
    );

    (presentationsComponent.instance() as Presentations).closeTour();

    expect(presentationsComponent.state("isTourOpen")).toBe(false);
  });
});
