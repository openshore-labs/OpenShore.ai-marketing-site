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

  // The site's home is OpenShore (founder, 2026-11-18: the product is just
  // "OpenShore", no "for Enterprise"); a page with no description of its own
  // falls back to this one.
  metaDescription:
    "OpenShore gives your team AI agents that already know the job, built by domain experts for sales ops, finance, supply chain, and more, with one context across every app you use. Now onboarding design partners.",

  // The free personal coding agent's name and page (founder, 2026-11-16):
  // always the full name. Every page's footer links to it.
  personalName: "OS Code by OpenShore",
  personalUrl: "/os-code/",
  personalLine: "free personal coding agent",

  // The design-partner address, the one the Enterprise pages have used.
  enterpriseContact: "jack@openshore.ai",


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
