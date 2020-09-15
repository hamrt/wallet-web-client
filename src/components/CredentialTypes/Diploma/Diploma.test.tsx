import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { Diploma } from "./Diploma";
import diploma from "../../../test/mocks/diploma.json";

describe("diploma", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const wrapper = render(
      <BrowserRouter>
        <Diploma data={diploma} />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });
});
