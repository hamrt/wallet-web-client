import React from "react";
import { ReactourStep } from "reactour";
import colors from "../config/colors";

const stepsCredentials: ReactourStep[] = [
  {
    selector: '[data-tut="reactour_creddentials"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <b style={{ color: colors.EC_BLUE }}>
            You will see here your credentials.
          </b>
          <br />
          Tap in the credential to see more details about it.
        </div>
      );
    },
    position: "left",
  },
  {
    selector: '[data-tut="reactour_header"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <b style={{ color: colors.EC_BLUE }}>Demonstration Flow.</b>
          <br />
          When you are on the Wallet and other pages and have completed your
          tasks there, don&#8217;t forget to tap on the &apos;EBSI DEMO&apos;
          button to return to the demonstration flow
        </div>
      );
    },
  },
];

const stepsNotifications: ReactourStep[] = [
  {
    selector: '[data-tut="reactour_notifications"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <b style={{ color: colors.EC_BLUE }}>
            You will see here your notifications.
          </b>
          <br />
          Tap in the notification to Verify it.
        </div>
      );
    },
    position: "left",
  },
  {
    selector: '[data-tut="reactour_header"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <b style={{ color: colors.EC_BLUE }}>Demonstration Flow.</b>
          <br />
          When you are on the Wallet and other pages and have completed your
          tasks there, don&#8217;t forget to tap on the &apos;EBSI DEMO&apos;
          button to return to the demonstration flow
        </div>
      );
    },
  },
];

const stepsPresentations: ReactourStep[] = [
  {
    selector: '[data-tut="reactour_presentations"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <b style={{ color: colors.EC_BLUE }}>
            You will see here your presentations.
          </b>
          <br />
          Tap in the presentation to see more details about it.
        </div>
      );
    },
    position: "left",
  },
  {
    selector: '[data-tut="reactour_header"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <b style={{ color: colors.EC_BLUE }}>Demonstration Flow.</b>
          <br />
          When you are on the Wallet and other pages and have completed your
          tasks there, don&#8217;t forget to tap on the &lsquo;EBSI DEMO&rsquo;
          button to return to the demonstration flow
        </div>
      );
    },
  },
];

const stepsProfile: ReactourStep[] = [
  {
    selector: '[data-tut="reactour_center"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <b style={{ color: colors.EC_BLUE }}>This is your profile page.</b>
          <br />
          In this area you can see your DID and manage your keys.
        </div>
      );
    },
    position: "center",
  },
  {
    selector: '[data-tut="reactour_header"]',
    content: function DemoHelperComponent() {
      return (
        <div>
          <b style={{ color: colors.EC_BLUE }}>Demonstration Flow.</b>
          <br />
          When you are on the Wallet and other pages and have completed your
          tasks there, don&#8217;t forget to tap on the &lsquo;EBSI DEMO&rsquo;
          button to return to the demonstration flow
        </div>
      );
    },
  },
];

export {
  stepsCredentials,
  stepsNotifications,
  stepsPresentations,
  stepsProfile,
};
