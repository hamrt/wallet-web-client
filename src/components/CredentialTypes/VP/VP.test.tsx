import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { VP } from "./VP";

describe("verifiable presentation", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const wrapper = render(
      <BrowserRouter>
        <VP />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });
});
