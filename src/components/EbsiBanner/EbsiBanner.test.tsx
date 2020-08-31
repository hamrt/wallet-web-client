import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import EbsiBanner from "./EbsiBanner";

describe("ebsi banner", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const wrapper = mount(
      <BrowserRouter>
        <EbsiBanner title="Title" subtitle="Subtitle" isLoadingOpen />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
