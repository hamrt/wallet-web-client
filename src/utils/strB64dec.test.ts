import base64url from "base64url";
import { strB64dec } from "./strB64dec";
import * as mocks from "../test/mocks/mocks";

describe("util", () => {
  it("should decode base 64", () => {
    expect.assertions(1);
    const decoded = strB64dec(mocks.getVID.data.base64);

    expect(JSON.parse(decoded).id).toMatch(
      "ebsi:type-version-of-the-credential"
    );
  });

  it("should support utf-8 content", () => {
    expect.assertions(1);

    // Interestingly, the double flag 🇧🇪🇧🇪 makes "base-64"'s `decode` function crash
    // Event when we escape the content: decode(unescape(encodeURIComponent(content)))
    // That's why we use base64url instead
    const verifiableId = {
      birthName: "van Blokketen",
      currentAddress: "44, rue de Fame",
      currentFamilyName: `van Blokkéten 🇧🇪`,
      currentGivenName: "Eva",
      dateOfBirth: "1998-02-14T00:00:00.000Z",
      gender: "Female",
      id: "did:ebsi:0x8654A1e8DC4E487bb20F95815704c1C326450B23",
      personIdentifier: "BE/BE/02635542Y",
      placeOfBirth: `Brussels
      🇧🇪🇧🇪
      \n\t
      `,
    };

    const encodedData = base64url.encode(JSON.stringify(verifiableId));
    const decoded = JSON.parse(strB64dec(encodedData));

    expect(decoded).toStrictEqual(verifiableId);
  });
});
