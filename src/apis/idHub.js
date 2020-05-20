import axios from "axios";
import { getJWT, getDID } from "../utils/DataStorage";
import { REACT_APP_ID_HUB_API } from "../config/env";

const API_ID_HUB = REACT_APP_ID_HUB_API;
const VERSION = "v1";

async function getCredentials() {
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

async function getCredential(hash) {
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

async function getCredentialsForPresentation(notification) {
  const authorization = {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  };
  const arrayTypes = JSON.parse(notification.dataDecoded).type[0];
  const typesAsString = JSON.stringify(arrayTypes);
  const types = encodeURI(typesAsString);
  try {
    const response = await axios.get(
      `${API_ID_HUB}/${VERSION}/attributes?did=${getDID()}&type=${types}`,
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

export { getCredentials, getCredential, getCredentialsForPresentation };
