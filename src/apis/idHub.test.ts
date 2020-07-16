import axios from "axios";
import {
  getCredentials,
  getCredential,
  getCredentialsForPresentation,
} from "./idHub";
import * as responsesAPI from "../test/mocks/responsesAPI";
import * as mocks from "../test/mocks/mocks";

describe("idHub api", () => {
  describe("getCredentials", () => {
    it("should return a 500 error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "get").mockRejectedValue(new Error("some error"));
      const response = await getCredentials();
      expect(response.status).toBe(500);
      expect(response.data).toMatch("Error");
    });

    it("should return a formed error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "get").mockRejectedValue({
        response: {
          data: {
            status: 400,
            detail: "a inner error",
          },
        },
      });
      const response = await getCredentials();
      expect(response.status).toBe(400);
      expect(response.data).toMatch("a inner error");
    });
    it("should return the credentials value from API", async () => {
      expect.assertions(1);

      jest.spyOn(axios, "get").mockResolvedValue(responsesAPI.getCredentials);
      const credentials = await getCredentials();
      expect(credentials.data).toMatchObject(mocks.getCredentials);
    });
  });

  describe("getCredential hash calls", () => {
    it("should return a 500 error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "get").mockRejectedValue(new Error("some error"));
      const response = await getCredential(mocks.hash);
      expect(response.status).toBe(500);
      expect(response.data).toMatch("Error");
    });

    it("should return a formed error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "get").mockRejectedValue({
        response: {
          data: {
            status: 400,
            detail: "a inner error",
          },
        },
      });
      const response = await getCredential(mocks.hash);
      expect(response.status).toBe(400);
      expect(response.data).toMatch("a inner error");
    });
    it("should return a credential from a specific hash from API", async () => {
      expect.assertions(1);

      jest.spyOn(axios, "get").mockResolvedValue(responsesAPI.getCredential);
      const credentials = await getCredential(mocks.hash);
      expect(credentials.data).toMatchObject(mocks.getCredential);
    });
  });

  describe("getCredentialsForPresentation calls", () => {
    it("should return a 500 error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "get").mockRejectedValue(new Error("some error"));
      const response = await getCredentialsForPresentation(
        mocks.getNotification
      );
      expect(response.status).toBe(500);
      expect(response.data).toMatch("Error");
    });

    it("should return a formed error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "get").mockRejectedValue({
        response: {
          data: {
            status: 400,
            detail: "a inner error",
          },
        },
      });
      const response = await getCredentialsForPresentation(
        mocks.getNotification
      );
      expect(response.status).toBe(400);
      expect(response.data).toMatch("a inner error");
    });
    it("should return the credentials from a specific type from API", async () => {
      expect.assertions(1);

      jest.spyOn(axios, "get").mockResolvedValue(responsesAPI.getCredentialsVP);
      const credentials = await getCredentialsForPresentation(
        mocks.getNotification
      );
      expect(credentials.data).toMatchObject(mocks.getCredentialsVP);
    });
  });
});
