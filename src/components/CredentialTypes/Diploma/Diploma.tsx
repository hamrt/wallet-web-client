import React, { Component } from "react";

type Props = {
  data: any;
};

class Diploma extends Component<Props> {
  componentDidMount() {}

  render() {
    const { data } = this.props;
    try {
      // No need to parse the data
      // const parsedData = JSON.parse(data);
      const parsedData = JSON.parse(data);
      return (
        <dl className="ecl-description-list ecl-description-list--horizontal">
          <dt className="ecl-description-list__term">Issuer</dt>
          <dd className="ecl-description-list__definition">
            {parsedData.issuer}
          </dd>
          <dt className="ecl-description-list__term">Title</dt>
          <dd className="ecl-description-list__definition">
            {parsedData.credentialSubject.achievements[0].title}
          </dd>
          <dt className="ecl-description-list__term">Issuance Date</dt>
          <dd className="ecl-description-list__definition">
            {parsedData.credentialSubject.achievements[0].issuedDate}
          </dd>
          <dt className="ecl-description-list__term">ISCED-F Code</dt>
          <dd className="ecl-description-list__definition">
            {
              parsedData.credentialSubject.achievements[0].learningSpecification
                .iscedFcode
            }
          </dd>
          <dt className="ecl-description-list__term">Target Framework</dt>
          <dd className="ecl-description-list__definition">
            {
              parsedData.credentialSubject.achievements[0].learningSpecification
                .hasAccreditation.targetFramework
            }
          </dd>
          <dt className="ecl-description-list__term">Numeric Score</dt>
          <dd className="ecl-description-list__definition">
            {
              parsedData.credentialSubject.achievements[0].hasPart[0]
                .wasDerivedFrom.grade.numericScore
            }
          </dd>
        </dl>
      );
    } catch (error) {
      return (
        <>
          <p>
            <b>
              <u>Error Parsing the Diploma.</u>
            </b>
          </p>
          <p>
            <b>Contact the issuer to check what happens.</b>
          </p>
        </>
      );
    }
  }
}

export default Diploma;
