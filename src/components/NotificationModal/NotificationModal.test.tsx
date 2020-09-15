import React from "react";
import { BrowserRouter } from "react-router-dom";
import {
  render,
  waitForElementToBeRemoved,
  act,
  waitFor,
  screen,
} from "@testing-library/react";
import { NotificationModal } from "./NotificationModal";
import * as mocks from "../../test/mocks/mocks";
import * as idHub from "../../apis/idHub";
import * as issuerUtils from "../../utils/issuer";
import * as transformUtils from "../../utils/StringTransformation";

describe("modal of type RequestPresentationModal", () => {
  it("should render without crashing", () => {
    expect.assertions(1);
    const notification = mocks.getNotification;
    const cb = jest.fn();
    const wrapper = render(
      <BrowserRouter>
        <NotificationModal
          notification={notification}
          methodToClose={cb}
          methodToAccept={cb}
          methodToSign={cb}
          isModalNotificationOpen
        />
      </BrowserRouter>
    );

    expect(wrapper).not.toBeNull();
  });

  it("should display the modal", async () => {
    expect.assertions(8);
    const notification = mocks.getNotification;
    const cb = jest.fn();

    const idHubSpy = jest
      .spyOn(idHub, "getCredentialsForPresentation")
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ status: 200, data: mocks.getCredentials });
            }, 200);
          })
      );

    const issuerUtilsSpy = jest
      .spyOn(issuerUtils, "getIssuer")
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve("Fake issuer");
            }, 200);
          })
      );

    jest.spyOn(transformUtils, "modifyName").mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve("My Fake Verifiable eID");
          }, 200);
        })
    );

    render(
      <BrowserRouter>
        <NotificationModal
          notification={notification}
          methodToClose={cb}
          methodToAccept={cb}
          methodToSign={cb}
          isModalNotificationOpen
        />
      </BrowserRouter>
    );

    // Modal at first render
    const modal = window.document.querySelector('[role="dialog"]');

    if (!modal) {
      throw new Error("Can't find the modal");
    }

    expect(modal.querySelector(".modal-header")).toMatchInlineSnapshot(`
      <div
        class="ModalHeader modal-header"
      >
        <div
          class="modal-title h4"
        >
          Create presentation
        </div>
        <div
          class="spinner spinner-border text-danger"
          role="status"
        >
          <span
            class="sr-only"
          >
            Loading...
          </span>
        </div>
        <button
          class="close"
          type="button"
        >
          <span
            aria-hidden="true"
          >
            ×
          </span>
          <span
            class="sr-only"
          >
            Close
          </span>
        </button>
      </div>
    `);

    expect(modal.querySelector(".modal-body")).toMatchInlineSnapshot(`
      <div
        class="modal-body"
      >
        
        <p
          class="ecl-u-type-paragraph"
        >
          <strong>
            Select: Verifiable eID Credential
          </strong>
        </p>
      </div>
    `);

    expect(modal.querySelector(".modal-footer")).toMatchInlineSnapshot(`
      <div
        class="modal-footer"
      >
        <button
          class="ecl-button ecl-button--ghost"
          type="button"
        >
          Close
        </button>
        <button
          class="ecl-button ecl-button--primary"
          type="button"
        >
          Create presentation
        </button>
      </div>
    `);

    // Wait until the spinner disappears
    await waitForElementToBeRemoved(
      window.document.querySelector('.spinner[role="status"]')
    );

    // And wait until the requests have resolved
    await waitFor(() => screen.getByText(/requested a presentation/i));
    await waitFor(() => screen.getByText(/My Fake Verifiable eID/i));

    // Now, check that the credentials are correctly loaded and displayed
    expect(issuerUtilsSpy).toHaveBeenCalledTimes(1);

    expect(idHubSpy).toHaveBeenCalledTimes(1);

    expect(modal.querySelector(".modal-body")).toHaveTextContent(
      "did:ebsi:0xBDB8618DE3ecdF37a4f13caAC7d9abc097bf9FC2 requested a presentation."
    );

    expect(modal.querySelector(".modal-body")).toHaveTextContent(
      "Select: Verifiable eID Credential"
    );

    expect(modal.querySelector(".credentialItem")).toMatchInlineSnapshot(`
      <article
        class="credentialItem ecl-card"
      >
        <div
          class="checkbox ecl-checkbox"
        >
          <input
            class="ecl-checkbox__input"
            id="cred-c37a7d50-638b-11ea-a961-e72ecff4092c"
            name="cred-c37a7d50-638b-11ea-a961-e72ecff4092c"
            type="checkbox"
          />
          <div
            class="ecl-checkbox__label"
          >
            <span
              class="ecl-checkbox__box"
            >
              <svg
                aria-hidden="true"
                class="ecl-checkbox__icon ecl-icon ecl-icon--s"
                focusable="false"
              >
                <use
                  xlink:href="icons.svg#ui--check"
                />
              </svg>
            </span>
          </div>
        </div>
        <header
          class="ecl-card__header"
        >
          <h1
            class="ecl-card__title"
          >
            <img
              alt=""
              class="rounded mr-2"
              height="32"
              src="diploma.png"
              width="32"
            />
             
            My Fake Verifiable eID
          </h1>
        </header>
        <div
          class="ecl-card__body"
        >
          <div
            class="ecl-card__description"
          >
            Issued by: 
            Fake issuer
          </div>
        </div>
      </article>
    `);
  });
});

describe("modal of type StoreCredentialModal", () => {
  it("should render without crashing", async () => {
    expect.assertions(1);
    const notification = mocks.getStoreCredentialNotification;
    const cb = jest.fn();
    let wrapper;
    await act(async () => {
      wrapper = render(
        <BrowserRouter>
          <NotificationModal
            notification={notification}
            methodToClose={cb}
            methodToAccept={cb}
            methodToSign={cb}
            isModalNotificationOpen
          />
        </BrowserRouter>
      );
    });

    expect(wrapper).not.toBeNull();
  });
});

describe("modal of type SignPayloadModal", () => {
  it("should render without crashing", async () => {
    expect.assertions(1);
    const notification = mocks.getSignPayloadNotification;
    const cb = jest.fn();
    let wrapper;
    await act(async () => {
      wrapper = render(
        <BrowserRouter>
          <NotificationModal
            notification={notification}
            methodToClose={cb}
            methodToAccept={cb}
            methodToSign={cb}
            isModalNotificationOpen
          />
        </BrowserRouter>
      );
    });

    expect(wrapper).not.toBeNull();
  });
});

describe("modal of type SignTransactionModal", () => {
  it("should render without crashing", async () => {
    expect.assertions(1);
    const notification = mocks.getSignTransactionNotification;
    const cb = jest.fn();
    let wrapper;
    await act(async () => {
      wrapper = render(
        <BrowserRouter>
          <NotificationModal
            notification={notification}
            methodToClose={cb}
            methodToAccept={cb}
            methodToSign={cb}
            isModalNotificationOpen
          />
        </BrowserRouter>
      );
    });

    expect(wrapper).not.toBeNull();
  });
});

describe("modal of type unknow", () => {
  it("should return an empty div", async () => {
    expect.assertions(1);
    const notification = mocks.getUnknownNotification;
    const cb = jest.fn();
    const wrapper = render(
      <BrowserRouter>
        <NotificationModal
          notification={notification}
          methodToClose={cb}
          methodToAccept={cb}
          methodToSign={cb}
          isModalNotificationOpen
        />
      </BrowserRouter>
    );

    expect(wrapper.container).toMatchInlineSnapshot(`<div />`);
  });
});
