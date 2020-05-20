import React from "react";
import { BrowserRouter } from "react-router-dom";
import VID from "./VID";
import { mount } from "../../../../enzyme";

const vid = require("../../../test/mocks/verifiableid.json");

describe("verifiableid", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const data = vid;
    const wrapper = mount(
      <BrowserRouter>
        <VID match={mock} data={data} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
