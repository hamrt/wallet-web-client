import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import VP from "./VP";

describe("verifiable presentation", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const wrapper = mount(
      <BrowserRouter>
        <VP />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
