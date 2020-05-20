import React from "react";
import ReactDOM from "react-dom";

describe("app", () => {
  it("should renders without crashing", () => {
    expect.assertions(0);

    jest.isolateModules(() => {
      // Set location to "/wallet" (avoid warnings)
      delete global.window.location;
      global.window = Object.create(window);
      global.window.location = {
        pathname: "/wallet",
        search: "",
        hash: "",
      };

      const div = document.createElement("div");
      // eslint-disable-next-line global-require
      const App = require("./App").default;
      ReactDOM.render(<App />, div);
      ReactDOM.unmountComponentAtNode(div);
    });
  });
});
