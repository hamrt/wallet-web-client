import React from "react";
import { BrowserRouter } from "react-router-dom";
import Notifications from "./Notifications";
import { mount, shallow } from "../../../enzyme";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import * as DataStorage from "../../utils/DataStorage";
import * as JWTHandler from "../../utils/JWTHandler";
import * as mocks from "../../test/mocks/mocks";
import * as wallet from "../../apis/wallet";
import * as values from "../../test/mocks/values";
import * as ecas from "../../apis/ecas";
import colors from "../../config/colors";

let notificationsComponent = "";
let instance = "";

describe("notifications renders", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const historyMock = [];
    const mockedLocation = [];
    notificationsComponent = shallow(
      <Notifications history={historyMock} location={mockedLocation} />
    );
    instance = notificationsComponent.instance();
  });

  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
  });

  it("notifications should renders without crashing", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const mockedHistory = [];
    const wrapper = mount(
      <BrowserRouter>
        <Notifications match={mock} location={mock} history={mockedHistory} />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should redirect to login page if it has not a jwt", () => {
    expect.assertions(1);

    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(true);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(false);

    const redirectToMock = jest.spyOn(instance, "redirectTo");
    instance.componentDidMount();

    expect(redirectToMock).toHaveBeenCalledWith("");
    spy.mockRestore();
    spyTokenExpired.mockRestore();
    redirectToMock.mockRestore();
  });

  it("should call the loginLink if page if JWT is expired", () => {
    expect.assertions(1);

    const spy = jest.spyOn(DataStorage, "connectionNotEstablished");
    spy.mockReturnValue(false);

    const spyTokenExpired = jest.spyOn(JWTHandler, "isTokenExpired");
    spyTokenExpired.mockReturnValue(true);

    const loginLinkMock = jest.spyOn(ecas, "loginLink");
    instance.componentDidMount();

    expect(loginLinkMock).toHaveBeenCalledWith();
    spy.mockRestore();
    spyTokenExpired.mockRestore();
    loginLinkMock.mockRestore();
  });

  it("should get all the notifications and generate a NotificationItem for each one", async () => {
    expect.assertions(1);

    const spy = jest.spyOn(wallet, "getNotifications");
    spy.mockReturnValue({ status: 200, data: mocks.getNotifications });

    await instance.getNotifications();

    expect(notificationsComponent.state("notifications")).toHaveLength(2);

    spy.mockRestore();
  });

  it("should decrypt the Keys when click the button Validate", async () => {
    expect.assertions(1);

    instance.passwordForKeyGeneration = {
      current: { value: "1234" },
    };
    instance.setState({ ticketFromUrl: mocks.ticket });

    const decryptKeysMock = jest.spyOn(instance, "decryptKeys");
    const se = SecureEnclave.Instance;

    await instance.onValidateClick();

    expect(decryptKeysMock).toHaveBeenCalledWith(se, "1234");

    decryptKeysMock.mockRestore();
  });

  it("should display a succesfully toast and reload page when accept the notification", async () => {
    expect.assertions(2);

    const spy = jest.spyOn(wallet, "acceptNotification");
    spy.mockReturnValue({ status: 200, data: mocks.acceptNotificationReponse });

    const openSuccessToastMock = jest.spyOn(instance, "openSuccessToast");
    jest.spyOn(window.location, "reload").mockImplementation();

    await instance.acceptNotification(mocks.getNotification);

    expect(openSuccessToastMock).toHaveBeenCalledWith(
      mocks.acceptNotificationReponse.message
    );
    expect(window.location.reload).toHaveBeenCalledWith();
    spy.mockRestore();
    openSuccessToastMock.mockRestore();
  });

  it("should display a error toast when something is wrong accepting the notification", async () => {
    expect.assertions(1);

    const spy = jest.spyOn(wallet, "acceptNotification");
    spy.mockReturnValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(instance, "openToast");

    await instance.acceptNotification(mocks.getNotification);

    expect(openToastMock).toHaveBeenCalledWith(
      `${values.errorAcceptingNotification} Error`
    );

    spy.mockRestore();
    openToastMock.mockRestore();
  });

  it("should display a succesfully toast and reload page when sign a notification", async () => {
    expect.assertions(2);

    const spy = jest.spyOn(wallet, "acceptNotification");
    spy.mockReturnValue({ status: 200, data: mocks.acceptNotificationReponse });

    const spyBody = jest.spyOn(instance, "getBodyWithNotificationSigned");
    spyBody.mockReturnValue(mocks.bodyToSign);

    const openSuccessToastMock = jest.spyOn(instance, "openSuccessToast");
    jest.spyOn(window.location, "reload").mockImplementation();

    const se = SecureEnclave.Instance;
    await instance.signNotification(se, "1234", mocks.getNotificationToSign);

    expect(openSuccessToastMock).toHaveBeenCalledWith(
      mocks.acceptNotificationReponse.message
    );
    expect(window.location.reload).toHaveBeenCalledWith();
    spy.mockRestore();
    openSuccessToastMock.mockRestore();
  });

  it("should display a error toast when something is wrong signing the notification", async () => {
    expect.assertions(1);

    const spy = jest.spyOn(wallet, "acceptNotification");
    spy.mockReturnValue({ status: 400, data: "Error" });

    const openToastMock = jest.spyOn(instance, "openToast");

    const se = SecureEnclave.Instance;
    await instance.signNotification(se, "1234", mocks.getNotificationToSign);

    expect(openToastMock).toHaveBeenCalledWith(
      `${values.errorSigningNotification} Error`
    );

    spy.mockRestore();
    openToastMock.mockRestore();
  });
});

