import React from "react";
import { BrowserRouter } from "react-router-dom";
import ToastEbsi from "./ToastEbsi";
import { mount } from "../../../enzyme";
import colors from "../../config/colors";

describe("ebsi toast", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const method = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <ToastEbsi
          match={mock}
          isToastOpen
          toastColor={colors.EC_RED}
          colorText={colors.WHITE}
          toastMessage="Message"
          methodToClose={method}
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
});
