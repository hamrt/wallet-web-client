import React from "react";
import { BrowserRouter } from "react-router-dom";
import Terms from "./Terms";
import * as DataStorage from "../../utils/DataStorage";
import { mount, shallow } from "../../../enzyme";

describe("terms", () => {
  const assignMock = jest.fn();
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    assignMock.mockClear();
  });
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mockedHistory = [];
    const mockedLocation = { search: jest.fn() };
    const wrapper = mount(
      <BrowserRouter>
        <Terms history={mockedHistory} location={mockedLocation} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should go to the login page if the terms has already been accepted", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: jest.fn() };
    const termsComponent = shallow(
      <Terms history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(DataStorage, "getTerms");
    spy.mockReturnValue(true);
    termsComponent.instance().goToLoginIfAlreadyAccepted();

    expect(historyMock.push.mock.calls[0]).toMatchObject(["/login"]);
    spy.mockRestore();
  });

  it("should stay in the same page the first time is opened", () => {
    expect.assertions(1);
    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: jest.fn() };
    const termsComponent = shallow(
      <Terms history={historyMock} location={mockedLocation} />
    );
    const spy = jest.spyOn(DataStorage, "getTerms");
    spy.mockReturnValue(false);
    termsComponent.instance().goToLoginIfAlreadyAccepted();

    expect(historyMock.push.mock.calls[0]).toBeUndefined();
    spy.mockRestore();
  });

  it("should go to the login page when click the button Submit and the checkbox has been selected", () => {
    expect.assertions(1);

    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: jest.fn() };
    const termsComponent = shallow(
      <Terms history={historyMock} location={mockedLocation} />
    );

    termsComponent.setState({ areTermsAccepted: true });
    termsComponent.instance().onSubmitClick();

    expect(historyMock.push.mock.calls[0]).toMatchObject(["/login"]);
  });

  it("should stay in the same screen when click the button Submit and the checkbox has not been selected", () => {
    expect.assertions(1);

    const mockedHistory = { push: jest.fn() };
    const mockedLocation = { search: jest.fn() };
    const termsComponent = shallow(
      <Terms history={mockedHistory} location={mockedLocation} />
    );

    termsComponent.setState({ areTermsAccepted: false });
    termsComponent.instance().onSubmitClick();

    expect(mockedHistory.push.mock.calls[1]).toBeUndefined();
  });

  it("should change correctly the state when checkbox is selected", () => {
    expect.assertions(2);

    const mockedHistory = {};
    const mockedLocation = { search: jest.fn() };
    const termsComponent = shallow(
      <Terms history={mockedHistory} location={mockedLocation} />
    );

    termsComponent.setState({ areTermsAccepted: true });
    termsComponent.instance().onChange();
    expect(termsComponent.state("areTermsAccepted")).toBe(false);

    termsComponent.setState({ areTermsAccepted: false });
    termsComponent.instance().onChange();
    expect(termsComponent.state("areTermsAccepted")).toBe(true);
  });

  it("should have the value of the termsAccepted false, when click the button Cancel", () => {
    expect.assertions(1);
    const mockedLocation = { search: jest.fn() };
    delete window.location;
    window.location = { reload: assignMock };
    const mockedHistory = {};
    const termsComponent = shallow(
      <Terms history={mockedHistory} location={mockedLocation} />
    );

    termsComponent.instance().onCancelClick();
    expect(termsComponent.state("areTermsAccepted")).toBe(false);
  });
});
