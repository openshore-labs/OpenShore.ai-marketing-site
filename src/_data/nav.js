// The top tab row, one source of truth for every page's header (base.njk).
// Order is the walk a new visitor takes: what it is, the models you choose,
// how private it is, its footprint, the ethical floor, then how to run your
// own. Labels stay short so the row fits a phone; it scrolls if it must.
export default {
  tabs: [
    { label: "Platform", url: "/" },
    { label: "LLM Choice", url: "/llm-choice/" },
    { label: "Privacy", url: "/privacy/" },
    { label: "Sustainability", url: "/sustainability/" },
    { label: "Ethical Standards", url: "/ethics/" },
    { label: "Self-Hosting", url: "/self-hosting/" },
  ],
};
