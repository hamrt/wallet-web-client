import React from "react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { mount, shallow } from "../../../enzyme";
import * as DataStorage from "../../utils/DataStorage";

describe("login", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();

    const wrapper = mount(
      <BrowserRouter>
        <Login match={mock} location={mock} history={mock} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should go to the terms and conditions page if the terms has already been accepted", () => {
    expect.assertions(1);

    const login = shallow(<Login />);
    const spy = jest.spyOn(DataStorage, "getTerms");
    spy.mockReturnValue(false);
    login.instance().redirectToTermsAndConditionsIfNotAccepted();

    expect(login.find("Redirect")).toHaveLength(1);
    spy.mockRestore();
  });
});
