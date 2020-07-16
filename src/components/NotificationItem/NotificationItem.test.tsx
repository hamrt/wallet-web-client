import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import * as mocks from "../../test/mocks/mocks";
import NotificationItem from "./NotificationItem";

describe("notification item", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <NotificationItem
          notification={notification}
          methodToOpen={methodToOpen}
        />
      </BrowserRouter>
    );
    expect(wrapper).not.toBeNull();
  });
});
