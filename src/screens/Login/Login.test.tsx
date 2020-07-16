import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import Login from "./Login";
import * as DataStorage from "../../utils/DataStorage";

describe("login", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);

    const wrapper = mount(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should go to the terms and conditions page if the terms has already been accepted", () => {
    expect.assertions(1);

    const login = shallow(<Login />);
    const spy = jest.spyOn(DataStorage, "getTerms");
    spy.mockReturnValue(false);
    (login.instance() as Login).redirectToTermsAndConditionsIfNotAccepted();

    expect(login.find("Redirect")).toHaveLength(1);
    spy.mockRestore();
  });
});
