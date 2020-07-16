import axios from "axios";
import { establishBond, getNotifications, acceptNotification } from "./wallet";
import * as responsesAPI from "../test/mocks/responsesAPI";
import * as mocks from "../test/mocks/mocks";

describe("wallet api", () => {
  describe("establishBond calls", () => {
    it("should return a 500 error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "post").mockRejectedValue(new Error("some error"));
      const response = await establishBond(mocks.jwtToEstablishBond);
      expect(response.status).toBe(500);
      expect(response.data).toMatch("Error");
    });

    it("should return a formed error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "post").mockRejectedValue({
        response: {
          data: {
            status: 400,
            detail: "a inner error",
          },
        },
      });
      const response = await establishBond(mocks.jwtToEstablishBond);
      expect(response.status).toBe(400);
      expect(response.data).toMatch("a inner error");
    });
    it("should establishBond with API", async () => {
      expect.assertions(1);

      jest.spyOn(axios, "post").mockResolvedValue(responsesAPI.session);
      const response = await establishBond(mocks.jwtToEstablishBond);
      expect(response.data.accessToken).toBe(mocks.userJwt);
    });
  });

  describe("getNotifications calls", () => {
    it("should return a 500 error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "get").mockRejectedValue(new Error("some error"));
      const response = await getNotifications(mocks.userJwt);
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
      const response = await getNotifications(mocks.userJwt);
      expect(response.status).toBe(400);
      expect(response.data).toMatch("a inner error");
    });
    it("should return the notifications from API", async () => {
      expect.assertions(1);

      jest.spyOn(axios, "get").mockResolvedValue(responsesAPI.getNotifications);
      const notifications = await getNotifications(mocks.userJwt);
      expect(notifications.data).toMatchObject(mocks.getNotifications);
    });
  });

  describe("acceptNotifications calls", () => {
    it("should return a 500 error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "post").mockRejectedValue(new Error("some error"));
      const body = {};
      const response = await acceptNotification("some-id", body);
      expect(response.status).toBe(500);
      expect(response.data).toMatch("Error");
    });

    it("should return a formed error", async () => {
      expect.assertions(2);

      jest.spyOn(axios, "post").mockRejectedValue({
        response: {
          data: {
            status: 400,
            detail: "a inner error",
          },
        },
      });
      const body = {};
      const response = await acceptNotification("some-id", body);
      expect(response.status).toBe(400);
      expect(response.data).toMatch("a inner error");
    });

    it("should accept the notification in the API", async () => {
      expect.assertions(1);

      jest
        .spyOn(axios, "post")
        .mockResolvedValue(responsesAPI.acceptNotification);
      const body = {};
      const response = await acceptNotification("some-id", body);
      expect(response.data.message).toBe("Notification processed successfully");
    });
  });
});
