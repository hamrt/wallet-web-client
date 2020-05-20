import React from "react";
import { BrowserRouter } from "react-router-dom";
import TermsConditions from "./TermsConditions";
import { mount } from "../../../enzyme";

describe("termsConditions renders", () => {
  it("termsConditions should renders without crashing", () => {
    expect.assertions(1);
    const mockedHistory = [];
    const wrapper = mount(
      <BrowserRouter>
        <TermsConditions history={mockedHistory} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
