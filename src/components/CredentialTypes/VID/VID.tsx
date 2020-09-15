import React from "react";

type Props = {
  data: string;
};

export const VID: React.FunctionComponent<Props> = ({ data }) => {
  try {
    const parsedData = JSON.parse(data);
    return (
      <dl className="ecl-description-list ecl-description-list--horizontal">
        <dt className="ecl-description-list__term">Person Identifier</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.personIdentifier}
        </dd>
        <dt className="ecl-description-list__term">Family Name</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.currentFamilyName}
        </dd>
        <dt className="ecl-description-list__term">Given Name</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.currentGivenName}
        </dd>
        <dt className="ecl-description-list__term">Birth Name</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.birthName}
        </dd>
        <dt className="ecl-description-list__term">Date of Birth</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.dateOfBirth}
        </dd>
        <dt className="ecl-description-list__term">Address</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.currentAddress}
        </dd>
        <dt className="ecl-description-list__term">Gender</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.gender}
        </dd>
        <dt className="ecl-description-list__term">DID</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.id}
        </dd>
        <dt className="ecl-description-list__term">Government ID</dt>
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.govId
            ? parsedData.credentialSubject.govId
            : " - "}
        </dd>
      </dl>
    );
  } catch (error) {
    return (
      <>
        <p>
          <b>
            <u>Error Parsing the Verifiable eID.</u>
          </b>
        </p>
        <p>
          <b>Contact the issuer to check what happens.</b>
        </p>
      </>
    );
  }
};

export default VID;
