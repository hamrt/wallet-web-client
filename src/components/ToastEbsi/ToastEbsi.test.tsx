import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import ToastEbsi from "./ToastEbsi";
import colors from "../../config/colors";

describe("ebsi toast", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const method = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <ToastEbsi
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
