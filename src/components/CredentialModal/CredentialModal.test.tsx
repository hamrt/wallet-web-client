import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, act } from "@testing-library/react";

import CredentialModal from "./CredentialModal";
import * as mocks from "../../test/mocks/mocks";

describe("credential modal", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const credential = mocks.getVID;
    const methodToOpen = jest.fn();
    const wrapper = render(
      <BrowserRouter>
        <CredentialModal
          credential={credential}
          methodToClose={methodToOpen}
          isModalCredentialOpen
        />
      </BrowserRouter>
    );
    expect(wrapper).toBeDefined();
    jest.restoreAllMocks();
  });

  it("should open and close the details", async () => {
    expect.assertions(4);
    const credential = mocks.getVID;
    const methodToOpen = jest.fn();
    const { getByRole, getByText } = render(
      <CredentialModal
        credential={credential}
        methodToClose={methodToOpen}
        isModalCredentialOpen
      />
    );

    // Click on "Open details"
    const openDtailsButton = getByRole("button", { name: "Open Details" });
    fireEvent.click(openDtailsButton);
    await act(() => Promise.resolve());
    // Details has "My Verifiable eID" as title and shows JSON-like text
    expect(getByText("My Verifiable eID")).toBeDefined();
    expect(getByText("personIdentifier")).toBeDefined();

    // Click on "Close details"
    const closeDtailsButton = getByRole("button", { name: "Close Details" });
    fireEvent.click(closeDtailsButton);
    await act(() => Promise.resolve());
    expect(() => getByText("My Verifiable eID")).toThrow();
    expect(getByText("Person Identifier")).toBeDefined();

    jest.restoreAllMocks();
  });
});
