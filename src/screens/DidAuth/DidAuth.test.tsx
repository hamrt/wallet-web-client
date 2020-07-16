import React from "react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { mount, shallow } from "enzyme";
import DidAuth from "./DidAuth";
import * as mocks from "../../test/mocks/mocks";
import * as values from "../../test/mocks/values";

const { didAuth } = mocks;

const mockedLocation: any = {
  search: didAuth,
};
const didAuthComponent = shallow<DidAuth>(
  <DidAuth location={mockedLocation} />
);
const instance = didAuthComponent.instance() as DidAuth;

describe("did auth", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();

    const wrapper = mount(
      <BrowserRouter>
        <DidAuth location={mock} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should call the method didAuth if data is coming form the url", () => {
    expect.assertions(1);
    const didAuthMock = jest
      .spyOn(DidAuth.prototype, "didAuth")
      .mockImplementation();
    instance.componentDidMount();

    expect(didAuthMock).toHaveBeenCalledTimes(1);
    didAuthMock.mockRestore();
  });

  it("should parse correctly the token coming in the url", async () => {
    expect.assertions(4);
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: {
        preferredName: values.sampleIssuer,
      },
    });
    const urlParameters = new URLSearchParams(mocks.didAuth);
    await instance.didAuth(urlParameters);

    expect(didAuthComponent.state("serviceUrl")).toBe(values.serviceUrl);
    expect(didAuthComponent.state("serviceDID")).toBe(values.serviceDID);
    expect(didAuthComponent.state("serviceName")).toBe(values.sampleIssuer);
    expect(didAuthComponent.state("didAuthRequestJwt")).toBe(
      values.didAuthRequestJwt
    );
    jest.restoreAllMocks();
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
    } as any;
    instance.handleChangePass(e);

    expect(didAuthComponent.state("passwordForKeyGeneration")).toBe("1234");
  });
});
