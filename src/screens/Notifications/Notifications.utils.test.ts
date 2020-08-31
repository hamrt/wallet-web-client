import SecureEnclave from "../../secureEnclave/SecureEnclave";
import {
  getBodyWithNotificationSigned,
  decryptKeys,
} from "./Notifications.utils";
import * as DataStorage from "../../utils/DataStorage";
import { getSignTransactionNotification } from "../../test/mocks/mocks";
import { NotificationType } from "../../dtos/notifications";
import * as strB64 from "../../utils/strB64dec";

describe("getBodyWithNotificationSigned", () => {
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  const se = SecureEnclave.Instance;

  it("should throw if no DID is found", async () => {
    expect.assertions(1);

    const notificationToSign = { ...getSignTransactionNotification };

    jest.spyOn(DataStorage, "getDID").mockImplementationOnce(() => "");

    await expect(
      getBodyWithNotificationSigned(se, "password", notificationToSign)
    ).rejects.toThrow("User DID not found.");
  });

  it("should throw if type is not 3 or 4", async () => {
    expect.assertions(1);

    const notificationToSign = { ...getSignTransactionNotification };
    notificationToSign.message.notificationType =
      NotificationType.STORE_CREDENTIAL;

    jest
      .spyOn(DataStorage, "getDID")
      .mockImplementationOnce(() => "did:ebsi:0x123");

    await expect(
      getBodyWithNotificationSigned(se, "password", notificationToSign)
    ).rejects.toThrow("types supported are only 3 and 4");
  });

  it("should throw handle notifications of type 3", async () => {
    expect.assertions(1);

    const notificationToSign = { ...getSignTransactionNotification };
    notificationToSign.message.notificationType = NotificationType.SIGN_PAYLOAD;

    jest
      .spyOn(DataStorage, "getDID")
      .mockImplementationOnce(() => "did:ebsi:0x123");

    jest
      .spyOn(SecureEnclave.Instance, "signJwt")
      .mockImplementationOnce(async () => Promise.resolve("signedData"));

    const res = await getBodyWithNotificationSigned(
      se,
      "password",
      notificationToSign
    );

    expect(res).toStrictEqual({ signature: "signedData" });
  });

  it("should throw handle notifications of type 4", async () => {
    expect.assertions(1);

    const notificationToSign = { ...getSignTransactionNotification };
    notificationToSign.message.notificationType = NotificationType.SIGN_TX;

    jest
      .spyOn(DataStorage, "getDID")
      .mockImplementationOnce(() => "did:ebsi:0x123");

    jest
      .spyOn(strB64, "strB64dec")
      .mockImplementationOnce(() => JSON.stringify(""));

    jest
      .spyOn(SecureEnclave.Instance, "signTx")
      .mockImplementationOnce(async () => Promise.resolve("signedData"));

    const res = await getBodyWithNotificationSigned(
      se,
      "password",
      notificationToSign
    );

    expect(res).toStrictEqual({ signature: "signedData" });
  });
});

describe("decryptKeys", () => {
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  const se = SecureEnclave.Instance;

  it("should throw an error if something wrong happens", async () => {
    expect.assertions(1);

    const error = new Error("error");

    jest
      .spyOn(SecureEnclave.Instance, "restoreWallet")
      .mockImplementationOnce(async () => Promise.reject(error));

    await expect(decryptKeys(se, "password")).rejects.toThrow(
      "Can't decrypt the keys. Make sure you entered the correct password!"
    );
  });
});
