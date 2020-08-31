import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import CredentialModal from "./CredentialModal";
import * as mocks from "../../test/mocks/mocks";

describe("credential modal", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const credential = mocks.getVID;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <CredentialModal
          credential={credential}
          methodToClose={methodToOpen}
          isModalCredentialOpen
        />
      </BrowserRouter>
    );
    expect(wrapper).not.toBeNull();
    jest.restoreAllMocks();
  });

  it("should open details", async () => {
    expect.assertions(2);
    const credential = mocks.getVID;
    const methodToOpen = jest.fn();
    const credentialModalComponent = mount(
      <CredentialModal
        credential={credential}
        methodToClose={methodToOpen}
        isModalCredentialOpen
      />
    );

    await (credentialModalComponent.instance() as CredentialModal).openDetails();
    expect(credentialModalComponent.state("isFullCredentialDisplayed")).toBe(
      true
    );
    expect(credentialModalComponent.state("name")).toMatch("My Verifiable eID");
    jest.restoreAllMocks();
  });
  it("should close details", () => {
    expect.assertions(2);
    const credential = mocks.getVID;
    const methodToOpen = jest.fn();
    const credentialModalComponent = mount(
      <CredentialModal
        credential={credential}
        methodToClose={methodToOpen}
        isModalCredentialOpen
      />
    );

    (credentialModalComponent.instance() as CredentialModal).closeDetails();

    expect(credentialModalComponent.state("isFullCredentialDisplayed")).toBe(
      false
    );
    expect(credentialModalComponent.state("name")).toMatch("");
    jest.restoreAllMocks();
  });
});
