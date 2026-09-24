// Single source of truth for openshore.ai.
//
// This site used to be the /os-code/ subpage of Open-Shore-LLC-Homepage
// (openshorellc.com). That corporate site now owns openshorellc.com; this repo
// is the standalone marketing site for OpenShore, at its own domain,
// openshore.ai. OpenShore remains a product of Open Shore, LLC.
export default {
  name: "OpenShore",
  legalName: "Open Shore, LLC",
  // Rendered in the footer after the legal name (advisory org, 2026-09-24).
  legalForm: "a Delaware limited liability company",
  // The published business address is a commercial virtual mailbox the founder
  // supplies (DECISIONS.md, 2026-09-24). Leave it empty until that literal
  // address exists; the footer renders an address line only when this is set.
  // Never invent one, and never publish a residential address.
  address: "",
  domain: "openshore.ai",
  url: "https://openshore.ai",

  metaDescription:
    "OpenShore is a coding agent that runs on your own computer. DeepBlue, sized to your machine, reads and edits your repositories with changes you approve. Desktop for Linux, macOS, and Windows, with iPhone and iPad in private beta. Cloud only on your own key. Free during beta.",

  // The parent company's site, credited from the OpenShore header and footer.
  parentUrl: "https://openshorellc.com",
  parentName: "Open Shore, LLC",

  emails: {
    // Existing, monitored mailbox (Open-Shore-LLC-Homepage src/_data/site.js).
    // The only published address on the site for now (advisory org,
    // 2026-09-24): the openshore.ai role addresses go live only after a test
    // message makes the round trip. Beta, team plan, and early-access mail all
    // land in this inbox.
    oscode: "os-code@openshorellc.com",
  },

  // Footer notices. The glyphs on the download tiles are generic device
  // outlines, except Tux, which is credited here.
  trademarks:
    "Apple, iPhone, iPad, Mac and App Store are trademarks of Apple Inc. Windows is a trademark of Microsoft. Linux is the registered trademark of Linus Torvalds. Claude, OpenAI, Gemini, Kimi, Perplexity, Qwen, Tailscale, Ollama and Obsidian are trademarks of their owners. OpenShore is not affiliated with or endorsed by them.",
  tuxCredit: "Tux by Larry Ewing, created with The GIMP.",

  year: "2026",
};
