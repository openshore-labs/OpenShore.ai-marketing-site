// The Design Partner Program in full (founder, 2026-11-24): the details that
// used to fill the foot of Pricing now live in a downloadable PDF, and the
// page keeps the summary. This file is the PDF's source:
// `npm run pdf:partners` renders it to
// src/static/enterprise/openshore-design-partner-program.pdf.
// The terms match the Design Partner Program doc and the business plan;
// change them together, then re-render the PDF. The free-setup offer and its
// count come from pilot.js, so the PDF says what the site says.
import pilot from "./pilot.js";

const freeSetup = pilot.open
  ? `No setup fee if you are one of the first ${pilot.spots} design partners, whether you stay or leave. After that, the ${pilot.setupFee} setup is paid when we install and credited against your first year if you stay`
  : `Your ${pilot.setupFee} setup, paid when we install, credited against your first year if you stay. If you leave at day 90, it covers the setup work`;

export default {
  title: "Design Partner Program",
  edition: "November 2026",
  for: "For startups of 2 to 300 people that are funded or earning revenue.",
  what: "OpenShore gives your team AI agents built by domain experts for sales ops, finance, supply chain, and more, with one context across every app you use, so you grow your business, not your headcount.",

  glance: [
    ["90-day pilot", "no monthly fee"],
    pilot.open
      ? ["No setup fee", `for the first ${pilot.spots} design partners`]
      : [`${pilot.setupFee} setup, once`, "credited back if you stay"],
    ["At day 90", "lock today’s price for two years, or walk away"],
    ["In return", "you help us shape it"],
  ],

  agents: [
    ["Sales ops agent", "Catches pay errors, like a deal credited to the wrong salesperson, before commissions go out."],
    ["Finance agent", "Matches every retailer deduction to an agreed promotion, disputes the rest, and drafts your monthly board pack."],
    ["Planning agent", "Flags a budget line the week it runs over, with a fix to keep the quarter on plan."],
    ["Supply chain agent", "Catches stock booked to the wrong warehouse before a best seller runs out."],
    ["Analytics agent", "Explains why a number moved, in a weekly review where every figure links to its source."],
  ],

  timeline: [
    ["Before we start", "A short signed agreement with your success measures and the day-90 decision. We walk your CFO through the numbers."],
    ["Setup", "We set up a dedicated cloud account and your model keys with you. Every agent starts read-only."],
    ["Days 1 to 90", "Agents work on your own data, tested against past numbers you trust. A structured review every two weeks."],
    ["Day 90", "Become a customer with today’s price locked for two years, or walk away. Your data stays in your cloud either way."],
  ],

  youGet: [
    "A 90-day pilot with no monthly OpenShore fee. You pay your own cloud and model bills, at cost",
    "Today’s price of $500 an agent per month, locked for two years, even if our list price goes up",
    freeSetup,
    "A real say in the roadmap: need an agent we don’t have yet? We build it with you",
    "First access to every new agent",
  ],
  weAsk: [
    "A short signed agreement, with your success measures and the day-90 decision, before anything is installed",
    "A sponsor who owns the budget, a named owner and a technical contact: whoever holds your cloud and admin accounts, not necessarily an engineer",
    "A dedicated cloud account for OpenShore, on your keys. We set it up with you",
    "Three months of past commission statements or month-end closes, so we can test against numbers you trust",
    "A structured review every two weeks, plus quick feedback whenever something comes up",
  ],
  guardrails: [
    "Read-only until you approve each workflow",
    "A person on your team signs off on every change",
    "By default we see service telemetry, like errors, uptime and versions, with no customer content. Anything deeper is with your permission, limited to that task, and logged",
    "We never sell your data or use it to train AI models",
    "Turn our access off, or leave, any time. Your data stays in your cloud",
  ],

  // After the pilot: the list prices from Pricing.
  prices: [
    ["Workspace", "Free for up to 10 people. From 11 on, everyone is billed.", "$8 a person / month"],
    ["Each Expert Agent", "Sales ops, Finance, Planning, Supply chain or Analytics, one per part of the business. Locked for two years for design partners.", "$500 a month"],
    ["Setup", pilot.open ? `Paid once. Free for the first ${pilot.spots} design partners.` : "Paid once, credited against the first year.", `${pilot.setupFee} one time`],
    ["Your AI", "Runs on your own model keys, billed by your provider. We never mark it up.", "At cost"],
    ["Some services", "Like ticket triage.", "By the work done"],
  ],

  founder: "Built by Jack Bigelow, who spent more than 15 years in operations, the last 10 building the revenue operations, planning and AI systems behind businesses as large as $200B at Amazon, AWS and Microsoft.",
  apply: "To apply, email jack@openshore.ai. Jack reads every message and replies personally.",
};
