import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { ToastEbsi } from "./ToastEbsi";
import colors from "../../config/colors";

describe("ebsi toast", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const method = jest.fn();
    const wrapper = render(
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

    expect(wrapper).toBeDefined();
  });
});
