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

  metaDescription:
    "OpenShore is a coding companion that runs on your own hardware. Chat and build with a stack of local models on iPhone and desktop, synced over your own private network, private by construction, with cloud one deliberate tap away on your own keys. Free for personal use; company seats from $20 a year.",

  // The parent company's site, credited from the OpenShore header and footer.
  parentUrl: "https://openshorellc.com",
  parentName: "Open Shore, LLC",

  emails: {
    // Existing, monitored mailbox (Open-Shore-LLC-Homepage src/_data/site.js).
    // Keep using it here rather than standing up an unrouted openshore.ai
    // alias; early-access + company-seat inquiries land in the same inbox.
    oscode: "os-code@openshorellc.com",
  },

  year: "2026",
};
