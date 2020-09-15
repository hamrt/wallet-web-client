import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";
import { DidAuth } from "./DidAuth";

describe("did auth", () => {
  it("should render without crashing", () => {
    expect.assertions(1);

    const wrapper = render(
      <BrowserRouter>
        <DidAuth />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should open a modal when the user clicks on 'Authorize' button", () => {
    expect.assertions(2);

    const { getByRole } = render(
      <BrowserRouter>
        <DidAuth />
      </BrowserRouter>
    );

    // There should be no dialog
    expect(() => getByRole("dialog")).toThrow();

    // Click on Authorize
    const authorizeButton = getByRole("button", { name: "Authorize" });
    fireEvent.click(authorizeButton);

    // The dialog should have been added to the DOM
    expect(() => getByRole("dialog")).toBeDefined();
  });
});
