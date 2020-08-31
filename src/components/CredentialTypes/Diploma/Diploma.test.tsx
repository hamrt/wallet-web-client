import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import Diploma from "./Diploma";
import diploma from "../../../test/mocks/diploma.json";

describe("diploma", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const data = diploma;
    const wrapper = mount(
      <BrowserRouter>
        <Diploma data={data} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
