import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import CredentialItemPresentation from "./CredentialItemPresentation";
import * as mocks from "../../test/mocks/mocks";

describe("credential item presentation", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const credential = mocks.getCredential;
    const methodToOpen = jest.fn();
    const wrapper = render(
      <BrowserRouter>
        <CredentialItemPresentation
          credential={credential}
          methodToSelect={methodToOpen}
          defaultChecked={false}
        />
      </BrowserRouter>
    );
    expect(wrapper).toBeDefined();
  });
});
