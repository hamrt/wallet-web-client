import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import TermsConditions from "./TermsConditions";

describe("termsConditions renders", () => {
  it("termsConditions should renders without crashing", () => {
    expect.assertions(1);
    const history: never[] = [];
    const wrapper = mount(
      <BrowserRouter>
        <TermsConditions history={history} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
