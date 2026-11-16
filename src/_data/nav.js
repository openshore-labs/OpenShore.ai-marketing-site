// The OS Code by OpenShore pages' tab row, one source of truth for every
// base.njk header. OpenShore for Enterprise has its own header
// (ent-layout.njk), and this product stays out of it (founder, 2026-11-16).
// Order is the walk a new visitor takes: what it is, the models you choose,
// how private it is, its footprint, the ethical floor, then how to run your
// own. Labels stay short so the row fits a phone; it scrolls if it must.
export default {
  tabs: [
    { label: "Overview", url: "/os-code/" },
    { label: "LLM Choice", url: "/about/llm-choice/" },
    { label: "Privacy", url: "/about/privacy/" },
    { label: "Sustainability", url: "/about/sustainability/" },
    { label: "Ethical Standards", url: "/about/ethics/" },
    { label: "Self-Hosting", url: "/about/self-hosting/" },
  ],
};
