import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import VID from "./VID";
import vid from "../../../test/mocks/verifiableid.json";

describe("verifiableid", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const data = vid;
    const wrapper = mount(
      <BrowserRouter>
        <VID data={data} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
