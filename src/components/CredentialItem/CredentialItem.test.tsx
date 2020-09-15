import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import * as mocks from "../../test/mocks/mocks";
import CredentialItem from "./CredentialItem";

describe("credential item", () => {
  it("should render without crashing", async () => {
    expect.assertions(1);
    const credential = mocks.getCredential;
    const methodToOpen = jest.fn();
    const wrapper = await render(
      <BrowserRouter>
        <CredentialItem credential={credential} methodToOpen={methodToOpen} />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });
});
