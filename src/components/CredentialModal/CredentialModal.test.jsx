import React from "react";
import { BrowserRouter } from "react-router-dom";
import CredentialModal from "./CredentialModal";
import { mount, shallow } from "../../../enzyme";
import * as mocks from "../../test/mocks/mocks";

describe("credential modal", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const credential = mocks.getVID;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <CredentialModal
          match={mock}
          credential={credential}
          methodToClose={methodToOpen}
          isModalCredentialOpen
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
  it("should open details", () => {
    expect.assertions(1);
    const credential = mocks.getVID;
    const methodToOpen = jest.fn();
    const credentialModalComponent = shallow(
      <CredentialModal
        credential={credential}
        methodToClose={methodToOpen}
        isModalCredentialOpen
      />
    );

    credentialModalComponent.instance().openDetails();

    expect(credentialModalComponent.state("isFullCredentialDisplayed")).toBe(
      true
    );
  });
  it("should close details", () => {
    expect.assertions(1);
    const credential = mocks.getVID;
    const methodToOpen = jest.fn();
    const credentialModalComponent = shallow(
      <CredentialModal
        credential={credential}
        methodToClose={methodToOpen}
        isModalCredentialOpen
      />
    );

    credentialModalComponent.instance().closeDetails();

    expect(credentialModalComponent.state("isFullCredentialDisplayed")).toBe(
      false
    );
  });
});
