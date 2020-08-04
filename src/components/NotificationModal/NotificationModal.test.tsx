import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mount, shallow } from "enzyme";
import NotificationModal from "./NotificationModal";
import * as mocks from "../../test/mocks/mocks";
import * as idHub from "../../apis/idHub";
import { INotification } from "../../dtos/notifications";

describe("notification modal", () => {
  it("should renders without crashing", () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <NotificationModal
          notification={notification}
          methodToClose={methodToOpen}
          methodToAccept={methodToOpen}
          methodToSign={methodToOpen}
          isModalNotificationOpen
          isAccepting
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should display the modal", () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const wrapper = mount(
      <BrowserRouter>
        <NotificationModal
          notification={notification}
          methodToClose={methodToOpen}
          methodToAccept={methodToOpen}
          methodToSign={methodToOpen}
          isModalNotificationOpen
          isAccepting
        />
      </BrowserRouter>
    );

    const result = wrapper.instance().render();

    expect(result).toMatchInlineSnapshot(`
      <Router
        history={
          Object {
            "action": "POP",
            "block": [Function],
            "createHref": [Function],
            "go": [Function],
            "goBack": [Function],
            "goForward": [Function],
            "length": 1,
            "listen": [Function],
            "location": Object {
              "hash": "",
              "pathname": "/",
              "search": "",
              "state": undefined,
            },
            "push": [Function],
            "replace": [Function],
          }
        }
      >
        <NotificationModal
          isAccepting={true}
          isModalNotificationOpen={true}
          methodToAccept={[MockFunction]}
          methodToClose={[MockFunction]}
          methodToSign={[MockFunction]}
          notification={
            Object {
              "dataDecoded": "{\\"@context\\":[\\"https://www.w3.org/2018/credentials/v1\\",\\"https://EBSI-WEBSITE.EU/schemas/vc/2019/v1#\\",\\"https://EBSI-WEBSITE.EU/schemas/eidas/2019/v1#\\"],\\"id\\":\\"ebsi:type-version-of-the-credential\\",\\"type\\":[\\"VerifiableCredential\\",\\"EssifVerifiableID\\"],\\"issuer\\":\\"did:ebsi:0xcDA56e98CD9e454143285b72b5De809e7C40C43F\\",\\"issuanceDate\\":\\"2020-04-28T21:06:46.000Z\\",\\"expirationDate\\":\\"2030-04-28T21:06:46.976Z\\",\\"credentialSubject\\":{\\"personIdentifier\\":\\"BE/BE/02635542Y\\",\\"currentFamilyName\\":\\"Bean\\",\\"currentGivenName\\":\\"Alex\\",\\"birthName\\":\\"Bean\\",\\"dateOfBirth\\":\\"1998-02-14\\",\\"placeOfBirth\\":\\"Barcelona\\",\\"currentAddress\\":\\"Brussels\\",\\"gender\\":\\"Male\\",\\"id\\":\\"did:ebsi:0x80C3e1d04615b3c2B5eF22C41a5aF52F22d32263\\",\\"govId\\":\\"\\"},\\"proof\\":{\\"type\\":\\"EidasSeal2019\\",\\"created\\":\\"2020-04-28T21:06:46.000Z\\",\\"proofPurpose\\":\\"assertionMethod\\",\\"verificationMethod\\":\\"did:ebsi:0xcDA56e98CD9e454143285b72b5De809e7C40C43F#eidasKey\\",\\"jws\\":\\"eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODgxMDgwMDYsInN1YiI6ImRpZDplYnNpOjB4ODBDM2UxZDA0NjE1YjNjMkI1ZUYyMkM0MWE1YUY1MkYyMmQzMjI2MyIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9FQlNJLVdFQlNJVEUuRVUvc2NoZW1hcy92Yy8yMDE5L3YxIyIsImh0dHBzOi8vRUJTSS1XRUJTSVRFLkVVL3NjaGVtYXMvZWlkYXMvMjAxOS92MSMiXSwiaWQiOiJlYnNpOnR5cGUtdmVyc2lvbi1vZi10aGUtY3JlZGVudGlhbCIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJFc3NpZlZlcmlmaWFibGVJRCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJwZXJzb25JZGVudGlmaWVyIjoiQkUvQkUvMDI2MzU1NDJZIiwiY3VycmVudEZhbWlseU5hbWUiOiJCZWFuIiwiY3VycmVudEdpdmVuTmFtZSI6IkFsZXgiLCJiaXJ0aE5hbWUiOiJCZWFuIiwiZGF0ZU9mQmlydGgiOiIxOTk4LTAyLTE0IiwicGxhY2VPZkJpcnRoIjoiQmFyY2Vsb25hIiwiY3VycmVudEFkZHJlc3MiOiJCcnVzc2VscyIsImdlbmRlciI6Ik1hbGUiLCJpZCI6ImRpZDplYnNpOjB4ODBDM2UxZDA0NjE1YjNjMkI1ZUYyMkM0MWE1YUY1MkYyMmQzMjI2MyIsImdvdklkIjoiIn19LCJpc3MiOiJkaWQ6ZWJzaToweDc5NDc1ZjBmZkIxNWVEOGMyN0Q3RmU5QTBDZWIxNTg1Q2MzZkIxQjMifQ.PpxOY_Qd312jUd-uj-NifzhGNgYAmcTiiEUZBcH0VI3AwCmeuxlknjh7TFR-z02BWPCFpZILbmtx-Bx8XkiaKgA\\"}}",
              "id": "c3b5f000-89e8-11ea-88b7-b759be3ae4e3",
              "message": Object {
                "data": Object {
                  "base64": "eyJyZXF1ZXN0ZXIiOiJkaWQ6ZWJzaToweEJEQjg2MThERTNlY2RGMzdhNGYxM2NhQUM3ZDlhYmMwOTdiZjlGQzIiLCJ0eXBlIjpbWyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkVzc2lmVmVyaWZpYWJsZUlEIl1dLCJzdWJzY3JpYmVyVVJMIjoiaHR0cHM6Ly9hcGkuZWJzaS54eXovdW5pdmVyc2l0aWVzL2JhY2hlbG9yLXZwIiwicmVkaXJlY3RVUkwiOiJodHRwczovL2FwcC5lYnNpLnh5ei9kZW1vL2ZsZW1pc2gtZ292L2lzc3VlLXZhIn0=",
                },
                "didOwner": "did:ebsi:0x80C3e1d04615b3c2B5eF22C41a5aF52F22d32263",
                "hash": "0x6a1358d06f3fd5aa29e498fe06b8bba5e96ba9aaabee165a54204fba015c9e38",
                "name": "[\\"Verifiable ID\\"]",
                "notificationType": 2,
                "redirectURL": "https://app.ebsi.xyz/demo/flemish-gov/issue-va",
                "subscriberURL": "https://api.ebsi.xyz/universities/bachelor-vp",
                "timestamp": "2020-04-29T07:12:19.724Z",
              },
              "receiver": "did:ebsi:0x80C3e1d04615b3c2B5eF22C41a5aF52F22d32263",
              "selectedCredentials": Array [],
              "selectedCredsTypes": Array [],
              "sender": "did:ebsi:0xBDB8618DE3ecdF37a4f13caAC7d9abc097bf9FC2",
            }
          }
        />
      </Router>
    `);
  });
  it("should open details", () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const credentialModalComponent = shallow(
      <NotificationModal
        notification={notification}
        methodToClose={methodToOpen}
        methodToAccept={methodToOpen}
        methodToSign={methodToOpen}
        isModalNotificationOpen
        isAccepting
      />
    );

    (credentialModalComponent.instance() as NotificationModal).openDetails();

    expect(credentialModalComponent.state("isFullCredentialDisplayed")).toBe(
      true
    );
  });
  it("should close details", () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const methodToOpen = jest.fn();
    const credentialModalComponent = shallow(
      <NotificationModal
        notification={notification}
        methodToClose={methodToOpen}
        methodToAccept={methodToOpen}
        methodToSign={methodToOpen}
        isModalNotificationOpen
        isAccepting
      />
    );

    (credentialModalComponent.instance() as NotificationModal).closeDetails();

    expect(credentialModalComponent.state("isFullCredentialDisplayed")).toBe(
      false
    );
  });

  describe("getCredentials tests", () => {
    it("should get all the credentials and generate a CredentialItem for each one", async () => {
      expect.assertions(1);
      const notification = mocks.getNotification;
      const methodToOpen = jest.fn();
      const credentialModalComponent = shallow(
        <NotificationModal
          notification={notification}
          methodToClose={methodToOpen}
          methodToAccept={methodToOpen}
          methodToSign={methodToOpen}
          isModalNotificationOpen
          isAccepting
        />
      );

      const spy = jest.spyOn(idHub, "getCredentialsForPresentation");
      spy.mockResolvedValue({ status: 200, data: mocks.getCredentials });

      await (credentialModalComponent.instance() as NotificationModal).getCredentials(
        notification
      );

      expect(credentialModalComponent.state("credentials")).toHaveLength(1);

      spy.mockRestore();
    });

    it("should modify the state with a notification", async () => {
      expect.assertions(1);
      const notification = mocks.getNotification;
      const methodToOpen = jest.fn();
      const credentialModalComponent = shallow(
        <NotificationModal
          notification={notification}
          methodToClose={methodToOpen}
          methodToAccept={methodToOpen}
          methodToSign={methodToOpen}
          isModalNotificationOpen
          isAccepting
        />
      );

      const spy = jest.spyOn(idHub, "getCredentialsForPresentation");
      spy.mockResolvedValue({ status: 200, data: mocks.getCredentialsVP });

      await (credentialModalComponent.instance() as NotificationModal).getCredentials(
        notification
      );

      expect(
        credentialModalComponent.state("notificationForPresentations")
      ).toMatchObject(notification);

      spy.mockRestore();
    });

    it("should return without any state changes when getCredentials returns error", async () => {
      expect.assertions(1);
      const notification = mocks.getNotification;
      const methodToOpen = jest.fn();
      const credentialModalComponent = shallow(
        <NotificationModal
          notification={notification}
          methodToClose={methodToOpen}
          methodToAccept={methodToOpen}
          methodToSign={methodToOpen}
          isModalNotificationOpen
          isAccepting
        />
      );

      const spy = jest.spyOn(idHub, "getCredentialsForPresentation");
      spy.mockResolvedValue({ status: 400, data: "Error" });

      await (credentialModalComponent.instance() as NotificationModal).getCredentials(
        {} as any
      );

      expect(credentialModalComponent.state("credentials")).toHaveLength(0);

      spy.mockRestore();
    });

    it("should return a whole credential item presentation", async () => {
      expect.assertions(1);
      const notification = mocks.getNotification;
      const methodToOpen = jest.fn();
      const credentialModalComponent = shallow(
        <NotificationModal
          notification={notification}
          methodToClose={methodToOpen}
          methodToAccept={methodToOpen}
          methodToSign={methodToOpen}
          isModalNotificationOpen
          isAccepting
        />
      );

      const spy = jest.spyOn(idHub, "getCredentialsForPresentation");
      spy.mockResolvedValue({ status: 200, data: mocks.getCredentials });

      await (credentialModalComponent.instance() as NotificationModal).getCredentials(
        notification
      );

      expect(credentialModalComponent.state("credentials"))
        .toMatchInlineSnapshot(`
        Array [
          <CredentialItemPresentation
            credential={
              Object {
                "data": Object {
                  "base64": "eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vRUJTSS1XRUJTSVRFLkVVL3NjaGVtYXMvdmMvMjAxOS92MSMiLCJodHRwczovL0VCU0ktV0VCU0lURS5FVS9zY2hlbWFzL2VpZGFzLzIwMTkvdjEjIl0sImlkIjoiZWJzaTp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXNzaWZWZXJpZmlhYmxlSUQiXSwiaXNzdWVyIjoiZGlkOmVic2k6MHhjREE1NmU5OENEOWU0NTQxNDMyODViNzJiNURlODA5ZTdDNDBDNDNGIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xNVQxMDoxMjo0MC4wMDBaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsicGVyc29uSWRlbnRpZmllciI6IkJFL0JFLzAyNjM1NTQyWSIsImN1cnJlbnRGYW1pbHlOYW1lIjoiSnVsaWFuR09OWkFMRVogQUdVREVMTyIsImN1cnJlbnRHaXZlbk5hbWUiOiJBZGFtcyIsImJpcnRoTmFtZSI6IkV2YSIsImRhdGVPZkJpcnRoIjoiMTk5OC0wMi0xNFQwMDowMDowMC4wMDBaIiwicGxhY2VPZkJpcnRoIjoiQmFyY2Vsb25hIiwiY3VycmVudEFkZHJlc3MiOiJCcnVzc2VscyIsImdlbmRlciI6Ik1hbGUiLCJpZCI6ImRpZDplYnNpOjB4ODdBZjE1RWU5RTE5YzVEMUQwNDJFNEU5ZTJhNUM0NDlkNEExNDA3OCJ9LCJwcm9vZiI6eyJ0eXBlIjoiRWlkYXNTZWFsMjAxOSIsImNyZWF0ZWQiOiIyMDIwLTA1LTE1VDEwOjEyOjQwLjAwMFoiLCJwcm9vZlB1cnBvc2UiOiJhc3NlcnRpb25NZXRob2QiLCJ2ZXJpZmljYXRpb25NZXRob2QiOiJkaWQ6ZWJzaToweGNEQTU2ZTk4Q0Q5ZTQ1NDE0MzI4NWI3MmI1RGU4MDllN0M0MEM0M0YjZWlkYXNLZXkiLCJqd3MiOiJleUpoYkdjaU9pSkZVekkxTmtzdFVpSXNJblI1Y0NJNklrcFhWQ0lzSW10cFpDSTZJbVJwWkRwbFluTnBPakI0WTBSQk5UWmxPVGhEUkRsbE5EVTBNVFF6TWpnMVlqY3lZalZFWlRnd09XVTNRelF3UXpRelJpTnJaWGt0TVNKOS5leUpwWVhRaU9qRTFPRGsxTXpjMU5qQXNJbk4xWWlJNkltUnBaRHBsWW5OcE9qQjRPRGRCWmpFMVJXVTVSVEU1WXpWRU1VUXdOREpGTkVVNVpUSmhOVU0wTkRsa05FRXhOREEzT0NJc0luWmpJanA3SWtCamIyNTBaWGgwSWpwYkltaDBkSEJ6T2k4dmQzZDNMbmN6TG05eVp5OHlNREU0TDJOeVpXUmxiblJwWVd4ekwzWXhJaXdpYUhSMGNITTZMeTlGUWxOSkxWZEZRbE5KVkVVdVJWVXZjMk5vWlcxaGN5OTJZeTh5TURFNUwzWXhJeUlzSW1oMGRIQnpPaTh2UlVKVFNTMVhSVUpUU1ZSRkxrVlZMM05qYUdWdFlYTXZaV2xrWVhNdk1qQXhPUzkyTVNNaVhTd2lhV1FpT2lKbFluTnBPblI1Y0dVdGRtVnljMmx2YmkxdlppMTBhR1V0WTNKbFpHVnVkR2xoYkNJc0luUjVjR1VpT2xzaVZtVnlhV1pwWVdKc1pVTnlaV1JsYm5ScFlXd2lMQ0pGYzNOcFpsWmxjbWxtYVdGaWJHVkpSQ0pkTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SndaWEp6YjI1SlpHVnVkR2xtYVdWeUlqb2lRa1V2UWtVdk1ESTJNelUxTkRKWklpd2lZM1Z5Y21WdWRFWmhiV2xzZVU1aGJXVWlPaUpLZFd4cFlXNUhUMDVhUVV4RldpQkJSMVZFUlV4UElpd2lZM1Z5Y21WdWRFZHBkbVZ1VG1GdFpTSTZJa0ZrWVcxeklpd2lZbWx5ZEdoT1lXMWxJam9pUlhaaElpd2laR0YwWlU5bVFtbHlkR2dpT2lJeE9UazRMVEF5TFRFMFZEQXdPakF3T2pBd0xqQXdNRm9pTENKd2JHRmpaVTltUW1seWRHZ2lPaUpDWVhKalpXeHZibUVpTENKamRYSnlaVzUwUVdSa2NtVnpjeUk2SWtKeWRYTnpaV3h6SWl3aVoyVnVaR1Z5SWpvaVRXRnNaU0lzSW1sa0lqb2laR2xrT21WaWMyazZNSGc0TjBGbU1UVkZaVGxGTVRsak5VUXhSREEwTWtVMFJUbGxNbUUxUXpRME9XUTBRVEUwTURjNEluMTlMQ0pwYzNNaU9pSmthV1E2WldKemFUb3dlR05FUVRVMlpUazRRMFE1WlRRMU5ERTBNekk0TldJM01tSTFSR1U0TURsbE4wTTBNRU0wTTBZaWZRLjJNWGlyMW1ES2NEaDBRMmxpd2RlcUNOeGg4c2ZVR3BaUmdmR1FRR1VYT0doaWhwbktzekRvTFBjRm9wZDJ2OXBZYzNHOUVyaHRBR250UW5IV1lwN0Z3QSJ9fQ",
                },
                "did": "did:ebsi:0xcDA56e98CD9e454143285b72b5De809e7C40C43F",
                "hash": "0x52814a963ff4131353445f42ee664bf632502660f718cfbb6fad3e203e7c17c3",
                "id": "cred-c37a7d50-638b-11ea-a961-e72ecff4092c",
                "name": "Verifiable ID",
                "type": Array [
                  "VerifiableCredential",
                  "EssifVerifiableID",
                ],
              }
            }
            methodToSelect={[Function]}
          />,
        ]
      `);

      spy.mockRestore();
    });
  });

  describe("should test select calls", () => {
    it("should add the credential selected into the notification for VPs", () => {
      expect.assertions(1);
      const notification = mocks.getNotification;
      const methodToOpen = jest.fn();
      const credentialModalComponent = shallow(
        <NotificationModal
          notification={notification}
          methodToClose={methodToOpen}
          methodToAccept={methodToOpen}
          methodToSign={methodToOpen}
          isModalNotificationOpen
          isAccepting
        />
      );

      (credentialModalComponent.instance() as NotificationModal).select(
        "0x52814a963ff4131353445f42ee664bf632502660f718cfbb6fad3e203e7c17c3",
        ["Verifiable ID"]
      );

      expect(
        (credentialModalComponent.state(
          "notificationForPresentations"
        ) as INotification).selectedCredentials
      ).toHaveLength(1);
    });
  });
});
