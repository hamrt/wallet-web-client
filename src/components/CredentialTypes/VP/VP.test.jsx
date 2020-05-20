import React from "react";
import { BrowserRouter } from "react-router-dom";
import VP from "./VP";
import { mount } from "../../../../enzyme";

// const vp = require("../../../test/mocks/presentation.json");

describe("verifiable presentation", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <VP match={mock} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
