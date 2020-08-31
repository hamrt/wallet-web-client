import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, act } from "@testing-library/react";
import Notifications from "./Notifications";
import * as mocks from "../../test/mocks/mocks";
import * as wallet from "../../apis/wallet";

const mockResponse = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    assign: mockResponse,
    reload: mockResponse,
  },
  writable: true,
});
const historyMock: any[] = [];

describe("notifications renders", () => {
  it("notifications should render without crashing", () => {
    expect.assertions(1);

    const wrapper = render(
      <BrowserRouter>
        <Notifications history={historyMock} />
      </BrowserRouter>
    );

    expect(wrapper).toBeDefined();
  });

  it("should display an error message if it can't get the notifications", async () => {
    expect.assertions(1);

    const spy = jest.spyOn(wallet, "getNotifications");
    spy.mockResolvedValue({ status: 400, data: "error message" });

    const { findByText } = render(
      <BrowserRouter>
        <Notifications history={historyMock} />
      </BrowserRouter>
    );

    const el = await findByText(
      "Error getting the notifications: error message"
    );
    expect(el).toBeDefined();
  });

  it("should get all the notifications and generate a NotificationItem for each one", async () => {
    expect.assertions(2);

    const spy = jest.spyOn(wallet, "getNotifications");
    spy.mockResolvedValue({ status: 200, data: mocks.getNotifications });

    const { container } = render(
      <BrowserRouter>
        <Notifications history={historyMock} />
      </BrowserRouter>
    );

    // https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    await act(() => Promise.resolve());

    // Should display 2 notifications
    expect(
      container.querySelectorAll(
        '[data-tut="reactour_notifications"] > article'
      )
    ).toHaveLength(2);

    // Should match snapshot
    expect(container).toMatchInlineSnapshot(`
      <div>
        <header
          class="ecl-site-header-harmonised--group1 ecl-site-header-harmonised"
        >
          <div
            class="ecl-site-header-harmonised__container ecl-container"
          >
            <div
              class="ecl-site-header-harmonised__top"
            >
              <a
                aria-label="European Commission"
                class="ecl-link ecl-link--standalone ecl-site-header-harmonised__logo-link"
                href="/profile"
              >
                <img
                  alt="European Commission logo"
                  class="ecl-site-header-harmonised__logo-image"
                  src="logo--en.svg"
                  title="European Commission"
                />
              </a>
            </div>
          </div>
          <nav
            aria-expanded="false"
            class="ecl-menu--group1 ecl-menu"
            data-ecl-auto-init="Menu"
            data-ecl-menu="true"
          >
            <div
              class="ecl-menu__overlay"
              data-ecl-menu-overlay="true"
            />
            <div
              class="ecl-container ecl-menu__container"
            >
              <a
                class="ecl-link ecl-link--standalone ecl-menu__open"
                data-ecl-menu-open="true"
                href="/"
              >
                <svg
                  aria-hidden="true"
                  class="ecl-icon ecl-icon--s"
                  focusable="false"
                >
                  <use
                    xlink:href="icons.svg#general--hamburger"
                  />
                </svg>
                Menu
              </a>
              <div
                class="ecl-menu__site-name"
              >
                EBSI Wallet
              </div>
              <section
                class="ecl-menu__inner"
                data-ecl-menu-inner="true"
              >
                <header
                  class="ecl-menu__inner-header"
                >
                  <button
                    class="ecl-menu__close ecl-button ecl-button--text"
                    data-ecl-menu-close="true"
                    type="button"
                  >
                    <span
                      class="ecl-menu__close-container ecl-button__container"
                    >
                      <svg
                        aria-hidden="true"
                        class="ecl-button__icon ecl-button__icon--before ecl-icon ecl-icon--s"
                        data-ecl-icon="true"
                        focusable="false"
                      >
                        <use
                          xlink:href="icons.svg#ui--close-filled"
                        />
                      </svg>
                      <span
                        class="ecl-button__label"
                        data-ecl-label="true"
                      >
                        Close
                      </span>
                    </span>
                  </button>
                  <div
                    class="ecl-menu__title"
                  >
                    Menu
                  </div>
                  <button
                    class="ecl-menu__back ecl-button ecl-button--text"
                    data-ecl-menu-back="true"
                    type="submit"
                  >
                    <span
                      class="ecl-button__container"
                    >
                      <svg
                        aria-hidden="true"
                        class="ecl-button__icon ecl-button__icon--before ecl-icon ecl-icon--s ecl-icon--rotate-270"
                        data-ecl-icon="true"
                        focusable="false"
                      >
                        <use
                          xlink:href="icons.svg#ui--corner-arrow"
                        />
                      </svg>
                      <span
                        class="ecl-button__label"
                        data-ecl-label="true"
                      >
                        Back
                      </span>
                    </span>
                  </button>
                </header>
                <ul
                  class="ecl-menu__list"
                >
                  <li
                    class="ecl-menu__item"
                    data-ecl-menu-item="true"
                  >
                    <a
                      class="ecl-menu__link"
                      data-ecl-menu-link="true"
                      href="/profile"
                    >
                      My Profile
                    </a>
                  </li>
                  <li
                    class="ecl-menu__item"
                    data-ecl-menu-item="true"
                  >
                    <a
                      class="ecl-menu__link"
                      data-ecl-menu-link="true"
                      href="/credentials"
                    >
                      Credentials
                    </a>
                  </li>
                  <li
                    class="ecl-menu__item"
                    data-ecl-menu-item="true"
                  >
                    <a
                      class="ecl-menu__link"
                      data-ecl-menu-link="true"
                      href="/notifications"
                    >
                      Notifications
                    </a>
                  </li>
                  <li
                    class="ecl-menu__item"
                    data-ecl-menu-item="true"
                  >
                    <a
                      class="ecl-menu__link"
                      data-ecl-menu-link="true"
                      href="/presentations"
                    >
                      Presentations
                    </a>
                  </li>
                  <li
                    class="ecl-menu__item"
                    data-ecl-menu-item="true"
                  >
                    <a
                      class="ecl-menu__link"
                      data-ecl-menu-link="true"
                      href="/"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </nav>
          <div
            class="container"
          >
            <div
              class="row"
            >
              <div
                class="col col"
              />
            </div>
          </div>
          <div
            class="ribbon"
            data-tut="reactour_header"
          >
            <a
              class="ribbonText"
              href="https://app.intebsi.xyz/demo"
            >
              EBSI DEMO
            </a>
          </div>
        </header>
        <div
          class="ecl-page-header-harmonised ecl-u-mt-l"
        >
          <div
            class="ecl-container"
          >
            <h1
              class="ecl-page-header-harmonised__title"
            >
              Notifications Page
            </h1>
          </div>
        </div>
        <div
          class="ecl-container"
        >
          <p>
            List of the pending notifications to be signed.
          </p>
        </div>
        <main
          class="ecl-container ecl-u-flex-grow-1 ecl-u-mb-l"
        >
          <div
            data-tut="reactour_notifications"
          >
            <article
              class="ecl-card ecl-card--tile notificationItem"
            >
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
                    src="european-union.png"
                    width="32"
                  />
                   
                  <a
                    class="ecl-link ecl-link--standalone"
                    href="/notifications"
                    type="button"
                  >
                    Request your eID Presentation
                  </a>
                </h1>
              </header>
              <div
                class="ecl-card__body"
              >
                <div
                  class="ecl-card__description"
                />
              </div>
              <footer
                class="ecl-card__footer"
              >
                <ul
                  class="ecl-card__info-container"
                >
                  <li
                    class="ecl-card__info-item"
                  >
                    <svg
                      aria-hidden="true"
                      class="ecl-icon ecl-icon--xs"
                      focusable="false"
                    >
                      <use
                        xlink:href="icons.svg#general--calendar"
                      />
                    </svg>
                    <span
                      class="ecl-card__info-label"
                    >
                      Invalid date
                    </span>
                  </li>
                </ul>
              </footer>
            </article>
            <article
              class="ecl-card ecl-card--tile notificationItem"
            >
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
                    src="european-union.png"
                    width="32"
                  />
                   
                  <a
                    class="ecl-link ecl-link--standalone"
                    href="/notifications"
                    type="button"
                  >
                    Store My Diploma
                  </a>
                </h1>
              </header>
              <div
                class="ecl-card__body"
              >
                <div
                  class="ecl-card__description"
                />
              </div>
              <footer
                class="ecl-card__footer"
              >
                <ul
                  class="ecl-card__info-container"
                >
                  <li
                    class="ecl-card__info-item"
                  >
                    <svg
                      aria-hidden="true"
                      class="ecl-icon ecl-icon--xs"
                      focusable="false"
                    >
                      <use
                        xlink:href="icons.svg#general--calendar"
                      />
                    </svg>
                    <span
                      class="ecl-card__info-label"
                    >
                      Invalid date
                    </span>
                  </li>
                </ul>
              </footer>
            </article>
          </div>
        </main>
        <footer
          class="ecl-footer-core"
        />
        <button
          class="ecl-button ecl-button--primary tourButton"
          title="Open guided tour"
          type="button"
        >
          ?
        </button>
      </div>
    `);

    spy.mockRestore();
  });
});