describe("auxiliar methods for notifications", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const historyMock = [];
    const mockedLocation = [];
    notificationsComponent = shallow(
      <Notifications history={historyMock} location={mockedLocation} />
    );
    instance = notificationsComponent.instance();
  });

  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    jest.spyOn(window.location, "assign").mockImplementation();
  });

  it("should open the toast", () => {
    expect.assertions(4);

    instance.openToast("message");

    expect(notificationsComponent.state("isToastOpen")).toBe(true);
    expect(notificationsComponent.state("toastMessage")).toBe("message");
    expect(notificationsComponent.state("isLoadingOpen")).toBe(false);
    expect(notificationsComponent.state("toastColor")).toBe(colors.EC_RED);
  });

  it("should open the modal toast with a success message", () => {
    expect.assertions(4);

    instance.openSuccessToast(values.successMessage);

    expect(notificationsComponent.state("isToastOpen")).toBe(true);
    expect(notificationsComponent.state("toastMessage")).toBe(
      values.successMessage
    );
    expect(notificationsComponent.state("isAccepting")).toBe(false);
    expect(notificationsComponent.state("toastColor")).toBe(colors.EC_GREEN);
  });

  it("should close the toast", () => {
    expect.assertions(1);

    instance.closeToast();

    expect(notificationsComponent.state("isToastOpen")).toBe(false);
  });

  it("should start loading", () => {
    expect.assertions(1);

    notificationsComponent.instance().startLoading();

    expect(notificationsComponent.state("isLoadingOpen")).toBe(true);
  });
  it("should stop loading", () => {
    expect.assertions(1);

    notificationsComponent.instance().stopLoading();

    expect(notificationsComponent.state("isLoadingOpen")).toBe(false);
  });
  it("should open the modal when openModalAskingForPass is called", () => {
    expect.assertions(1);

    notificationsComponent.instance().openModalAskingForPass();

    expect(notificationsComponent.state("isModalAskingForPass")).toBe(true);
  });

  it("should close the modal asking for pass", () => {
    expect.assertions(1);
    notificationsComponent.instance().closeModalAskingForPass();

    expect(notificationsComponent.state("isModalAskingForPass")).toBe(false);
  });

  it("should open the notification", async () => {
    expect.assertions(1);

    const openNotificationModalMock = jest.spyOn(
      notificationsComponent.instance(),
      "openNotificationModal"
    );

    await notificationsComponent
      .instance()
      .openNotification(mocks.getNotification);

    expect(openNotificationModalMock).toHaveBeenCalledWith(
      mocks.getNotification
    );
    openNotificationModalMock.mockRestore();
  });
  it("should open the notification modal", async () => {
    expect.assertions(2);
    await notificationsComponent
      .instance()
      .openNotificationModal(mocks.getNotification);

    expect(notificationsComponent.state("isModalNotificationOpen")).toBe(true);
    expect(notificationsComponent.state("notification")).toBe(
      mocks.getNotification
    );
    // spy.mockRestore();
  });
  it("should close the notification modal", async () => {
    expect.assertions(1);

    notificationsComponent.instance().closeNotificationModal();

    expect(notificationsComponent.state("isModalNotificationOpen")).toBe(false);
  });
  it("should open the tour", async () => {
    expect.assertions(1);

    notificationsComponent.instance().openTour();

    expect(notificationsComponent.state("isTourOpen")).toBe(true);
  });
  it("should close the tour", async () => {
    expect.assertions(1);

    notificationsComponent.instance().closeTour();

    expect(notificationsComponent.state("isTourOpen")).toBe(false);
  });
});
