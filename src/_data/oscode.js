// OpenShore product page content. One source of truth for openshore.ai.
// Carried over verbatim from Open-Shore-LLC-Homepage's /os-code/ subpage
// (src/_data/oscode.js), which is now retired now that OpenShore has its own
// standalone site. The `oscode` naming (and the matching DOM ids/classes in
// openshore-app.js / openshore.css) is internal plumbing only, kept as-is to
// avoid a needless rename of working code.
//
// Pricing model: Free is chat only, no account. Personal is $20 a year and
// unlocks the coding agent plus the Marketplace for one person, buyable HERE on
// the web via Stripe, or on iPhone through Apple IAP. Commercial tiers are teams,
// billed per year and bought HERE on the web (Apple takes no cut). The Free card
// carries an early-access mailto so nothing dead-ends before a public download.
//
// No em dashes anywhere a customer reads (Open Shore standing instruction).
export default {
  headline: "Your machine. Your models. Your keys.",
  coda: "A coding companion you own, not one you rent.",
  // The one Fraunces line carries the thesis. This phrase inside the coda gets
  // the teal accent so ownership lands as a promise, not a whisper.
  codaAccent: "you own",

  // Live checkout config for the web purchase flow (openshore-app.js). These are
  // the PUBLIC Supabase URL + publishable key, safe to ship in client code; the
  // secret keys live only in the edge-function secrets (openshore.code.ai
  // repo's supabase/functions). Commercial seats are bought here and the
  // Stripe webhook writes the entitlement the app reads. Same project the
  // OpenShore app itself talks to (openshore.code.ai/app: VITE_SUPABASE_URL).
  checkout: {
    supabaseUrl: "https://lzlrlfdffwiypzreoldb.supabase.co",
    publishableKey: "sb_publishable_0mv-WAsZuZaBbhpzKZ0M1A_lrjBDbPb",
  },

  lede:
    "OpenShore is a coding companion that runs on your own hardware. Chat and build with a stack of local models on your iPhone and your desktop, kept in sync over your own private network. Cloud stays one deliberate tap away, always on your own account.",
  summary:
    "It is built the way software should be: local first, private by construction, and yours. Your models run where you put them. Your keys never leave your devices. Everything you make is encrypted at rest and answers only to you.",

  pillarsLabel: "What makes it different",
  pillars: [
    {
      name: "Local first",
      promise: "Your models run on your hardware, not someone else's cloud.",
      covers:
        "A pocket model on the iPhone, your big models on the desktop, reached over your own Tailscale network. On a plane with no signal, it still works.",
    },
    {
      name: "Your stack",
      promise: "One Reasoning LLM runs the show and routes every task.",
      covers:
        "Set the model that plans and reasons, then place specialists by category. It sends each task to the right model and covers anything you have not placed itself.",
    },
    {
      name: "Projects and Crew",
      promise: "Your work stays organized, and your agents are your own.",
      covers:
        "Group work into projects that keep their context together across chats. Build a crew of agents, each with a name, a persona, and a rule for how and when it is called.",
    },
    {
      name: "Launch",
      promise: "Take a finished build to the App Store or Google Play from inside the app.",
      covers:
        "The model walks you through every account and setting, then reads the build result directly, so a failure comes back to you as a fix, not a wall of logs.",
    },
    {
      name: "Private by construction",
      promise: "Sealed on your device, answering only to you.",
      covers:
        "Everything is encrypted at rest with AES-256. Cloud providers see only the calls you choose to make, on your own keys. No telemetry, no analytics, no phone-home, ever.",
    },
  ],

  howLabel: "How it works",
  how: [
    {
      name: "Bring your models",
      body:
        "Download a pocket model to the iPhone, or point OpenShore at the big models already on your desktop. Add a cloud model on your own key when you want one.",
    },
    {
      name: "Build your stack",
      body:
        "Pick the Reasoning LLM that runs the show, place specialists by category, and add the crew of agents that work the way you do.",
    },
    {
      name: "Ship it",
      body:
        "Build and launch to the app stores without leaving the app. The model guides the setup and reads every build result until you have a release.",
    },
  ],

  // BETA (2026-09-02, founder): every pay gate in the app is off, so the agent
  // and the Marketplace are free for everyone right now. Personal returns as a
  // $20 a year App Store subscription (Apple IAP only, no web purchase) when
  // the beta ends. Copy below is the CMO's; the beta note is the single place
  // that explains it so no card has to. Revert pricingLabel/pricingIntro, the
  // Personal card, and the two notes together when the gate comes back.
  pricingLabel: "Free to chat. Free to build, for now.",
  pricingIntro:
    "OpenShore runs on your machine, on your models, on your keys. We never see your code. Right now the agent and the Marketplace are free too. Grab it while beta's open.",
  betaNote:
    "Beta note: the coding agent and Marketplace are free for everyone in the app. Personal returns to $20 a year, in app, on the App Store, once beta ends.",
  teamNote:
    "Team seats buy shared admin and one company stack, not access. Every person already has the agent free during beta.",

  // Mirrors app/src/lib/plans.js. Free is chat only; Personal is one person at
  // $20 a year (buyable on the web via Stripe, or on iPhone via Apple IAP);
  // commercial bands are teams billed per year, each covering up to its top
  // number.
  plans: [
    {
      id: "free",
      segment: "For your own work",
      name: "Free",
      price: "$0",
      promise: "Full chat with the local models you already run.",
      includes: [
        "Chat with any local model, Harbor or Ollama",
        "Runs entirely on your hardware",
        "No account required, no telemetry",
        "Yours to keep, free forever",
      ],
      cta: "Get OpenShore",
      // Free tier: no checkout, an early-access mailto until a public download
      // exists.
      checkoutUrl: null,
    },
    {
      id: "personal",
      segment: "For one person",
      name: "Personal",
      // Beta: nothing charges anyone today, so the price says what is true
      // today; the future $20 lives in finePrint. Restore "$20 / year" and
      // "Most popular" when the gate returns.
      price: "Free",
      promise: "The whole app for one person. Chat becomes a coding agent.",
      includes: [
        "Everything in Free",
        "The coding agent: reads your repo, writes edits, runs tools",
        "Real diffs and tool approvals you control",
        "The full model Marketplace, rated to your hardware",
      ],
      cta: "Get early access",
      flagship: true,
      flagLabel: "Full access",
      // Personal is an Apple subscription only (founder, 2026-08-31): there is
      // no web purchase, so no Stripe button renders. The CTA routes to the
      // same early-access mailto as Free. openshore-app.js still carries the
      // old personal checkout branch; with no button it is unreachable.
      buyable: false,
      finePrint:
        "Free for everyone during the beta. After beta, Personal is $20 a year, bought only in the app through the App Store.",
      checkoutUrl: null,
    },
    {
      id: "commercial_micro",
      segment: "For teams",
      name: "Micro",
      price: "$20 / year",
      promise: "Up to 5 people, one company umbrella.",
      includes: [
        "Everything in Personal, for every person on the team",
        "An admin who owns the shared stack and where it all lives",
        "Each person keeps their own chats, projects, and crew",
      ],
      cta: "Start Micro",
      checkoutUrl: null, // TODO: Stripe Payment Link for Micro
    },
    {
      id: "commercial_small",
      segment: "For teams",
      name: "Small",
      price: "$100 / year",
      promise: "6 to 30 people.",
      includes: [
        "Everything in Micro",
        "Add and remove people by email, grant admin to others",
        "One shared stack the admin controls",
      ],
      cta: "Start Small",
      checkoutUrl: null, // TODO: Stripe Payment Link for Small
    },
    {
      id: "commercial_mid",
      segment: "For teams",
      name: "Growth",
      price: "$250 / year",
      promise: "31 to 100 people.",
      includes: ["Everything in Small", "Room to grow across the whole company"],
      cta: "Start Growth",
      checkoutUrl: null, // TODO: Stripe Payment Link for Growth
    },
    {
      id: "commercial_large",
      segment: "For teams",
      name: "Scale",
      price: "$500 / year",
      promise: "More than 100 people.",
      includes: ["Everything in Growth", "One flat price, however large the team"],
      cta: "Start Scale",
      checkoutUrl: null, // TODO: Stripe Payment Link for Scale
    },
  ],

  // A quiet trust row rendered under the pricing cards.
  reassurance: [
    { label: "Local-first.", body: "Your models run on your hardware." },
    { label: "Private by default.", body: "No code leaves your machine, no telemetry." },
    { label: "One year, one price.", body: "Cancel anytime, keep working through the term." },
  ],

  close:
    "OpenShore is getting ready for launch. Join the early access list and we will tell you the moment it is on the App Store, and set your company up with seats when you are ready.",

  earlyAccessSubject: "OpenShore early access",
  earlyAccessBody:
    "I would like early access to OpenShore. Tell me when it launches.",
  fabLabel: "Get early access",
};
