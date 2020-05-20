import React from "react";
import { BrowserRouter } from "react-router-dom";
import NotificationModal from "./NotificationModal";
import { mount, shallow } from "../../../enzyme";
import * as mocks from "../../test/mocks/mocks";
import * as idHub from "../../apis/idHub";

describe("notification modal", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <NotificationModal
          match={mock}
          notification={notification}
          methodToClose={methodToOpen}
          methodToAccept={methodToOpen}
          methodToSign={methodToOpen}
          isModalNotificationOpen
          isAccepting
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });
  it("should open details", () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const credentialModalComponent = shallow(
      <NotificationModal
        notification={notification}
        methodToClose={methodToOpen}
        methodToAccept={methodToOpen}
        methodToSign={methodToOpen}
        isModalNotificationOpen
        isAccepting
      />
    );

    credentialModalComponent.instance().openDetails();

    expect(credentialModalComponent.state("isFullCredentialDisplayed")).toBe(
      true
    );
  });
  it("should close details", () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const credentialModalComponent = shallow(
      <NotificationModal
        notification={notification}
        methodToClose={methodToOpen}
        methodToAccept={methodToOpen}
        methodToSign={methodToOpen}
        isModalNotificationOpen
        isAccepting
      />
    );

    credentialModalComponent.instance().closeDetails();

    expect(credentialModalComponent.state("isFullCredentialDisplayed")).toBe(
      false
    );
  });

  it("should get all the credentials and generate a CredentialItem for each one", async () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const credentialModalComponent = shallow(
      <NotificationModal
        notification={notification}
        methodToClose={methodToOpen}
        methodToAccept={methodToOpen}
        methodToSign={methodToOpen}
        isModalNotificationOpen
        isAccepting
      />
    );

    const spy = jest.spyOn(idHub, "getCredentials");
    spy.mockReturnValue({ status: 200, data: mocks.getCredentialsVP });

    await credentialModalComponent.instance().getCredentials();

    expect(credentialModalComponent.state("credentials")).toHaveLength(1);

    spy.mockRestore();
  });

  it("should add the credential selected into the notification for VPs", async () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const credentialModalComponent = shallow(
      <NotificationModal
        notification={notification}
        methodToClose={methodToOpen}
        methodToAccept={methodToOpen}
        methodToSign={methodToOpen}
        isModalNotificationOpen
        isAccepting
      />
    );

    await credentialModalComponent
      .instance()
      .select(
        "0x52814a963ff4131353445f42ee664bf632502660f718cfbb6fad3e203e7c17c3"
      );

    expect(
      credentialModalComponent.state("notificationForPresentations")
        .selectedCredentials
    ).toHaveLength(1);
  });
});
