// OpenShore product page content. One source of truth for openshore.ai.
// Carried over from Open-Shore-LLC-Homepage's /os-code/ subpage
// (src/_data/oscode.js), which is now retired now that OpenShore has its own
// standalone site. The `oscode` naming (and the matching DOM ids/classes in
// openshore-app.js / openshore.css) is internal plumbing only, kept as-is to
// avoid a needless rename of working code.
//
// Copy follows the advisory org's rulings and the CMO + CX copy review of
// 2026-09-24 (openshore.code.ai os-code/DECISIONS.md). Every claim here was
// checked against the app. Test copy stays conditional ("give it your test
// command") until test-command detection is measured.
//
// Pricing model: Free is chat only, no account. Personal is $20 a year after
// beta, bought only in the app through the App Store. Team plans are billed per
// year; team billing is dormant during beta, so the team buttons are email
// links for now. The web checkout code in openshore-app.js stays but no button
// reaches it.
//
// No em dashes anywhere a customer reads (Open Shore standing instruction).
export default {
  headline: "Your machine. Your models. Your keys.",
  coda: "Models you run at home, within reach of your phone. Never stop building.",
  // The one Fraunces line carries the byline. This phrase inside the coda gets
  // the teal accent. "Never stop" is about the person; nothing near it says
  // agents run nonstop.
  codaAccent: "Never stop building.",
  // The supporting line under the horizon defines "home" once, so every later
  // privacy line on the site can stay short and true.
  heroNote:
    "Your code never leaves home unless you send it. Home is your own devices and the private network between them.",
  heroPrimary: { label: "Download free", href: "#get-app" },
  heroSecondary: { label: "On iPhone? Join the beta" },

  // The iPhone and iPad app is a private TestFlight beta; every "join the beta"
  // ask is an email with this subject.
  betaSubject: "OpenShore iPhone beta (TestFlight)",

  // Live checkout config for the web purchase flow (openshore-app.js). These are
  // the PUBLIC Supabase URL + publishable key, safe to ship in client code; the
  // secret keys live only in the edge-function secrets (openshore.code.ai
  // repo's supabase/functions). Same project the OpenShore app itself talks to
  // (openshore.code.ai/app: VITE_SUPABASE_URL).
  checkout: {
    supabaseUrl: "https://lzlrlfdffwiypzreoldb.supabase.co",
    publishableKey: "sb_publishable_0mv-WAsZuZaBbhpzKZ0M1A_lrjBDbPb",
  },

  lede:
    "OpenShore is a coding agent that runs on your own computer. The desktop app for Linux, macOS, and Windows sets up DeepBlue, a coding model sized to your machine, which reads your repositories and edits them with changes you approve. The iPhone and iPad app, in private beta, reaches it over your own private network. Cloud models are there when you want one, on your own key.",
  summary:
    "Most coding agents are rented. You pay by the month or by the token, and your code travels to someone else's servers. OpenShore keeps the agent on a computer you own, and your keys go only to the provider they belong to.",

  // Download tile grid, the marketing mirror of uki.audio's own get-app
  // section (same shape, same honesty rule from that page's own comment: a
  // tile only goes live once its URL is real, otherwise it reads as hype).
  // Linux, Windows, and macOS are all genuinely live as of v0.1.2
  // (2026-09-17): release.yml publishes Linux and Windows to one real GitHub
  // Release on every push of a v* tag; the mac-desktop Codemagic workflow
  // publishes the unsigned dmg/zip to that same release on demand. All three
  // link to the releases page rather than a specific asset on purpose:
  // electron-builder's installer filenames embed the version, so a hardcoded
  // direct link goes stale the next release. iPhone and iPad are a private
  // TestFlight beta, so that tile asks for an invite by email. Android is not
  // built, so it has no tile. A tile with status "soon" renders as a quiet,
  // non-interactive card with a "Coming soon" chip.
  getAppsLabel: "Download",
  getAppsTitle: "Start on the computer you already own.",
  getAppsLede:
    "Linux, macOS, and Windows are direct downloads today. On the release page, pick the file for your system: .dmg for Mac, .exe for Windows, AppImage or .deb for Linux. The Mac app isn't signed by Apple yet, so the first time you open it, right-click it and choose Open. iPhone and iPad are in private beta on TestFlight; write to us for an invite. Android isn't built yet.",
  getApps: [
    {
      id: "linux",
      label: "Linux",
      sub: "Direct download · AppImage or .deb",
      href: "https://github.com/openshore-labs/openshore.code.ai/releases/latest",
      status: "live",
      newTabNote: "(opens GitHub in a new tab)",
    },
    {
      id: "mac",
      label: "Mac",
      sub: "Direct download · unsigned .dmg",
      href: "https://github.com/openshore-labs/openshore.code.ai/releases/latest",
      status: "live",
      newTabNote: "(opens GitHub in a new tab)",
    },
    {
      id: "windows",
      label: "Windows",
      sub: "Direct download · .exe installer",
      href: "https://github.com/openshore-labs/openshore.code.ai/releases/latest",
      status: "live",
      newTabNote: "(opens GitHub in a new tab)",
    },
    {
      id: "ios",
      label: "iPhone & iPad",
      sub: "Private beta on TestFlight",
      // An email link, not a download: index.njk builds the beta mailto.
      status: "invite",
      chip: "Ask for an invite",
    },
  ],

  // The three curated models (founder, 2026-09-21). The Marketplace is grayed
  // to "Coming soon" in the app, so the site never sells it as live.
  modelsLabel: "Three models",
  modelsTitle: "One to show you around, two to write code.",
  models: [
    {
      name: "Harbor Lite",
      body: "Built into the phone app. Works with no signal. A guide that shows you around and hands you off; it doesn't write code.",
    },
    {
      name: "Harbor",
      body: "A small coder on your iPhone for short edits, with web search. Longer work happens on your computer.",
    },
    {
      name: "DeepBlue",
      body: "The coding agent on your desktop. Qwen 2.5 Coder, sized to your computer, set up in one tap. It edits your repositories, and your phone reaches it when docked.",
    },
  ],

  // The mission used to live here as its own "Why OpenShore exists" section
  // on the Platform tab. It repeated ground the pillars and the topic tabs
  // cover, so it was cut rather than trimmed (2026-09-17).

  pillarsLabel: "What's different",
  pillars: [
    {
      name: "Runs at home",
      promise: "Your models run on your hardware.",
      covers:
        "DeepBlue on your desktop, Harbor on your phone, linked over your own Tailscale network. With no signal at all, the phone's own model still answers.",
    },
    {
      name: "Checks its own work",
      promise:
        "It starts from a map of your project, and with your test command it checks the work before it says done.",
      covers:
        "When a test fails, it reads the failure and tries again. The model stays the same; the work around it changes.",
    },
    {
      name: "Your Stack, your call",
      promise: "One model plans. You pick the rest.",
      covers:
        "Choose the model that plans the work and place others by job: coding, writing, analysis, image reading. Swap any of them any time.",
    },
    {
      name: "Repositories and Vault",
      promise: "Your code and your notes, in files you own.",
      covers:
        "Connect a repo where it lives, on your disk, iCloud Drive, or Google Drive. The Vault is a markdown knowledge base that Obsidian opens as is.",
    },
    {
      name: "Crew routines",
      promise: "Named agents on a schedule, on your own computer.",
      covers:
        "Give a crew member a task, a workspace, and a clock. It runs while your computer is on and leaves a dated note in your Vault, with the transcript one tap away.",
    },
    {
      name: "Private, nothing hidden",
      promise: "Sealed on your device. The one record that can leave is written down.",
      covers:
        "Keys and chats are sealed on your device. On Linux that needs a system keyring; the app tells you if yours doesn't have one. Cloud providers see only the calls you choose to make, on your own keys. No telemetry. When you're signed in, a block sends a short record without your text to your account, and the Privacy page lists what it holds.",
    },
  ],

  howLabel: "How it works",
  howTitle: "Set it up once at your desk. Then keep going from your phone.",
  how: [
    {
      name: "Install the desktop app",
      body: "It starts the engine when it opens and keeps running in the tray.",
    },
    {
      name: "Get DeepBlue",
      body: "One tap sets up Qwen 2.5 Coder through Ollama, sized to your computer. If Ollama isn't installed, the app helps you get it.",
    },
    {
      name: "Pair your phone",
      body: "Each phone scans its own one-time QR code. Docked, it uses your computer's models. Offshore, when your computer is out of reach, it uses cloud on your key and its own model. Offline, only the model on the phone.",
    },
    {
      name: "Ask",
      body: "DeepBlue works from a map of your project and proposes changes you approve. Give it your test command and it runs the tests and tries again when they fail.",
    },
    {
      name: "Ship it",
      body: "Launch a build to TestFlight, the App Store, or Google Play from inside the app.",
    },
  ],

  beforeLabel: "Before you start",
  beforeTitle: "Two things worth knowing first.",
  before: [
    {
      label: "A small model does small jobs.",
      body: "On a modest computer, DeepBlue handles focused, well-scoped changes. For big changes, use a larger size on a stronger computer, or a cloud model on your own key.",
    },
    {
      label: "Your computer has to be awake.",
      body: "When it sleeps, work in progress stops, and scheduled tasks wait until it wakes.",
    },
  ],

  // Everything inside: the full feature set at a glance, one line each. Rendered
  // as the quiet label-plus-line list so it scans, and stays honest about state.
  piecesLabel: "Everything inside",
  piecesIntro:
    "The whole product, one line each. Every piece runs on your models by default and asks before anything costs you money.",
  pieces: [
    {
      label: "A real coding agent.",
      body: "Reads your repo, edits with changes you approve, runs commands with your say so, and searches the web with citations. Give it your test command and it checks its work before it says done.",
    },
    {
      // Speech is recognized on the device on iPhone; on the desktop, voice
      // asks before any audio goes to a speech service (advisory org,
      // 2026-09-24). So this line makes no on-device claim; the Privacy page
      // says the rest.
      label: "Voice mode.",
      body: "In testing. Talk to it instead of typing.",
    },
    {
      label: "Video and image attachments.",
      body: "Attach a screen recording or a photo. A clip is read frame by frame by an image reading model.",
    },
    {
      label: "Three models to start.",
      body: "Harbor Lite is built into the phone app and shows you around, offline. Harbor writes and explains code in chat on your phone. DeepBlue edits your repositories from your desktop.",
    },
    {
      label: "Bring your own model.",
      body: "Connect any OpenAI compatible endpoint you run yourself, on your own server.",
    },
    {
      label: "Cloud on your key.",
      body: "Claude, OpenAI, Gemini, and Kimi on your own account, plus Perplexity Sonar for research. Spend asks first.",
    },
    {
      label: "Projects and memory.",
      body: "Work stays organized in projects, and the agent keeps its notes inside your repo, committed with the code.",
    },
    {
      label: "Stack Health.",
      body: "See what your stack is doing, what it saved you, and its estimated footprint, refreshed daily.",
    },
    {
      label: "Built to a bar.",
      body: "What the agent builds follows a written UX standard, and what it writes avoids the usual AI tells. You can turn either off.",
    },
    {
      label: "Launch.",
      body: "Take a finished build to the App Store or Google Play from inside the app, with the model reading each build result.",
    },
    {
      label: "Runs everywhere.",
      body: "Desktop for Linux, macOS, and Windows today. iPhone and iPad are in private beta on TestFlight. Android isn't built yet.",
    },
  ],

  // BETA (2026-09-02, founder): every pay gate in the app is off, so the agent
  // is free for everyone right now. Personal returns as a $20 a year App Store
  // subscription when the beta ends. Team billing is dormant, so team buttons
  // are email links until it opens. Revert pricingIntro, the Personal card,
  // the team buttons, and the notes together when billing comes back.
  pricingLabel: "Free to chat. Free to build, for now.",
  pricingIntro:
    "OpenShore runs on your machine, on your models, on your keys, and we never see your code. During beta the coding agent is free too.",
  betaNote:
    "Beta note: the coding agent is free for everyone. After beta, Personal is $20 a year, bought in the app through the App Store.",
  teamNote:
    "Team plans buy shared admin and one company stack, not access. Everyone gets the agent free during beta. Team billing opens after beta, so write to us and we'll set your company up.",
  // Fine print under each team price.
  teamFine: [
    "Billed yearly once team billing opens. Renews automatically each year until you cancel.",
    "Full refund within 14 days of each annual charge. After that, cancel anytime and keep access to the end of the year.",
  ],
  // Team buttons open an email whose subject names the plan.
  teamSubjectPrefix: "Team plans · ",

  // Mirrors app/src/lib/plans.js. Free is chat only; Personal is one person at
  // $20 a year after beta; commercial bands are teams billed per year, each
  // covering up to its top number.
  plans: [
    {
      id: "free",
      segment: "For your own work",
      name: "Free",
      price: "$0",
      promise: "Full chat with the local models you already run.",
      includes: [
        "Chat with Harbor Lite, Harbor, or any model you run in Ollama",
        "Runs entirely on your hardware",
        "No account required, no telemetry",
      ],
      cta: "Download free",
      ctaHref: "#get-app",
      checkoutUrl: null,
    },
    {
      id: "personal",
      segment: "For one person",
      name: "Personal",
      // Beta: nothing charges anyone today, so the price says what is true
      // today; the future $20 lives in finePrint. Restore "$20 / year" when the
      // gate returns.
      price: "Free",
      promise: "The whole app for one person. Chat becomes a coding agent.",
      includes: [
        "Everything in Free",
        "The coding agent: reads your repo, writes edits, runs tools",
        "Real diffs and tool approvals you control",
        "DeepBlue, the desktop coding agent, sized to your computer",
      ],
      cta: "Download free",
      ctaHref: "#get-app",
      flagship: true,
      flagLabel: "Full access",
      // Personal is an Apple subscription only (founder, 2026-08-31): there is
      // no web purchase, so no Stripe button renders. openshore-app.js still
      // carries the old personal checkout branch; with no button it is
      // unreachable.
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
      cta: "Ask about team plans",
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
      cta: "Ask about team plans",
      checkoutUrl: null, // TODO: Stripe Payment Link for Small
    },
    {
      id: "commercial_mid",
      segment: "For teams",
      name: "Growth",
      price: "$250 / year",
      promise: "31 to 100 people.",
      includes: ["Everything in Small", "Room to grow across the whole company"],
      cta: "Ask about team plans",
      checkoutUrl: null, // TODO: Stripe Payment Link for Growth
    },
    {
      id: "commercial_large",
      segment: "For teams",
      name: "Scale",
      price: "$500 / year",
      promise: "More than 100 people.",
      includes: ["Everything in Growth", "One flat price, however large the team"],
      cta: "Ask about team plans",
      checkoutUrl: null, // TODO: Stripe Payment Link for Scale
    },
  ],

  // A quiet trust row rendered under the pricing cards.
  reassurance: [
    { label: "Runs at home.", body: "Your models run on your hardware." },
    { label: "Your code stays put.", body: "It leaves only in a cloud call you choose, on your key." },
    { label: "Nothing charges you today.", body: "Paid plans start after beta, at the prices on this page." },
  ],

  // The ethical boundaries. This copy is the marketing-side mirror of the trust
  // statement that ships in the app (os-code/src/core/ethics/trustStatement.ts,
  // shown in Settings). The two must say the same thing: a promise that reads
  // differently in the product and on the site is not a promise. When one
  // changes, change both in the same piece of work.
  //
  // Every claim here is one the code can back. "Enforced by default" and "will
  // not help you remove them" describe what the app does. "Aligns with" names
  // public frameworks and is a self-attestation: no third party has certified
  // or endorsed this product, and nothing here says one has. The honest limit
  // about open weights is the truth that makes the rest of the claim credible.
  trust: {
    label: "Ethics",
    headline: "A floor you can raise, never lower.",
    subhead:
      "The same ethical floor runs on every model call, local and cloud, for everyone. No setting turns it down, and legitimate work gets no lecture.",
    // The founder's stance (2026-09-08), rendered above the mirrored statement
    // and tiers. It is the why; the statement and tiers below stay verbatim to
    // the app's trustStatement.ts and are the what.
    stanceLabel: "AI for humans, by humans",
    stance: [
      "OpenShore ships with an ethical floor that is on for everyone and cannot be turned down. That floor is the foundation, and the door only opens one way: individuals and companies can raise the bar and set stricter boundaries for their own people, never loosen it.",
      "One line we will not cross: OpenShore is not a tool for making deepfakes or synthetic humans. Photo or video built to pass a fake or real person off as real is off the table. It is not what the world or a business needs to build, and the harm to society is not a trade worth making.",
    ],
    statement: [
      "This app enforces its ethical boundaries by default and will not help you remove them.",
      "It aligns with recognized frameworks: the NIST AI Risk Management Framework, ISO/IEC 42001, and C2PA content provenance.",
      "We block child sexual abuse material, non-consensual intimate imagery, and weapons uplift outright, and we gate the cloning of real people behind consent.",
      "We're honest about the limit: once open model weights are on your own machine, they are beyond any app's control.",
      "What we guarantee is that this app, as shipped, does not assist misuse and does not help you strip these protections out.",
    ],
    tiers: [
      {
        name: "Refused outright",
        body: "Child sexual abuse material. Sexual or nude imagery of a real, identifiable person. Concrete help building or deploying biological, chemical, nuclear, or high-yield explosive weapons. There is no consent option for any of these.",
      },
      {
        name: "Gated behind consent",
        // Narrowed to what exists (advisory org, round two, 2026-09-24): only
        // images carry provenance today, so video and voice of a real person
        // are refused. The app's trustStatement.ts tier must change with it.
        body: "Synthesizing an image of a real, identifiable person, allowed only when you state you are authorized for that specific person. Writing about a person in text is not gated. Images of a real person made on your computer carry a provenance record saying they are AI-generated. Video or voice of a real person is refused until it can be marked the same way.",
      },
      {
        name: "Left alone",
        body: "Legal adult content, dark and violent fiction, horror, edgy humor, satire and political parody, security research and red teaming, and unpopular opinions. No added refusal, no commentary. Over-blocking your legitimate work is a defect we treat as seriously as letting real harm through.",
      },
    ],
    honestLimit:
      "We will not tell you misuse is impossible. Open model weights on your own hardware are beyond the reach of any application, including ours. The guarantee we can make is narrower and real: this app, as shipped, does not help.",
    privacy:
      "The screening runs on your device. Nothing is sent anywhere to check a prompt, so a local model stays local even though it is screened. Signed out, a block is noted on your device and goes nowhere.",
    // The guardrail record, final wording (advisory org, round two,
    // 2026-09-24). Use it everywhere the record is described.
    record:
      "When you're signed in, a block sends a short record to your account: the category and tier, the time, a one-way fingerprint of the text, whether it ran locally or in the cloud, what the screen did, whether it was your request or the model's reply, and the names of the rules that matched. Never the text, and never a person's name. Blocks are kept for 180 days. Consent you give to depict a real person stays on your device.",
    ladder:
      "Repeated blocks move up a ladder, from a warning to closing the account, with a report where the law requires or permits it.",
    // OpenShore's own code never reads or stores an IP address, but the hosting
    // and sign-in providers log them as any server does, so never say "we
    // never collect an IP address" in absolute terms.
    ip: "The guardrail record never contains an IP address, and OpenShore never uses one for enforcement. Our hosting and sign-in providers see IP addresses as any server does.",
  },

  closeLabel: "Get started",
  closeTitle: "Start at home. Build from anywhere.",
  close:
    "The desktop app is out now for Linux, macOS, and Windows, free during beta. iPhone and iPad are in private beta on TestFlight. Write to us for an invite, or to set your company up with a team plan.",

  earlyAccessSubject: "OpenShore early access",
  earlyAccessBody:
    "I would like early access to OpenShore. Tell me when it launches.",
  earlyAccessNote: "We'll use your address only to tell you about OpenShore's launch.",

  // The floating button: the download on wide screens, the iPhone beta on
  // narrow ones (base.njk renders both; CSS shows one by width).
  fabWide: "Download free",
  fabNarrow: "Join the iPhone beta",
};
