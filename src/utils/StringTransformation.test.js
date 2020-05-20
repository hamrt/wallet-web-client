import * as stringTransformation from "./StringTransformation";

describe("string transformation", () => {
  it("should return the name with the correct format", () => {
    expect.assertions(1);
    const name = stringTransformation.transformUserName("LastName&Name");

    expect(name).toBe("Name LastName");
  });

  it("should return the correct name of the notifications type", () => {
    expect.assertions(5);
    const notification1 = stringTransformation.notificationType(0, "", "");
    const notification2 = stringTransformation.notificationType(1, "", "");
    const notification3 = stringTransformation.notificationType(2, "", "");
    const notification4 = stringTransformation.notificationType(3, "", "");
    const notification5 = stringTransformation.notificationType(4, "", "");

    expect(notification1).toBe("Store My Diploma");
    expect(notification2).toBe("Store Verifiable eID");
    expect(notification3).toBe("Request your eID Presentation");
    expect(notification4).toBe("Request to Sign your eID Presentation");
    expect(notification5).toBe("Sign notarization ledger transaction");
  });

  it("should the name of a notification/credential before display it", () => {
    expect.assertions(7);
    const bachelorUniversity =
      "did:ebsi:0x66A3296A0adD02D841001dA1980b8DCAFF1d8d08";
    const masterUniversity =
      "did:ebsi:0xdC4b142388099C01348e26785e9AA45E75BD2e01";
    const element1 = stringTransformation.modifyName(
      "Verifiable ID",
      "notification",
      ""
    );
    const element2 = stringTransformation.modifyName(
      "Verifiable ID",
      "credential",
      ""
    );
    const element3 = stringTransformation.modifyName(
      "Verifiable Presentation",
      "credential",
      ""
    );
    const element4 = stringTransformation.modifyName(
      "VerifiablePresentation",
      "credential",
      ""
    );
    const element5 = stringTransformation.modifyName(
      "Europass Diploma",
      "notification",
      ""
    );
    const element6 = stringTransformation.modifyName(
      '["Europass Diploma"]',
      "credential",
      bachelorUniversity
    );
    const element7 = stringTransformation.modifyName(
      '["Europass Diploma"]',
      "credential",
      masterUniversity
    );

    expect(element1).toBe("Verifiable eID");
    expect(element2).toBe("My Verifiable eID");
    expect(element3).toBe("Verifiable eID Presentation");
    expect(element4).toBe("Verifiable eID Presentation");
    expect(element5).toBe("Diploma");
    expect(element6).toBe("Bachelor Diploma");
    expect(element7).toBe("Master Diploma");
  });
});
