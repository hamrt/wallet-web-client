import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { VID } from "./VID";
import vid from "../../../test/mocks/verifiableid.json";

describe("verifiableid", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const data = vid;
    const wrapper = render(
      <BrowserRouter>
        <VID data={JSON.stringify(data)} />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });
});
