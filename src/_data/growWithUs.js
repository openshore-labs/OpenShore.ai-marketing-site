// Grow with Us (/grow-with-us/), founder 2026-11-16: the mission, then the
// principles from the business plan's appendix, then a short profile of the
// founder with a photo.
//
// A section with nothing in it is left off the page, so nothing here is a
// placeholder a visitor could see. Fill these from the founder's own words:
//   principles  [{ title, body }] from the business plan's appendix
//   founder     name, role, paragraphs (strings), and photo once the file is at
//               src/static/enterprise/founder.jpg (set photo: true, and alt)
export default {
  mission:
    "To be Earth’s most startup-obsessed company, building the workspaces and products that spark startup innovation and carry it to scale.",
  missionLine: "We win only when our customers win, so we grow with them.",

  principles: [],

  // Tailored for design partners from the founder's own background on
  // openshorellc.com (open-shore-llc-homepage, src/index.njk and the track
  // record in src/_data/site.js). Every fact is from there; keep it so.
  founder: {
    name: "Jack Bigelow",
    role: "Founder",
    // From the founder's LinkedIn profile photo (2026-11-16), round as there.
    photo: true,
    alt: "Jack Bigelow",
    linkedin: "https://www.linkedin.com/in/jackbigelow",
    paragraphs: [
      "For over a decade I built the revenue operations, planning and AI systems behind some of the fastest-growing businesses in tech, across portfolios of up to about $200B at Microsoft, AWS and Amazon.",
      "At AWS I built the sales-planning function from near zero during hypergrowth and shipped an AI extension to Salesforce that more than 10,000 sellers used each month. At Microsoft I redesigned the worldwide commercial sales operating cadence and built the automation platform behind it.",
      "Those businesses had whole teams for revenue ops, finance and planning. A growing startup needs the same work long before it can hire for it. OpenShore is how I want to give it to them: expert AI workers beside the team, with a person approving every change.",
      "I’m building it with a small group of design partners, and I’d like to hear what you need.",
    ],
  },
};
