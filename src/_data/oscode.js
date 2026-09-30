// OpenShore product page content. One source of truth for openshore.ai.
// Carried over verbatim from Open-Shore-LLC-Homepage's /os-code/ subpage
// (src/_data/oscode.js), which is now retired now that OpenShore has its own
// standalone site. The `oscode` naming (and the matching DOM ids/classes in
// openshore-app.js / openshore.css) is internal plumbing only, kept as-is to
// avoid a needless rename of working code.
//
// Pricing model (2026-09-30): Free is chat only, no account. OpenShore Plus is
// $49.99 a year and lets the agent build on your computer (the coding agent and
// Crew routines), bought on the web via Stripe or on iPhone and iPad through the
// App Store. "Personal" is the internal name of the v1 release only; customers
// read "OpenShore Plus" (CMO and Creative Studio). Team plans come later (v4,
// founder: "just starting with personal"), so no team card renders. The Free
// card carries an early-access mailto so nothing dead-ends before a download.
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
    "OpenShore is a coding agent that runs on your own models, your machine, and your keys. Chat and build on your desktop, on Linux, macOS, and Windows, and on your iPhone and iPad, kept in sync over your own private network. Cloud stays one deliberate tap away, always on your own account.",
  summary:
    "It is built the way software should be: local first, private by construction, and yours. One model in your stack plans the work and hands each part to the specialist best suited to it. Your keys never leave your devices. Everything you make is encrypted at rest and answers only to you.",

  // "Get OpenShore" tile grid, the marketing mirror of uki.audio's own get-app
  // section (same shape, same honesty rule from that page's own comment: a
  // tile only goes live once its URL is real, otherwise it reads as hype).
  // Linux, Windows, and macOS are all genuinely live as of v0.1.2
  // (2026-09-17): release.yml publishes Linux and Windows to one real GitHub
  // Release on every push of a v* tag; the mac-desktop Codemagic workflow
  // publishes the unsigned dmg/zip to that same release on demand. All three
  // verified end to end against the actual release assets, not just a green
  // build (see docs/MAC-DESKTOP.md for why that distinction mattered here).
  // Download buttons (2026-09-24): each points at /download/<platform> on this
  // site, which worker/index.js answers with the newest release file for that
  // platform, so the click downloads on the spot instead of opening GitHub.
  // (electron-builder's file names carry the version, so no fixed asset link
  // stays right, and a Mac build can land in a release after Linux and Windows;
  // the worker handles both.) `alt` offers the other file for the same
  // platform, and the GitHub link sits beside the button for anyone who wants
  // the release notes and every file. iOS needs the App Store; Android needs a
  // PWA manifest and service worker that do not exist yet. To take a platform
  // live: set its href, flip status to "live"; see .get-tile-live.
  githubReleases: "https://github.com/openshore-labs/openshore-releases/releases",
  getAppsLabel: "Get OpenShore",
  getAppsTitle: "One stack, every machine you own.",
  getAppsLede:
    "Linux, macOS, and Windows are direct downloads today. iPhone, iPad, and Android are next.",
  getApps: [
    {
      id: "linux",
      label: "Linux",
      sub: "Direct download · AppImage or .deb",
      href: "/download/linux",
      alt: { label: ".deb", href: "/download/linux-deb" },
      status: "live",
    },
    {
      id: "mac",
      label: "Mac",
      sub: "Direct download · unsigned .dmg",
      href: "/download/mac",
      alt: { label: "Intel Mac", href: "/download/mac-intel" },
      status: "live",
    },
    {
      id: "windows",
      label: "Windows",
      sub: "Direct download · .exe installer",
      href: "/download/windows",
      status: "live",
    },
    { id: "ios", label: "iPhone & iPad", sub: "App Store", status: "soon" },
    { id: "android", label: "Android", sub: "Install from your browser", status: "soon" },
  ],

  // The mission used to live here as its own "Why OpenShore exists" section
  // on the Platform tab (headline + four promises). It repeated the same
  // ground "What makes it different" below already covers, plus what LLM
  // Choice, Privacy, and Sustainability each cover in depth on their own
  // tabs, so it was cut rather than trimmed (2026-09-17, platform tab
  // simplification). The founder's underlying mission is still true; it just
  // no longer needs its own block here.

  pillarsLabel: "What makes it different",
  pillars: [
    {
      name: "Local first",
      promise: "Your models run on your hardware, not someone else's cloud.",
      covers:
        "A pocket model on your phone, your big models on your desktop, reached over your own Tailscale network. On a plane with no signal, it still works.",
    },
    {
      name: "Your stack draws a play",
      promise: "One Reasoning LLM plans the work and routes every step.",
      covers:
        "Set the model that plans and reasons, place specialists by category, and it hands each step to the right model, briefs you as it goes, and re-plans when a result changes the picture.",
    },
    {
      name: "The Marketplace",
      promise: "A catalog, not a weight host. Models download straight from the source.",
      covers:
        "Browse by family and size, with honest ratings and license flags shown plainly. OpenShore never rehosts weights or proxies your inference.",
    },
    {
      name: "Repositories and Vault",
      promise: "Your code and your notes, in files you own.",
      covers:
        "Connect a repo where it lives, on your disk, iCloud Drive, or Google Drive. The Vault is a markdown knowledge base that Obsidian opens as is.",
    },
    {
      name: "Crew and routines",
      promise: "Named agents that work on a schedule, on your own computer.",
      covers:
        "Give a crew member a task, a workspace, and a clock. It runs while your computer is on and leaves a dated note in your Vault, with the transcript one tap away.",
    },
    {
      name: "Private by construction",
      promise: "Sealed on your device, answering only to you.",
      covers:
        "Everything is encrypted at rest. Cloud providers see only the calls you choose to make, on your own keys. No telemetry, no analytics, no phone-home, ever.",
    },
  ],

  howLabel: "How it works",
  how: [
    {
      name: "Bring your models",
      body:
        "Download a pocket model to your phone, or point OpenShore at the models already on your desktop. Add a cloud model on your own key when you want one.",
    },
    {
      name: "Build your stack",
      body:
        "Pick the Reasoning LLM that runs the show and place specialists by category: coding, writing, analysis, image reading, and fast.",
    },
    {
      name: "Ask, and it draws a play",
      body:
        "Your prompt is framed, turned into an ordered set of handoffs, and briefed back to you before it runs. Each step goes to the model that owns it, and the answer streams in.",
    },
    {
      name: "Ship it",
      body:
        "Edit your repo with real diffs and approvals you control, then build and launch to the app stores without leaving the app.",
    },
  ],

  // Everything inside: the full feature set at a glance, one line each. Rendered
  // as the quiet label-plus-line list so it scans, and stays honest about state
  // (Android rides the same Capacitor foundation; it is not a store build yet).
  piecesLabel: "Everything inside",
  piecesIntro:
    "The whole product, one line each. Every piece runs on your models by default and asks before it spends.",
  pieces: [
    {
      label: "A real coding agent.",
      body: "Reads your repo, edits with diffs you approve, runs commands with your say so, and searches the web with citations.",
    },
    {
      label: "Voice mode.",
      body: "A spoken conversation over the chat, native and offline, in a voice you pick.",
    },
    {
      label: "Video and image attachments.",
      body: "Attach a screen recording or a photo. A clip is read frame by frame by an image reading model.",
    },
    {
      label: "On-device models.",
      body: "Harbor Light is built in and works offline. Harbor and bigger pocket models download when you want more.",
    },
    {
      label: "Bring your own model.",
      body: "Connect any OpenAI compatible endpoint you run yourself, on your own server.",
    },
    {
      label: "Cloud on your key.",
      body: "Claude, OpenAI, Gemini, and Kimi, connected on your own account. Spend always asks first.",
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
      label: "Premium by default.",
      body: "Everything the agent builds is held to a real UX bar, and everything it writes reads like a careful human wrote it.",
    },
    {
      label: "Launch.",
      body: "Take a finished build to the App Store or Google Play from inside the app, with the model reading each build result.",
    },
    {
      label: "Runs everywhere.",
      body: "Desktop for Linux, macOS, and Windows. iPhone and iPad, with Android built on the same foundation.",
    },
  ],

  // BETA: every pay gate in the app is off (the app's VITE_PAY_GATES build
  // flag), so the agent is free for everyone right now. OpenShore Plus is
  // $49.99 a year when the beta ends, on the App Store (iPhone and iPad) or on
  // the web through Stripe (2026-09-30). The beta note is the single place
  // that explains it so no card has to. Revert pricingLabel/pricingIntro, the
  // Plus card's price and CTA, and the note together when the gate comes back.
  pricingLabel: "Free to chat. Free to build, for now.",
  pricingIntro:
    "OpenShore runs on your machine, on your models, on your keys. We never see your code. Right now the agent is free too. Grab it while the beta's open.",
  betaNote:
    "Beta note: the coding agent is free for everyone in the app right now. When the beta ends, OpenShore Plus is $49.99 a year, on the App Store or here on the web.",

  // Mirrors app/src/lib/plans.ts. Free is chat only; OpenShore Plus (id
  // "personal", the internal tier name) is one person at $49.99 a year, on the
  // web via Stripe or on iPhone and iPad via the App Store. Team plans return
  // with the v4 tier.
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
      name: "Plus",
      // Beta: nothing charges anyone today, so the price says what is true
      // today; the future $20 lives in finePrint. Restore "$20 / year" and
      // "Most popular" when the gate returns.
      price: "Free",
      promise: "Chat stays free. Plus lets the agent build on your computer.",
      includes: [
        "Everything in Free",
        "The coding agent: reads your project, makes real changes you approve",
        "Crew routines that run while your computer is on",
        "Your models, your keys. Your prompts never pass through us.",
      ],
      cta: "Get early access",
      flagship: true,
      flagLabel: "Full access",
      // Beta: no Stripe button renders yet (buyable false); the CTA routes to
      // the same early-access mailto as Free. openshore-app.js carries the
      // personal checkout branch (stripe-checkout, tierId 'personal') for when
      // the gate returns and this card turns buyable.
      buyable: false,
      finePrint:
        "Free for everyone during the beta. After the beta, OpenShore Plus is $49.99 a year, on the App Store on iPhone and iPad, or here on the web.",
      checkoutUrl: null,
    },
    // Team plans (Micro, Small, Growth, Scale) come back with the v4 tier.
  ],

  // A quiet trust row rendered under the pricing cards.
  reassurance: [
    { label: "Local-first.", body: "Your models run on your hardware." },
    { label: "Private by default.", body: "No code leaves your machine, no telemetry." },
    { label: "One year, one price.", body: "Cancel anytime, keep working through the term." },
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
  // about open weights is not a hedge bolted on the end, it is the truth that
  // makes the rest of the claim credible.
  trust: {
    label: "Ethical boundaries",
    headline: "Enforced by default. No switch, no exceptions, no lectures.",
    // The founder's stance (2026-09-08), rendered above the mirrored statement
    // and tiers. It is the why; the statement and tiers below stay verbatim to
    // the app's trustStatement.ts and are the what. The deepfake line is a
    // product direction: authorized, provenance-marked likeness stays gated
    // behind consent (the tier below), while passing a fake or real person off
    // as real is not something OpenShore is built to do.
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
        body: "Synthesizing the face or voice of a real, identifiable person, as an image, a video, or a voice, allowed only when you state you are authorized for that specific person. Writing about a person in text is not gated. The assertion is recorded, and what comes out carries provenance metadata saying it was AI-generated.",
      },
      {
        name: "Left alone",
        body: "Legal adult content, dark and violent fiction, horror, edgy humor, satire and political parody, security research and red teaming, and unpopular opinions. No added refusal, no commentary. Over-blocking your legitimate work is a defect we treat as seriously as letting real harm through.",
      },
    ],
    honestLimit:
      "We will not tell you misuse is impossible. Open model weights on your own hardware are beyond the reach of any application, including ours. The guarantee we can make is narrower and real: this app, as shipped, does not help.",
    privacy:
      "The screening runs on your device. Nothing is sent anywhere to check a prompt, so a local model stays local even though it is screened. A block records a category, a time, and a one-way hash. Your prompt is never stored and never sent.",
  },

  close:
    "OpenShore is in private beta and getting ready for launch. Join the early access list and we will tell you the moment it is on the App Store, and set your company up with seats when you are ready.",

  earlyAccessSubject: "OpenShore early access",
  earlyAccessBody:
    "I would like early access to OpenShore. Tell me when it launches.",
  fabLabel: "Get early access",
};
