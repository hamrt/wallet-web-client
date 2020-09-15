import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { EbsiBanner } from "./EbsiBanner";

describe("ebsi banner", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const wrapper = render(
      <BrowserRouter>
        <EbsiBanner title="Title" subtitle="Subtitle" isLoadingOpen />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });
});
