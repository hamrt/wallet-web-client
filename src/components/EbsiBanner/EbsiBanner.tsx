import React from "react";
import { Spinner } from "react-bootstrap";
import "./EbsiBanner.css";

type CallbackFunction = () => void;

type Props = {
  title: string;
  subtitle: string;
  isLoadingOpen: boolean;
};

const EbsiBanner = ({ title, subtitle, isLoadingOpen }: Props) => (
  <>
    <div className="ecl-page-header-harmonised ecl-u-mt-l">
      <div className="ecl-container">
        <h1 className="ecl-page-header-harmonised__title">{title}</h1>
      </div>
    </div>
    <div className="ecl-container">
      <p>{subtitle}</p>

      {isLoadingOpen && (
        <div className="ecl-u-mv-l">
          <Spinner animation="border" role="status" variant="danger">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  </>
);

EbsiBanner.defaultProps = {} as Partial<Props>;

export default EbsiBanner;
