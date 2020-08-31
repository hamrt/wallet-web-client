import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Terms from "./Terms";

describe("terms", () => {
  const assignMock = jest.fn();
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    assignMock.mockClear();
  });

  it("should render without crashing", () => {
    expect.assertions(1);

    const wrapper = render(
      <BrowserRouter>
        <Terms>Test</Terms>
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should render the children if the terms have already been accepted", () => {
    expect.assertions(1);

    localStorage.setItem("T&C", "true");
    const { container } = render(
      <BrowserRouter>
        <Terms>Test</Terms>
      </BrowserRouter>
    );

    expect(container).toHaveTextContent("Test");

    localStorage.removeItem("T&C");
  });

  it("should render a form if the terms have not been accepted yet", () => {
    expect.assertions(2);

    const { container } = render(
      <BrowserRouter>
        <Terms>Test</Terms>
      </BrowserRouter>
    );

    // Check that it doesn't render the children
    expect(container).not.toHaveTextContent("Test");

    // Check that it contains the form - if getByTestId doesn't find it, it throws an error
    expect(container.querySelector("form")).not.toBeNull();
  });

  it("should render the children if the terms have been accepted", async () => {
    expect.assertions(2);

    const { container, getByRole, getByLabelText } = render(
      <BrowserRouter>
        <Terms>Test</Terms>
      </BrowserRouter>
    );

    // Click on "Continue without accepting"
    const submitButton = getByRole("button", { name: "Continue" });
    fireEvent.click(submitButton);

    // https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    await act(() => Promise.resolve());

    // Check that the children are rendered now
    expect(container).toHaveTextContent(
      "You must agree to the Terms and Conditions before continuing."
    );

    // Accept the terms and submit
    const checkboxLabel = getByLabelText("I agree to the Terms and Conditions");
    fireEvent.click(checkboxLabel);
    fireEvent.click(submitButton);

    // https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    await act(() => Promise.resolve());

    // Check that the children are rendered now
    expect(container).toHaveTextContent("Test");
  });
});
