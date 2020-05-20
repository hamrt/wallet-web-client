import React from "react";
import { BrowserRouter } from "react-router-dom";
import Diploma from "./Diploma";
import { mount } from "../../../../enzyme";

const diploma = require("../../../test/mocks/diploma.json");

describe("diploma", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const data = diploma;
    const wrapper = mount(
      <BrowserRouter>
        <Diploma match={mock} data={data} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
