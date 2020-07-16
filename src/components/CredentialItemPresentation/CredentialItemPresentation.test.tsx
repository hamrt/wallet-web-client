import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import CredentialItemPresentation from "./CredentialItemPresentation";
import * as mocks from "../../test/mocks/mocks";

describe("credential item presentation", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const credential = mocks.getCredential;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <CredentialItemPresentation
          credential={credential}
          methodToSelect={methodToOpen}
        />
      </BrowserRouter>
    );
    expect(wrapper).not.toBeNull();
  });
});
