import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Ribbon } from "./Ribbon";

describe("ribbon", () => {
  it("should render without crashing", () => {
    expect.assertions(0);
    const div = document.createElement("div");
    ReactDOM.render(
      <BrowserRouter>
        <Ribbon />
      </BrowserRouter>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
