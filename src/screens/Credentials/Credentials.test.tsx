import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import Credentials, { CredentialsStatus } from "./Credentials";
import * as mocks from "../../test/mocks/mocks";
import * as values from "../../test/mocks/values";
import * as idHub from "../../apis/idHub";
import colors from "../../config/colors";

const mockResponse = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    assign: mockResponse,
  },
  writable: true,
});

describe("credentials", () => {
  it("should render without crashing", () => {
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

  it("should have credentialsStatus == 'error' if something is wrong fetching the credentials", async () => {
    expect.assertions(2);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];
    const credentialsComponent = shallow(
      <Credentials history={historyMock} location={mockedLocation} />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockResolvedValue({ status: 400, data: "Error" });

    await (credentialsComponent.instance() as Credentials).getCredentials();

    expect(credentialsComponent.state("credentials")).toHaveLength(0);
    expect(credentialsComponent.state("credentialsStatus")).toStrictEqual(
      CredentialsStatus.Error
    );

    spy.mockRestore();
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

    expect(historyMock.push.mock.calls[1]).toMatchObject(["/login"]);
    jest.restoreAllMocks();
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
    expect.assertions(3);
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
