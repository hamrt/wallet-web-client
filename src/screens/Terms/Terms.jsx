/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import "./Terms.css";
import { Jumbotron, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { getTerms, storeTerms } from "../../utils/DataStorage";
import colors from "../../config/colors";
import icons from "../../assets/icons.svg";

class Terms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areTermsAccepted: false,
    };
  }

  componentDidMount() {
    this.handleAccess();
  }

  onSubmitClick() {
    const { areTermsAccepted } = this.state;
    if (areTermsAccepted) {
      storeTerms(true);
      this.goToLoginIfAlreadyAccepted();
    } else {
      storeTerms(false);
    }
  }

  onChange() {
    const { areTermsAccepted } = this.state;
    const termsAndConditionsChanged = !areTermsAccepted;
    this.setState({
      areTermsAccepted: termsAndConditionsChanged,
    });
  }

  onCancelClick() {
    storeTerms(false);
    this.setState({
      areTermsAccepted: false,
    });
    window.location.reload();
  }

  handleAccess() {
    const { location, history } = this.props;
    const urlParameters = queryString.parse(location.search);
    if (urlParameters["did-auth"] !== undefined) {
      history.push(`/auth${location.search}`);
    } else {
      this.goToLoginIfAlreadyAccepted();
    }
  }

  goToLoginIfAlreadyAccepted() {
    const { history } = this.props;
    if (getTerms()) {
      history.push("/login");
    }
  }

  render() {
    const { areTermsAccepted } = this.state;

    return (
      <div>
        <Jumbotron
          className="jumbotron"
          style={{ backgroundColor: colors.EC_BLUE }}
        >
          <Container style={{ color: colors.WHITE }}>
            <h1>Welcome to your EBSI wallet</h1>
            <p> </p>
          </Container>
        </Jumbotron>

        <div className="terms">
          <div>
            <div>
              <div className="ecl-fact-figures__value">
                Terms and Conditions
              </div>
              <p className="ecl-fact-figures__description">
                Find more information by{" "}
                <Link to="/termsAndConditions"> clicking here </Link>
              </p>

              <div className="ecl-fact-figures_checkbox">
                <input
                  type="checkbox"
                  defaultChecked={areTermsAccepted}
                  onChange={() => this.onChange()}
                  className="ecl-checkbox__input"
                  id="checkbox-default"
                  name="checkbox-default"
                />
                <label
                  htmlFor="checkbox-default"
                  className="ecl-form-label ecl-checkbox__label"
                >
                  <span className="ecl-checkbox__box">
                    <svg
                      focusable="false"
                      aria-hidden="true"
                      className="ecl-checkbox__icon ecl-icon ecl-icon--s"
                    >
                      <use xlinkHref={`${icons}#ui--check`} />
                    </svg>
                  </span>
                  I agree to the Terms and Conditions
                </label>
              </div>

              <div className="button-container">
                <button
                  type="button"
                  className="ecl-button ecl-button--secondary"
                  style={{ margin: 10 }}
                  onClick={() => this.onCancelClick()}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ecl-button ecl-button--primary"
                  style={{ margin: 10 }}
                  onClick={() => this.onSubmitClick()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="footerTerms">
          <Footer />
        </div>
      </div>
    );
  }
}

export default Terms;
Terms.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.any.isRequired,
};
