import axios from "axios";
import {
  getCredentials,
  getCredential,
  getCredentialsForPresentation,
} from "./idHub";
import * as responsesAPI from "../test/mocks/responsesAPI";
import * as mocks from "../test/mocks/mocks";

jest.mock("axios");

describe("idHub api", () => {
  it("should return the credentials value from API", async () => {
    expect.assertions(1);

    axios.get.mockResolvedValue(responsesAPI.getCredentials);
    const credentials = await getCredentials();
    expect(credentials.data).toMatchObject(mocks.getCredentials);
  });

  it("should return a credential from a specific hash from API", async () => {
    expect.assertions(1);

    axios.get.mockResolvedValue(responsesAPI.getCredential);
    const credentials = await getCredential(mocks.hash);
    expect(credentials.data).toMatchObject(mocks.getCredential);
  });

  it("should return the credentials from a specific type from API", async () => {
    expect.assertions(1);

    axios.get.mockResolvedValue(responsesAPI.getCredentialsVP);
    const credentials = await getCredentialsForPresentation(mocks.getVID);
    expect(credentials.data).toMatchObject(mocks.getCredentialsVP);
  });
});
