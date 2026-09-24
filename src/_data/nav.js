// The top tab row, one source of truth for every page's header (base.njk).
// Order is the walk a new visitor takes: what it is, the models you choose,
// how private it is, its footprint, the ethical floor, then how to run your
// own. Labels stay short so the row fits a phone; it scrolls if it must.
// "LLM Choice" became Models at /models/ (the old path 301s there, see
// static/_redirects) and "Ethical Standards" became Ethics (advisory org,
// 2026-09-24).
export default {
  tabs: [
    { label: "Platform", url: "/" },
    { label: "Models", url: "/models/" },
    { label: "Privacy", url: "/privacy/" },
    { label: "Sustainability", url: "/sustainability/" },
    { label: "Ethics", url: "/ethics/" },
    { label: "Self-Hosting", url: "/self-hosting/" },
  ],
};
