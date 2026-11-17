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

  // The Growth Principles: from the business plan, Appendix A (founder,
  // 2026-11-16; the plan calls them Business Principles). The second was
  // rewritten for the site on 2026-11-17 (founder): stay close, feedback
  // loops, prove it, then scale it to customers with the same need. The six
  // turn as one flywheel; each ends with the line that breaks a tie. The
  // sixth closes on the founder's tagline, the em dash the copy gate allows.
  principlesTitle: "Growth Principles",
  principlesLede:
    "Six principles guide every decision at OpenShore, from what we build to who we hire. Each one starts with the customer and feeds the next, so together they turn a flywheel of continuous growth, for our customers and for us. Each ends with the line we use to break a tie.",
  principles: [
    {
      title: "Embrace the energy. Harness it.",
      body: "Every startup runs on a founder’s passion: the energy, risk and belief they pour into building something new. We get to be in it with them. We stay curious about what drives each customer, we feel it, and we harness it into the work. Their energy feeds ours, and we carry it to the next founder.",
      decides: "We learn what drives a customer before we suggest how their business should work.",
    },
    {
      title: "Build together.",
      body: "We build as one team, and every customer is part of it. We stay close to each one, treat them as a design partner and build tight feedback loops, so what we deliver is exactly what their business needs. Once a solution has proven itself, we find the customers who share that need and scale it to them. No two businesses are alike, but every success becomes a standard we can share with the next.",
      decides: "When we’re unsure, we test it with a customer before we build it for everyone.",
    },
    {
      title: "Be creative.",
      body: "We make it a priority to think deeply and have fun doing it. Our creative spirit gives what we deliver an identity no one can replicate. Every lower price and new solution feeds a flywheel of energy and fulfillment in the work we do. It’s magnetic, and our customers feel it.",
      decides: "Before we accept the usual way, we try a new one.",
    },
    {
      title: "Build for choice.",
      body: "We never lock a customer into one provider. We integrate the best options for each customer and keep their context, connectors and keys in one place, so they can switch a model or provider without dropping the work they’ve started. As their needs change, they choose what to optimize: cost, service or security.",
      decides: "Before anything ships, we ask whether it keeps the customer free to change their mind.",
    },
    {
      title: "Private by default.",
      body: "Some customers lead with privacy, and others haven’t thought about where their customer data goes. Both get the same high bar. Their data stays in their own cloud with their keys, nothing moves without their yes, and every action is in plain view. The strictest setting is the default, so the customer who doesn’t ask is protected too.",
      decides: "When convenience and protection conflict, we protect the customer’s business.",
    },
    {
      title: "Working as one.",
      body: "We build human and AI communication into one platform. Founders, teams and AI teammates share the same chats, projects and approvals, in tight circles with fast feedback. The agent inventory shows every piece of work, by people and agents, in one place. Every Team — Every Agent. Working as One.",
      decides: "When a feature trades team autonomy against founder visibility, we redesign it until it gives both.",
    },
  ],

  // The founder's own story and voice (2026-11-16): the scope of his years
  // at Microsoft, AWS and Amazon (openshorellc.com), then his words on
  // leaving to consult for early-stage startups and why he does this work.
  // Keep it to scope, not the details of each role (his call).
  founder: {
    name: "Jack Bigelow",
    role: "Founder",
    // From the founder's LinkedIn profile photo (2026-11-16), round as there.
    photo: true,
    alt: "Jack Bigelow",
    linkedin: "https://www.linkedin.com/in/jackbigelow",
    paragraphs: [
      "I spent more than 15 years inside large companies, building the revenue operations, planning and AI systems behind businesses as large as $200B at Microsoft, AWS and Amazon.",
      "Then I left corporate to consult for early-stage startups, and I realized two things. First, I love the infectious energy of builders. Second, I had the keys to the scaffolding a company needs to scale: the operations, planning and systems that let a founder and their team focus on serving and selling to their customers.",
      "I love this work because I get to feed off the energy of people who are all in on their ideas and their customers. OpenShore is a solution I believe in, for customers I’m passionate about helping become winners.",
      "I’m building it with a small group of design partners, and I’d like to hear what you need.",
    ],
  },
};
