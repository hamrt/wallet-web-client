import React from "react";
import { BrowserRouter } from "react-router-dom";
import DidAuth from "./DidAuth";
import { mount, shallow } from "../../../enzyme";
import * as mocks from "../../test/mocks/mocks";
import * as values from "../../test/mocks/values";

let didAuthComponent = "";
let instance = "";

describe("did auth", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const { didAuth } = mocks;
    const historyMock = [];
    const mockedLocation = { search: didAuth };
    didAuthComponent = shallow(
      <DidAuth history={historyMock} location={mockedLocation} />
    );
    instance = didAuthComponent.instance();
  });

  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();

    const wrapper = mount(
      <BrowserRouter>
        <DidAuth match={mock} location={mock} history={mock} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should call the method didAuth if data is coming form the url", () => {
    expect.assertions(1);
    const didAuthMock = jest.spyOn(instance, "didAuth");
    instance.componentDidMount();

    expect(didAuthMock).toHaveBeenCalledWith(values.didAuth);
    didAuthMock.mockRestore();
  });

  it("should parse correctly the token coming in the url", () => {
    expect.assertions(4);

    instance.didAuth(values.didAuth);

    expect(didAuthComponent.state("serviceUrl")).toBe(values.serviceUrl);
    expect(didAuthComponent.state("serviceDID")).toBe(values.serviceDID);
    expect(didAuthComponent.state("serviceName")).toBe("-");
    expect(didAuthComponent.state("didAuthRequestJwt")).toBe(
      values.didAuthRequestJwt
    );
  });

  it("should open the modal asking for password when authorize", () => {
    expect.assertions(1);
    const openModalAskingPassMock = jest.spyOn(instance, "openModalAskingPass");
    instance.authorize();

    expect(openModalAskingPassMock).toHaveBeenCalledWith();
    openModalAskingPassMock.mockRestore();
  });
});

describe("auxiliar methods for didAuth", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const historyMock = [];
    const mockedLocation = [];
    didAuthComponent = shallow(
      <DidAuth history={historyMock} location={mockedLocation} />
    );
    instance = didAuthComponent.instance();
  });

  it("should open the modal when openModalAskingForPass is called", () => {
    expect.assertions(1);

    instance.openModalAskingPass();

    expect(didAuthComponent.state("isModalAskingForPass")).toBe(true);
  });

  it("should close the modal asking for pass", () => {
    expect.assertions(1);
    instance.closeModalAskingPass();

    expect(didAuthComponent.state("isModalAskingForPass")).toBe(false);
  });

  it("should change the password", () => {
    expect.assertions(1);
    const e = {
      target: {
        value: "1234",
      },
    };
    instance.handleChangePass(e);

    expect(didAuthComponent.state("passwordForKeyGeneration")).toBe("1234");
  });

  it("should get the proper emisor name", () => {
    expect.assertions(2);

    const name = instance.getEmisorName(mocks.didGovernment);
    const nameNotFound = instance.getEmisorName(mocks.didFake);

    expect(name).toBe(values.sampleIssuer);
    expect(nameNotFound).toBe("-");
  });
});
