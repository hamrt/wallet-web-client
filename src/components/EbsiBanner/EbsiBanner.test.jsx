import React from "react";
import { BrowserRouter } from "react-router-dom";
import EbsiBanner from "./EbsiBanner";
import { mount } from "../../../enzyme";

describe("ebsi banner", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const method = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <EbsiBanner
          match={mock}
          title="Title"
          subtitle="Subtitle"
          shouldAskToDecryptKey={false}
          openModalAskingPass={method}
          isLoadingOpen
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
