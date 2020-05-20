import axios from "axios";
import { getJWT } from "../utils/DataStorage";
import { REACT_APP_WALLET_API } from "../config/env";
import * as config from "../config/config";

const API_URL = REACT_APP_WALLET_API;
const VERSION = "v1";

async function establishBond(token) {
  const body = {
    grantType: config.grantType,
    assertion: token,
    scope: config.scope,
  };
  try {
    const response = await axios.post(`${API_URL}/${VERSION}/sessions`, body);
    return { status: response.status, data: response.data };
  } catch (error) {
    const errorData = error.response.data;
    if (errorData !== undefined) {
      return {
        status: errorData.status,
        data: `${errorData.detail}`,
      };
    }
    return { status: 500, data: "Error" };
  }
}

async function getNotifications(token) {
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
    const errorData = error.response.data;
    if (errorData !== undefined) {
      return {
        status: errorData.status,
        data: `${errorData.detail}`,
      };
    }
    return { status: 500, data: "Error" };
  }
}

async function acceptNotification(idNotification, body) {
  const authorization = {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  };
  try {
    const response = await axios.post(
      `${API_URL}/${VERSION}/notifications/${idNotification}/approvals`,
      body,
      authorization
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    const errorData = error.response.data;
    if (errorData !== undefined) {
      return {
        status: errorData.status,
        data: `${errorData.detail}`,
      };
    }
    return { status: 500, data: "Error" };
  }
}

export { establishBond, getNotifications, acceptNotification };
