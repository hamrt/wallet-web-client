import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

describe("app", () => {
  it("should render without crashing", () => {
    expect.assertions(0);
    // Set location to "/wallet" (avoid warnings)
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/wallet",
        hash: "",
        search: "",
      },
      writable: true,
    });

    jest.isolateModules(() => {
      const div = document.createElement("div");
      ReactDOM.render(<App />, div);
      ReactDOM.unmountComponentAtNode(div);
    });
  });
});
