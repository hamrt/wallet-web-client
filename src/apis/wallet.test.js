import axios from "axios";
import { establishBond, getNotifications, acceptNotification } from "./wallet";
import * as responsesAPI from "../test/mocks/responsesAPI";
import * as mocks from "../test/mocks/mocks";

jest.mock("axios");

describe("wallet api", () => {
  it("should establishBond with API", async () => {
    expect.assertions(1);

    axios.post.mockResolvedValue(responsesAPI.session);
    const response = await establishBond(mocks.jwtToEstablishBond);
    expect(response.data.accessToken).toBe(mocks.userJwt);
  });

  it("should return the notifications from API", async () => {
    expect.assertions(1);

    axios.get.mockResolvedValue(responsesAPI.getNotifications);
    const notifications = await getNotifications(mocks.userJwt);
    expect(notifications.data).toMatchObject(mocks.getNotifications);
  });

  it("should accept the notification in the API", async () => {
    expect.assertions(1);

    axios.post.mockResolvedValue(responsesAPI.acceptNotification);
    const body = {};
    const response = await acceptNotification(mocks.getNotification, body);
    expect(response.data.message).toBe("Notification processed successfully");
  });
});
