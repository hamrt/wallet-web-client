import React from "react";
import { BrowserRouter } from "react-router-dom";
import CredentialItem from "./CredentialItem";
import { mount, shallow } from "../../../enzyme";
import * as mocks from "../../test/mocks/mocks";
import * as values from "../../test/mocks/values";

describe("credential item", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const credential = mocks.getCredential;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <CredentialItem
          match={mock}
          credential={credential}
          methodToOpen={methodToOpen}
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
  it("should get the proper emisor name", () => {
    expect.assertions(2);
    const credential = mocks.getCredential;
    const methodToOpen = jest.fn();
    const credentialItemComponent = shallow(
      <CredentialItem credential={credential} methodToOpen={methodToOpen} />
    );

    const name = credentialItemComponent
      .instance()
      .getEmisorName(mocks.didGovernment);
    const nameNotFound = credentialItemComponent
      .instance()
      .getEmisorName(mocks.didFake);

    expect(name).toBe(values.sampleIssuer);
    expect(nameNotFound).toBe(mocks.didFake);
  });

  it("should get the proper issuer name for a credential", () => {
    expect.assertions(1);
    const credential = mocks.getCredential;
    const methodToOpen = jest.fn();
    const credentialItemComponent = shallow(
      <CredentialItem credential={credential} methodToSelect={methodToOpen} />
    );

    const name = credentialItemComponent.instance().getIssuer(credential);

    expect(name).toBe("Sample Verifiable ID Issuer");
  });

  it("should get the proper did issuer for a credential VP", () => {
    expect.assertions(1);
    const credential = mocks.getCredentialVP;
    const methodToOpen = jest.fn();
    const credentialItemComponent = shallow(
      <CredentialItem credential={credential} methodToSelect={methodToOpen} />
    );

    const name = credentialItemComponent.instance().getIssuer(credential);

    expect(name).toBe("did:ebsi:0x111111");
  });
});
