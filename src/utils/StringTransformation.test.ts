import axios from "axios";
import * as stringTransformation from "./StringTransformation";

describe("string transformation", () => {
  describe("transformUserName tests", () => {
    it("should return the name with the correct format", () => {
      expect.assertions(1);
      const name = stringTransformation.transformUserName("LastName&Name");

      expect(name).toBe("Name LastName");
    });

    it("should return the name without split", () => {
      expect.assertions(1);
      const name = stringTransformation.transformUserName("Name");

      expect(name).toBe("Name");
    });
  });

  describe("notificationType tests", () => {
    test.each`
      notiType | name                                            | redirectUrl  | expectedString
      ${-1}    | ${""}                                           | ${undefined} | ${" - "}
      ${0}     | ${""}                                           | ${undefined} | ${"Store My Diploma"}
      ${1}     | ${""}                                           | ${undefined} | ${"Store Verifiable eID"}
      ${2}     | ${""}                                           | ${undefined} | ${"Request your eID Presentation"}
      ${2}     | ${'["Verifiable ID","Europass Diploma"]'}       | ${undefined} | ${"Request your eID and Diploma Presentation"}
      ${2}     | ${"Request Verifiable ID"}                      | ${undefined} | ${"Request your Bachelor Diploma Presentation"}
      ${2}     | ${"Request Verifiable ID and Europass Diploma"} | ${undefined} | ${"Request your Master Diploma Presentation"}
      ${3}     | ${""}                                           | ${undefined} | ${"Request to Sign your eID Presentation"}
      ${3}     | ${""}                                           | ${"another"} | ${"Request to Sign your eID Presentation"}
      ${3}     | ${""}                                           | ${"master"}  | ${"Request to Sign your eID & Diploma Presentation"}
      ${4}     | ${""}                                           | ${undefined} | ${"Sign ledger transaction"}
    `(
      "should return the correct name of the notifications type $notiType and $name and $redirectUrl",
      ({ notiType, name, redirectUrl, expectedString }) => {
        const notification = stringTransformation.notificationType(
          notiType,
          name,
          redirectUrl
        );

        expect(notification).toBe(expectedString);
      }
    );
  });

  describe("modifyName tests", () => {
    test.each`
      name                         | dataType          | issuerDid                                                | expectedName
      ${"Verifiable ID"}           | ${"notification"} | ${""}                                                    | ${"Verifiable eID"}
      ${"Verifiable ID"}           | ${"credential"}   | ${""}                                                    | ${"My Verifiable eID"}
      ${"Verifiable Presentation"} | ${"credential"}   | ${""}                                                    | ${"Verifiable eID Presentation"}
      ${"VerifiablePresentation"}  | ${"credential"}   | ${""}                                                    | ${"Verifiable eID Presentation"}
      ${"Europass Diploma"}        | ${"notification"} | ${""}                                                    | ${"Diploma"}
      ${'["Europass Diploma"]'}    | ${"credential"}   | ${"did:ebsi:0x66A3296A0adD02D841001dA1980b8DCAFF1d8d08"} | ${"Bachelor Diploma"}
      ${'["Europass Diploma"]'}    | ${"credential"}   | ${"did:ebsi:0xdC4b142388099C01348e26785e9AA45E75BD2e01"} | ${"Master Diploma"}
      ${'["Europass Diploma"]'}    | ${"credential"}   | ${"did:ebsi:fakeId"}                                     | ${"Diploma"}
      ${'["Europass Diploma"]'}    | ${"notification"} | ${"did:ebsi:fakeId"}                                     | ${"Diploma"}
    `(
      "should $name of a $dataType be modified to $expectedName before displaying it",
      async ({ name, dataType, issuerDid, expectedName }) => {
        if (name === '["Europass Diploma"]' && dataType === "credential") {
          jest.spyOn(axios, "get").mockResolvedValue({
            status: 200,
            data: {
              preferredName: expectedName,
            },
          });
        }
        const element = await stringTransformation.modifyName(
          name,
          dataType,
          issuerDid
        );

        expect(element).toBe(expectedName);
        jest.restoreAllMocks();
      }
    );
  });

  describe("modifyNotificationTitle tests", () => {
    it("should return the name passed in", async () => {
      expect.assertions(1);
      const name = "a sample name";
      const response = await stringTransformation.modifyNotificationTitle(
        name,
        -1
      );
      expect(response).toMatch(name);
    });

    it("should return My Diploma", async () => {
      expect.assertions(1);
      const name = "a sample name";
      const response = await stringTransformation.modifyNotificationTitle(
        name,
        0
      );
      expect(response).toMatch("My Diploma");
    });

    it("should return a modified name", async () => {
      expect.assertions(1);
      const response = await stringTransformation.modifyNotificationTitle(
        "",
        1
      );
      expect(response).toMatch(" - ");
    });
  });

  describe("getSelectRequestedCredentialsText tests", () => {
    it("should return `Select Requested Credentials` when no array text is passed", () => {
      expect.assertions(1);
      const response = stringTransformation.getSelectRequestedCredentialsText(
        undefined as any
      );
      expect(response).toMatch("Select Requested Credentials");
    });

    it("should return `Select Requested Credentials` when array text passed is not a string array", () => {
      expect.assertions(1);
      const arrText = [1, 2, 3, 4];
      const response = stringTransformation.getSelectRequestedCredentialsText(
        arrText as any
      );
      expect(response).toMatch("Select Requested Credentials");
    });

    it("should return 'Select: Verifiable eID' when array text passed with an string array", () => {
      expect.assertions(1);
      const arrText = ["VerifiableCredential", "EssifVerifiableID"];
      const response = stringTransformation.getSelectRequestedCredentialsText(
        arrText
      );
      expect(response).toMatch("Select: Verifiable eID Credential");
    });

    it("should return 'Select: Diploma' when array text passed with an string array", () => {
      expect.assertions(1);
      const arrText = ["VerifiableCredential", "EuropassCredential"];
      const response = stringTransformation.getSelectRequestedCredentialsText(
        arrText
      );
      expect(response).toMatch("Select: Diploma Credential");
    });

    it("should return 'Select: Something' when array text passed with an unkown string array type", () => {
      expect.assertions(1);
      const arrText = ["VerifiableCredential", "Unknown"];
      const response = stringTransformation.getSelectRequestedCredentialsText(
        arrText
      );
      expect(response).toMatch("Select: Unknown Credential");
    });
    it("should return 'Select: Verifiable eID' when array text passed with a single string array of arrays", () => {
      expect.assertions(1);
      const arrText = [["VerifiableCredential", "EssifVerifiableID"]];
      const response = stringTransformation.getSelectRequestedCredentialsText(
        arrText
      );
      expect(response).toMatch("Select: Verifiable eID Credential");
    });

    it("should return 'Select: Diploma' when array text passed with a single string array of arrays", () => {
      expect.assertions(1);
      const arrText = [["VerifiableCredential", "EuropassCredential"]];
      const response = stringTransformation.getSelectRequestedCredentialsText(
        arrText
      );
      expect(response).toMatch("Select: Diploma Credential");
    });

    it("should return 'Select: Verifiable eID and Diploma Credentials' when array text passed with a double string array of arrays", () => {
      expect.assertions(1);
      const arrText = [
        ["VerifiableCredential", "EssifVerifiableID"],
        ["VerifiableCredential", "EuropassCredential"],
      ];
      const response = stringTransformation.getSelectRequestedCredentialsText(
        arrText
      );
      expect(response).toMatch(
        "Select: Verifiable eID and Diploma Credentials"
      );
    });

    it("should return 'Select Requested Credentials' when array text passed does not contain an array of string arrays", () => {
      expect.assertions(1);
      const arrText = [
        [1, 2],
        ["VerifiableCredential", "EuropassCredential"],
      ];
      const response = stringTransformation.getSelectRequestedCredentialsText(
        arrText as any
      );
      expect(response).toMatch("Select Requested Credentials");
    });
  });
});
