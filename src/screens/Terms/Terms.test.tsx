import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import Terms from "./Terms";
import * as DataStorage from "../../utils/DataStorage";

describe("terms", () => {
  const assignMock = jest.fn();
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    assignMock.mockClear();
  });
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mockedHistory: any[] = [];
    const mockedLocation = { search: jest.fn() };
    const wrapper = mount(
      <BrowserRouter>
        <Terms history={mockedHistory} location={mockedLocation} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should stay in the same screen when click the button Submit and the checkbox has not been selected", () => {
    expect.assertions(1);

    const mockHistory = { push: jest.fn() };
    const mockedLocation = { search: jest.fn() };
    const termsComponent = shallow(
      <Terms history={mockHistory} location={mockedLocation} />
    );

    termsComponent.setState({ areTermsAccepted: false });
    (termsComponent.instance() as Terms).onSubmitClick();
    expect(mockHistory.push).toHaveBeenCalledTimes(0);
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
    (termsComponent.instance() as Terms).goToLoginIfAlreadyAccepted();

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
    (termsComponent.instance() as Terms).goToLoginIfAlreadyAccepted();

    expect(historyMock.push).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });

  it("should change correctly the state when checkbox is selected", () => {
    expect.assertions(2);

    const mockedHistory = {};
    const mockedLocation = { search: jest.fn() };
    const termsComponent = shallow(
      <Terms history={mockedHistory} location={mockedLocation} />
    );

    termsComponent.setState({ areTermsAccepted: true });
    (termsComponent.instance() as Terms).onChange();
    expect(termsComponent.state("areTermsAccepted")).toBe(false);

    termsComponent.setState({ areTermsAccepted: false });
    (termsComponent.instance() as Terms).onChange();
    expect(termsComponent.state("areTermsAccepted")).toBe(true);
  });

  it("should go to the login page when click the button Submit and the checkbox has been selected", () => {
    expect.assertions(1);

    const historyMock = { push: jest.fn() };
    const mockedLocation = { search: jest.fn() };
    const termsComponent = shallow(
      <Terms history={historyMock} location={mockedLocation} />
    );
    const terms = termsComponent.instance() as Terms;
    const mockLogin = jest
      .spyOn(Terms.prototype, "goToLoginIfAlreadyAccepted")
      .mockImplementation();

    termsComponent.setState({ areTermsAccepted: true });
    terms.onSubmitClick();

    expect(mockLogin).toHaveBeenCalledTimes(1);
    mockLogin.mockRestore();
  });

  it("should have the value of the termsAccepted false, when click the button Cancel", () => {
    expect.assertions(1);
    const mockedLocation = { search: jest.fn() };
    Object.defineProperty(window, "location", {
      value: {
        reload: assignMock,
      },
      writable: true,
    });
    const mockedHistory: any[] = [];
    const termsComponent = shallow(
      <Terms history={mockedHistory} location={mockedLocation} />
    );

    (termsComponent.instance() as Terms).onCancelClick();
    expect(termsComponent.state("areTermsAccepted")).toBe(false);
  });
});
