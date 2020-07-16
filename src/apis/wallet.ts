import axios from "axios";
import { getJWT } from "../utils/DataStorage";
import REQUIRED_VARIABLES from "../config/env";
import * as config from "../config/config";
import { messages, notifications } from "../dtos";

const API_URL = REQUIRED_VARIABLES.REACT_APP_WALLET_API;
const VERSION = "v1";

const establishBond = async (token: string): Promise<messages.apiResponse> => {
  const body = {
    grantType: config.grantType,
    assertion: token,
    scope: config.scope,
  };
  try {
    const response = await axios.post(`${API_URL}/${VERSION}/sessions`, body);
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
};

const getNotifications = async (
  token: string
): Promise<messages.apiResponse> => {
  const authorization = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${API_URL}/${VERSION}/notifications/`,
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
};

const acceptNotification = async (
  idNotification: string,
  notificationsOptions: notifications.NotificationsOptions
): Promise<messages.apiResponse> => {
  const authorization = {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  };
  try {
    const response = await axios.post(
      `${API_URL}/${VERSION}/notifications/${idNotification}/approvals`,
      notificationsOptions,
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
};

export { establishBond, getNotifications, acceptNotification };
