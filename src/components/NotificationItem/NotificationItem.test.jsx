import React from "react";
import { BrowserRouter } from "react-router-dom";
import NotificationItem from "./NotificationItem";
import { mount, shallow } from "../../../enzyme";
import * as mocks from "../../test/mocks/mocks";
import * as values from "../../test/mocks/values";

describe("notification item", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <NotificationItem
          match={mock}
          notification={notification}
          methodToOpen={methodToOpen}
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
  it("should get the proper emisor name", () => {
    expect.assertions(2);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const credentialItemComponent = shallow(
      <NotificationItem
        notification={notification}
        methodToOpen={methodToOpen}
      />
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
});
