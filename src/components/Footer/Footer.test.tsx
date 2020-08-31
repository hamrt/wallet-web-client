import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Footer";

describe("footer", () => {
  it("should render without crashing", () => {
    expect.assertions(0);
    const div = document.createElement("div");
    ReactDOM.render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
