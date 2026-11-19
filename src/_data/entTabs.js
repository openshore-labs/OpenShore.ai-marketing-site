// The tabs under the OpenShore header (founder, 2026-11-16).
// Product Tour is the gated platform page (worker/enterpriseAccess.js); the
// sign-in page the Worker draws carries the same tabs, so keep the two in step.
export default [
  { label: "Solutions", href: "/" },
  { label: "Product Tour", href: "/enterprise/platform/", locked: true },
  // Pricing and Security get their own tabs (founder, 2026-11-19: reorganize
  // the site by proven UI research). Business buyers name pricing as the
  // information they need most and look for it in the main navigation, and
  // the security review is its own audience; both sections moved off the
  // home page, unchanged, so the home keeps to what OpenShore is and does.
  { label: "Pricing", href: "/pricing/" },
  { label: "Security", href: "/security/" },
  { label: "Grow with Us", href: "/grow-with-us/" },
];
