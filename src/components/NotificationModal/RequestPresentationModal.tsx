import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import cloneDeep from "lodash.clonedeep";
import "./NotificationModal.css";
import * as transform from "../../utils/StringTransformation";
import * as models from "../../models/Models";
import * as idHub from "../../apis/idHub";
import { parseDecodedData } from "../../utils/strB64dec";
import areStringArraysEqual from "../../utils/util";
import CredentialItemPresentation from "../CredentialItemPresentation/CredentialItemPresentation";
import { INotification } from "../../dtos/notifications";
import { presentations } from "../../dtos";
import { IAttribute } from "../../dtos/attributes";
import { getIssuerName } from "../../utils/issuer";

type CallbackFunction = () => void;
type CallbackFunctionAccept = (notification: INotification) => void;

type Props = {
  notification: INotification;
  isModalNotificationOpen: boolean;
  methodToClose: CallbackFunction;
  methodToAccept: CallbackFunctionAccept;
};

export const RequestPresentationModal: React.FunctionComponent<Props> = ({
  notification,
  methodToClose,
  isModalNotificationOpen,
  methodToAccept,
}: Props) => {
  const [credentials, setCredentials] = useState<IAttribute[]>([]);
  const [issuerName, setIssuerName] = useState<string>("");
  const [formattedTypes, setFormattedTypes] = useState<string>("");
  const [
    notificationForPresentations,
    setNotificationForPresentations,
  ] = useState<INotification>(models.notification);
  const [isReadingCreds, setIsReadingCreds] = useState(true);

  const getRequiredCredsNumber = () => {
    const dataParsed = parseDecodedData(
      notificationForPresentations?.message?.data?.base64
    );
    const { type } = presentations.presentationInputFromJSON(dataParsed);
    if (!type) return 0;
    return type.length;
  };

  const validateCredentialsType = () => {
    const dataParsed = parseDecodedData(
      notificationForPresentations.message.data.base64
    );
    const { type } = presentations.presentationInputFromJSON(dataParsed);

    if (!type || !notificationForPresentations.selectedCredsTypes) return true;
    if (notificationForPresentations.selectedCredsTypes.length <= 0)
      return true;
    if (!Array.isArray(notificationForPresentations.selectedCredsTypes[0]))
      return true;
    const { selectedCredsTypes } = notificationForPresentations;
    // check that all types requested are the ones selected
    const equals = areStringArraysEqual(type, selectedCredsTypes);

    return equals;
  };

  const validateSelectedCredentialsNumber = () => {
    // the number of selected credentials should be the same as requested
    const nSelectedCreds =
      notificationForPresentations?.selectedCredentials?.length;
    return nSelectedCreds >= getRequiredCredsNumber();
  };

  const select = (hash: string, type: string[]) => {
    const notificationAux = cloneDeep(notificationForPresentations);
    const index = notificationAux.selectedCredentials.indexOf(hash);
    if (index === -1) {
      notificationAux.selectedCredentials.push(hash);
      notificationAux.selectedCredsTypes.push(type);
    } else {
      notificationAux.selectedCredentials.splice(index, 1);
      notificationAux.selectedCredsTypes.splice(index, 1);
    }

    setNotificationForPresentations(notificationAux);
  };

  useEffect(() => {
    let isMounted = true;

    const getCredentials = async (notif: INotification) => {
      setCredentials([]);
      setIsReadingCreds(true);
      const { status, data } = await idHub.getCredentialsForPresentation(notif);

      if (isMounted && (status === 200 || status === 201)) {
        const creds = (data.items as IAttribute[]).filter(
          (credential) =>
            Array.isArray(credential.type) &&
            credential.type.length > 0 &&
            credential.type.includes("VerifiableCredential")
        );

        if (notif) {
          setNotificationForPresentations(notif);
        }

        // Filter out unrelated credentials
        const requestedTypes = (parseDecodedData(
          notification?.message?.data?.base64
        ) as any).type;

        const matchTypes = (cred: any) =>
          requestedTypes.some((r: any) =>
            (Array.isArray(cred.type)
              ? cred.type
              : [cred.type]
            ).every((c: any) => r.includes(c))
          );

        setCredentials(creds.filter(matchTypes));
        setIsReadingCreds(false);
      }
    };

    const fetchIssuerName = async () => {
      setIssuerName("");
      const name = await getIssuerName(notification.sender);
      if (isMounted) {
        setIssuerName(name);
      }
    };

    const getRequiredCredsFormatedType = () => {
      const dataParsed = parseDecodedData(notification?.message?.data?.base64);
      const { type } = presentations.presentationInputFromJSON(dataParsed);
      setFormattedTypes(transform.getSelectRequestedCredentialsText(type));
    };

    getCredentials(notification);
    fetchIssuerName();
    getRequiredCredsFormatedType();

    return () => {
      isMounted = false;
    };
  }, [notification]);

  return (
    <Modal
      show={
        isModalNotificationOpen && notification.message.notificationType === 2
      }
      onHide={methodToClose}
    >
      <Modal.Header className="ModalHeader" closeButton>
        <Modal.Title>Create presentation</Modal.Title>
        {isReadingCreds && (
          <Spinner
            className="spinner"
            animation="border"
            role="status"
            variant="danger"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </Modal.Header>
      <Modal.Body>
        {issuerName && (
          <p className="ecl-u-type-paragraph">
            {issuerName} requested a presentation.
          </p>
        )}
        {formattedTypes && (
          <p className="ecl-u-type-paragraph">
            <strong>{formattedTypes}</strong>
          </p>
        )}
        {!isReadingCreds && credentials.length === 0 && (
          <p>
            You don&#8217;t have any credential at the moment. Follow the
            demonstrator to create some.
          </p>
        )}
        {!isReadingCreds &&
          credentials.map((filteredCred) => (
            <CredentialItemPresentation
              credential={filteredCred}
              key={filteredCred.id}
              methodToSelect={select}
              defaultChecked={
                notificationForPresentations.selectedCredentials.indexOf(
                  filteredCred.hash
                ) >= 0
              }
            />
          ))}
        {validateSelectedCredentialsNumber() && !validateCredentialsType() && (
          <p className="ecl-u-type-color-red">
            Please, select the Credentials types specified.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="ecl-button ecl-button--ghost"
          type="button"
          onClick={methodToClose}
        >
          Close
        </button>
        <button
          className="ecl-button ecl-button--primary"
          type="button"
          onClick={() => methodToAccept(notificationForPresentations)}
          disabled={
            !validateSelectedCredentialsNumber() || !validateCredentialsType()
          }
        >
          Create presentation
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestPresentationModal;
