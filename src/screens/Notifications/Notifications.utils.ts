import { providers } from "ethers";
import { getDID, getKeys } from "../../utils/DataStorage";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import { strB64dec } from "../../utils/strB64dec";
import { INotification, NotificationsOptions } from "../../dtos/notifications";
import { IWalletOptions } from "../../secureEnclave/UserWallet";

export const getBodyWithNotificationSigned = async (
  secureEnclave: SecureEnclave,
  userPassword: string,
  notificationToSign: INotification
): Promise<NotificationsOptions> => {
  let body: NotificationsOptions = {};
  let signData: string;
  let txJSON: providers.TransactionRequest;
  const dataDecoded = strB64dec(notificationToSign.message.data.base64);
  const type = notificationToSign.message.notificationType;
  const did = getDID();
  if (!did) throw new Error("User DID not found.");
  switch (type) {
    case 3:
      signData = await secureEnclave.signJwt(
        did,
        Buffer.from(dataDecoded),
        userPassword
      );
      body = {
        signature: signData,
      };
      break;
    case 4:
      txJSON = JSON.parse(dataDecoded);
      signData = await secureEnclave.signTx(did, txJSON, userPassword);
      body = {
        signature: signData,
      };
      break;
    default:
      throw new Error(`types supported are only 3 and 4`);
  }
  return body;
};

export const decryptKeys = async (se: SecureEnclave, userPassword: string) => {
  const options: IWalletOptions = {
    encryptedKey: getKeys() || "",
    password: userPassword,
  };

  try {
    await se.restoreWallet(options);
  } catch (e) {
    throw new Error(
      "Can't decrypt the keys. Make sure you entered the correct password!"
    );
  }
};
