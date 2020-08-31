import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, fireEvent, act } from "@testing-library/react";
import TermsConditions from "./TermsConditions";

describe("termsConditions", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const history: never[] = [];
    const wrapper = render(
      <BrowserRouter>
        <TermsConditions history={history} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should navigate back when user click on 'Back'", async () => {
    expect.assertions(1);

    const history = createMemoryHistory();
    history.push("/some-route");
    history.push("/some-other-route");

    const historySpy = jest.spyOn(history, "goBack");

    const { getByRole } = render(
      <BrowserRouter>
        <TermsConditions history={history} />
      </BrowserRouter>
    );

    const backButton = getByRole("button", { name: "Back" });
    fireEvent.click(backButton);
    await act(() => Promise.resolve());

    expect(historySpy).toHaveBeenCalledTimes(1);
  });
});
