import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";

describe("header", () => {
  const assignMock = jest.fn();
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    assignMock.mockClear();
  });

  it("should renders without crashing", () => {
    expect.assertions(0);
    const div = document.createElement("div");
    ReactDOM.render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it("should have deleted session storage after logout", () => {
    expect.assertions(1);

    delete window.location;
    window.location = { assign: assignMock };

    const header = new Header();
    header.doLogOut();
    expect(sessionStorage).toHaveLength(0);
  });
});
