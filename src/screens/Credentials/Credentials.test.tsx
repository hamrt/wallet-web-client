import React from "react";
import { BrowserRouter } from "react-router-dom";
import {
  render,
  fireEvent,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Credentials } from "./Credentials";
import * as mocks from "../../test/mocks/mocks";
import * as values from "../../test/mocks/values";
import * as idHub from "../../apis/idHub";
import * as DataStorage from "../../utils/DataStorage";
import * as JWTHandler from "../../utils/JWTHandler";

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
    const wrapper = render(
      <BrowserRouter>
        <Credentials location={mockedLocation} history={mockedHistory} />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });

  it("should get all the credentials and generate a CredentialItem for each one", async () => {
    expect.assertions(3);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];

    jest
      .spyOn(DataStorage, "connectionNotEstablished")
      .mockImplementationOnce(() => false);
    jest
      .spyOn(JWTHandler, "isTokenExpired")
      .mockImplementationOnce(() => false);
    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockResolvedValue({ status: 200, data: mocks.getCredentials });

    const { getByText } = render(
      <BrowserRouter>
        <Credentials history={historyMock} location={mockedLocation} />
      </BrowserRouter>
    );

    // Display a loader until credentials are loaded
    expect(getByText("Loading...")).toBeDefined();

    await act(() => Promise.resolve());

    // Now the credentials should be loaded
    expect(spy).toHaveBeenCalledTimes(1);
    expect(getByText("Issued By:")).toBeDefined();

    spy.mockRestore();
    jest.restoreAllMocks();
  });

  it("should have credentialsStatus == 'error' if something goes wrong while fetching the credentials", async () => {
    expect.assertions(3);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];

    jest
      .spyOn(DataStorage, "connectionNotEstablished")
      .mockImplementationOnce(() => false);
    jest
      .spyOn(JWTHandler, "isTokenExpired")
      .mockImplementationOnce(() => false);
    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockResolvedValue({ status: 400, data: "Error" });

    const { getByText, getAllByText } = render(
      <BrowserRouter>
        <Credentials history={historyMock} location={mockedLocation} />
      </BrowserRouter>
    );

    // Display a loader until credentials are loaded
    expect(getByText("Loading...")).toBeDefined();

    await act(() => Promise.resolve());

    // Now an error is displayed
    expect(spy).toHaveBeenCalledTimes(1);
    expect(getAllByText("Error")).toBeDefined();

    spy.mockRestore();
    jest.restoreAllMocks();
  });

  it("should retrieve and display the credential", async () => {
    expect.assertions(5);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];

    jest
      .spyOn(DataStorage, "connectionNotEstablished")
      .mockImplementationOnce(() => false);
    jest
      .spyOn(JWTHandler, "isTokenExpired")
      .mockImplementationOnce(() => false);
    const getCredentialsSpy = jest.spyOn(idHub, "getCredentials");
    getCredentialsSpy.mockResolvedValue({
      status: 200,
      data: mocks.getCredentials,
    });

    const { getByText, findByText, getByRole, getAllByRole } = render(
      <BrowserRouter>
        <Credentials history={historyMock} location={mockedLocation} />
      </BrowserRouter>
    );

    // Display a loader until credentials are loaded
    expect(getByText("Loading...")).toBeDefined();
    await act(() => Promise.resolve());

    await expect(findByText("My Verifiable eID")).resolves.toBeDefined();

    expect(getCredentialsSpy).toHaveBeenCalledTimes(1);

    // Click on credential
    const getCredentialSpy = jest.spyOn(idHub, "getCredential");
    getCredentialSpy.mockResolvedValue({
      status: 200,
      data: mocks.getCredential,
    });

    const credentialItemLink = getByRole("link", { name: "My Verifiable eID" });
    fireEvent.click(credentialItemLink);

    // Check that the credential is now displayed
    await expect(findByText("Person Identifier")).resolves.toBeDefined();
    expect(getByText("BE/BE/02635542Y")).toBeDefined();

    // The user clicks on "Close"
    const closeButton = getAllByRole("button", { name: "Close" });
    fireEvent.click(closeButton[0]);

    await waitForElementToBeRemoved(document.querySelector('[role="dialog"]'));

    getCredentialSpy.mockRestore();
    getCredentialsSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it("should call the method openToast if something is wrong retrieven the credential", async () => {
    expect.assertions(4);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];

    jest
      .spyOn(DataStorage, "connectionNotEstablished")
      .mockImplementationOnce(() => false);
    jest
      .spyOn(JWTHandler, "isTokenExpired")
      .mockImplementationOnce(() => false);
    const getCredentialsSpy = jest.spyOn(idHub, "getCredentials");
    getCredentialsSpy.mockResolvedValue({
      status: 200,
      data: mocks.getCredentials,
    });

    const { getByText, findByText, getByRole, getAllByRole } = render(
      <BrowserRouter>
        <Credentials history={historyMock} location={mockedLocation} />
      </BrowserRouter>
    );

    // Display a loader until credentials are loaded
    expect(getByText("Loading...")).toBeDefined();
    await act(() => Promise.resolve());

    await expect(findByText("My Verifiable eID")).resolves.toBeDefined();

    expect(getCredentialsSpy).toHaveBeenCalledTimes(1);

    // Click on credential
    const getCredentialSpy = jest.spyOn(idHub, "getCredential");
    getCredentialSpy.mockResolvedValue({ status: 400, data: "Error" });

    const credentialItemLink = getByRole("link", { name: "My Verifiable eID" });
    fireEvent.click(credentialItemLink);

    // Check that the toast text is displayed
    await expect(
      findByText(`${values.errorGettingTheCredential} Error`)
    ).resolves.toBeDefined();

    // Close toast
    const closeButton = getAllByRole("button", { name: "Close" }).filter(
      (e: HTMLElement) => e.getAttribute("data-dismiss") === "toast"
    );
    fireEvent.click(closeButton[0]);

    await waitForElementToBeRemoved(document.querySelector('[role="alert"]'));

    getCredentialsSpy.mockRestore();
    getCredentialSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it("redirect to / if retrieving the credential returns 404", async () => {
    expect.assertions(4);
    const historyMock = { push: jest.fn() };
    const mockedLocation: any[] = [];

    jest
      .spyOn(DataStorage, "connectionNotEstablished")
      .mockImplementationOnce(() => false);
    jest
      .spyOn(JWTHandler, "isTokenExpired")
      .mockImplementationOnce(() => false);
    const getCredentialsSpy = jest.spyOn(idHub, "getCredentials");
    getCredentialsSpy.mockResolvedValue({
      status: 200,
      data: mocks.getCredentials,
    });

    const { getByText, findByText, getByRole } = render(
      <BrowserRouter>
        <Credentials history={historyMock} location={mockedLocation} />
      </BrowserRouter>
    );

    // Display a loader until credentials are loaded
    expect(getByText("Loading...")).toBeDefined();
    await act(() => Promise.resolve());

    await expect(findByText("My Verifiable eID")).resolves.toBeDefined();

    expect(getCredentialsSpy).toHaveBeenCalledTimes(1);

    // Click on credential
    const getCredentialSpy = jest.spyOn(idHub, "getCredential");
    getCredentialSpy.mockResolvedValue({ status: 404, data: "Error" });

    const credentialItemLink = getByRole("link", { name: "My Verifiable eID" });
    fireEvent.click(credentialItemLink);

    await act(() => Promise.resolve());

    expect(historyMock.push).toHaveBeenCalledWith("/");

    getCredentialsSpy.mockRestore();
    getCredentialSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it("should display the tour", async () => {
    expect.assertions(5);
    const historyMock: any[] = [];
    const mockedLocation: any[] = [];

    jest
      .spyOn(DataStorage, "connectionNotEstablished")
      .mockImplementationOnce(() => false);
    jest
      .spyOn(JWTHandler, "isTokenExpired")
      .mockImplementationOnce(() => false);
    const getCredentialsSpy = jest.spyOn(idHub, "getCredentials");
    getCredentialsSpy.mockResolvedValue({
      status: 200,
      data: mocks.getCredentials,
    });

    const { queryByText, findByText, getByTitle } = render(
      <BrowserRouter>
        <Credentials history={historyMock} location={mockedLocation} />
      </BrowserRouter>
    );

    // Display a loader until credentials are loaded
    expect(queryByText("Loading...")).toBeDefined();
    await act(() => Promise.resolve());

    await expect(findByText("My Verifiable eID")).resolves.toBeDefined();

    expect(getCredentialsSpy).toHaveBeenCalledTimes(1);

    // Click on tour
    const tourButton = getByTitle("Open guided tour");
    fireEvent.click(tourButton);

    await act(() => Promise.resolve());

    // Check that the tour is displayed
    expect(queryByText("You will see here your credentials.")).toBeDefined();

    // Close tour
    const closeTourButton = window.document.querySelector(
      "button.reactour__close"
    );

    if (!closeTourButton) throw new Error("unable to find close button");

    fireEvent.click(closeTourButton);
    await act(() => Promise.resolve());

    expect(queryByText("You will see here your credentials.")).toBeNull();

    getCredentialsSpy.mockRestore();
    jest.restoreAllMocks();
  });
});
