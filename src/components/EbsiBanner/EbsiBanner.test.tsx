import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import EbsiBanner from "./EbsiBanner";

describe("ebsi banner", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const method = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <EbsiBanner
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
