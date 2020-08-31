import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import DidAuth from "./DidAuth";

describe("did auth", () => {
  it("should render without crashing", () => {
    expect.assertions(1);

    const wrapper = mount(
      <BrowserRouter>
        <DidAuth />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should open a modal when the user clicks on 'Authorize' button", () => {
    expect.assertions(2);

    const wrapper = mount(
      <BrowserRouter>
        <DidAuth />
      </BrowserRouter>
    );

    // There should be no dialog
    expect(wrapper.find('div[role="dialog"]')).toHaveLength(0);

    // Click on Authorize
    wrapper.find("button").simulate("click");

    // The dialog should have been added to the DOM
    expect(wrapper.find('div[role="dialog"]')).toHaveLength(1);
  });
});
