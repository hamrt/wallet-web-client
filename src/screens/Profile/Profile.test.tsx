import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import Profile from "./Profile";
import * as DataStorage from "../../utils/DataStorage";
import * as mocks from "../../test/mocks/mocks";
import * as wallet from "../../apis/wallet";
import * as idHub from "../../apis/idHub";

describe("profile renders", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
  });
  it("profile should render without crashing", () => {
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
});

describe("auxiliar methods for profile", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
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
