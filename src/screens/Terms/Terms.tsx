/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import icons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import Footer from "../../components/Footer/Footer";
import { getTerms, storeTerms } from "../../utils/DataStorage";

type Props = {
  children: any;
};

function Terms({ children }: Props) {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = () => {
    storeTerms(true);
  };

  if (getTerms()) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="ecl-u-bg-blue">
        <div className="ecl-container ecl-u-pv-m ecl-u-pv-lg-2xl">
          <h1 className="ecl-u-type-heading-1 ecl-u-type-color-white">
            Welcome to your EBSI wallet
          </h1>
        </div>
      </div>
      <div className="ecl-container ecl-u-flex-grow-1 ecl-u-pv-l">
        <h2 className="ecl-u-type-heading-2">Terms and Conditions</h2>
        <p className="ecl-u-type-paragraph">
          Find more information by{" "}
          <Link to="/termsAndConditions" className="ecl-link">
            clicking here
          </Link>
          .
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="ecl-form-group">
            <input
              type="checkbox"
              className="ecl-checkbox__input"
              id="terms"
              name="terms"
              ref={register({ required: true })}
            />
            <label
              htmlFor="terms"
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
          <button
            type="submit"
            className="ecl-button ecl-button--primary ecl-u-mt-l"
          >
            Continue
          </button>
          {errors.terms && (
            <div className="ecl-feedback-message ecl-u-mt-m">
              You must agree to the Terms and Conditions before continuing.
            </div>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Terms;
