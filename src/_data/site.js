// Single source of truth for openshore.ai.
//
// This site used to be the /os-code/ subpage of Open-Shore-LLC-Homepage
// (openshorellc.com). That corporate site now owns openshorellc.com; this repo
// is the standalone marketing site for OpenShore, at its own domain,
// openshore.ai. OpenShore remains a product of Open Shore, LLC.
export default {
  name: "OpenShore",
  legalName: "Open Shore, LLC",
  domain: "openshore.ai",
  url: "https://openshore.ai",

  // The site's home is OpenShore for Enterprise (founder, 2026-11-16); a page
  // with no description of its own falls back to this one.
  metaDescription:
    "Every company will run on people and AI. OpenShore for Enterprise is the workspace where your team and expert AI workers run the company together. Now piloting with design partners.",

  // The free personal coding agent's name and page (founder, 2026-11-16):
  // always the full name. Every page's footer links to it.
  personalName: "OS Code by OpenShore",
  personalUrl: "/os-code/",
  personalLine: "free personal coding agent",

  // The design-partner address, the one the Enterprise pages have used.
  enterpriseContact: "jack@openshore.ai",

  // General availability, stated once on the site, in Pricing (founder,
  // 2026-11-17). FOUNDER TO FILL IN before this ships, e.g. "Q2 2027".
  gaTarget: "[GA target: fill in]",

  // The parent company's site, credited from the OpenShore header and footer.
  parentUrl: "https://openshorellc.com",
  parentName: "Open Shore, LLC",

  emails: {
    // The one published address (founder F1, 2026-09-30), the same as the
    // app's SUPPORT_EMAIL, so the Terms, the privacy policy, and the app agree.
    oscode: "support@openshore.ai",
  },

  year: "2026",
};
