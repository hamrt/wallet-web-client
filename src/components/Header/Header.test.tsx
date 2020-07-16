import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";

describe("header", () => {
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
    const assignMock = jest.fn();
    Object.defineProperty(window, "location", {
      value: {
        assign: assignMock,
      },
      writable: true,
    });

    const headerComponent = shallow(<Header />);
    (headerComponent.instance() as Header).doLogOut();

    expect(sessionStorage).toHaveLength(0);
  });
});
