import axios from "axios";
import { getJWT, getDID } from "../utils/DataStorage";
import REQUIRED_VARIABLES from "../config/env";
import { messages, notifications } from "../dtos";
import errorMessages from "../config/messages";

const API_ID_HUB = REQUIRED_VARIABLES.REACT_APP_ID_HUB_API;
const VERSION = "v1";

async function getCredentials(): Promise<messages.ApiResponse> {
  const authorization = {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  };
  try {
    const response = await axios.get(
      `${API_ID_HUB}/${VERSION}/attributes?did=${getDID()}`,
      authorization
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    const errorData = error.response?.data;
    if (errorData !== undefined) {
      return {
        status: errorData.status,
        data: `${errorData.detail}`,
      };
    }
    return { status: 500, data: "Error" };
  }
}

async function getCredential(hash: string): Promise<messages.ApiResponse> {
  const authorization = {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  };
  try {
    const response = await axios.get(
      `${API_ID_HUB}/${VERSION}/attributes/${hash}`,
      authorization
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    const errorData = error.response?.data;
    if (errorData !== undefined) {
      return {
        status: errorData.status,
        data: `${errorData.detail}`,
      };
    }
    return { status: 500, data: "Error" };
  }
}

async function getCredentialsForPresentation(
  notification: notifications.INotification
): Promise<messages.ApiResponse> {
  const authorization = {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  };

  if (!notification || !notification.dataDecoded) {
    return { status: 500, data: errorMessages.invalidAttribute };
  }

  try {
    let url = `${API_ID_HUB}/${VERSION}/attributes?did=${getDID()}`;
    const arrayTypes = JSON.parse(notification.dataDecoded).type;

    if (Array.isArray(arrayTypes) && arrayTypes.length > 0) {
      const typesAsString = JSON.stringify(arrayTypes);
      const types = encodeURI(typesAsString);
      url = `${url}&type=${types}`;
    }

    const response = await axios.get(url, authorization);
    return { status: response.status, data: response.data };
  } catch (error) {
    const errorData = error.response?.data;
    if (errorData !== undefined) {
      return {
        status: errorData.status,
        data: `${errorData.detail}`,
      };
    }
    return { status: 500, data: "Error" };
  }
}

export { getCredentials, getCredential, getCredentialsForPresentation };
