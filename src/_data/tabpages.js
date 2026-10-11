// Copy for the four new tab pages (LLM Choice, Privacy, Sustainability,
// Self-Hosting). Written by the CMO, then run through an editor and revision
// pass against the house voice (no em dashes, no hype, honest, digestible).
// One source of truth: each page template reads its object by id. Visual markup
// lives in _includes/mockups.njk keyed by the visual ids referenced here.
//
// No em dashes anywhere a customer reads (enforced by scripts/check-copy.mjs).
export default {
  "llm-choice": {
    hero: {
      eyebrow: "Your models",
      headline: "You pick the models. Every one.",
      subhead:
        "Download a local model, connect one you host, or run cloud on your own key. Nothing is locked in.",
    },
    sections: [
      {
        heading: "A catalog, not a middleman",
        body: "OpenShore starts you on three curated models, and the Marketplace, coming soon, will tell you in plain language what each model is good at. When you download, weights come straight from the source. OpenShore never rehosts weights or proxies your inference.",
        bullets: [
          { label: "Plain fit", text: "Harbor Lite guides you on the phone, Harbor codes on the phone, and DeepBlue codes on your computer." },
          { label: "Your machine's limit", text: "DeepBlue is sized to what your computer can run, never the biggest on a guess." },
          { label: "Licenses shown", text: "All three curated models are Apache 2.0 open weights, and the app names the weights behind each one." },
        ],
      },
      {
        heading: "Four ways to get a model",
        body: "Mix and match. They all show up in Stack and place the same way.",
        bullets: [
          { label: "On device", text: "Harbor Lite is built into the phone app and works offline. Harbor downloads when you want a coder on your phone, and DeepBlue comes through Ollama on your computer." },
          { label: "Bring your own", text: "Connect any OpenAI-compatible endpoint you run: a self-hosted vLLM, Ollama, or a fine-tune behind your gateway." },
          { label: "Cloud on your key", text: "Claude, OpenAI, Gemini, Kimi, and Perplexity on your own key, only when you pick one or place it in Stack. On your computer, the coding agent asks before a cloud model's first step in each task. An Ollama model whose tag (after the colon) is cloud or ends in -cloud runs on Ollama's cloud, not on your computer, and counts as cloud." },
          { label: "Open weights", text: "What runs on your own hardware is yours to control, and no app can take that back." },
        ],
      },
      {
        heading: "How the Stack works",
        body: "One model runs the show and hands each task to the specialist that fits: coding, writing, analysis, image reading, or a fast model for quick turns. Anything without a specialist, it does itself. That model is the Reasoning model. You decide who sits in each seat, and you can change it any time.",
        bullets: [
          { label: "One planner", text: "The Reasoning model routes; you never juggle models by hand." },
          { label: "You place the specialists", text: "Assign a model to a category, set when it is called, tune its effort." },
          { label: "No lock-in", text: "Swap any seat, keep the rest. Local and cloud sit side by side, and on your computer each seat says where it runs: Cloud, On this computer, or On your network." },
        ],
      },
    ],
    cta: { label: "Get OpenShore", href: "/#pricing", note: "Free and open source." },
  },

  privacy: {
    hero: {
      eyebrow: "Privacy",
      headline: "Answers only to you.",
      subhead:
        "Your prompts and code stay on your own hardware unless you send them to a cloud model, and each key is stored only on the device you add it to. What does leave is a short, published list, below.",
    },
    sections: [
      {
        heading: "Local-first, by construction",
        body: "The work happens on your machine, on your models. Your prompts and code never reach an OpenShore server, because none sits in the path of your work.",
        bullets: [
          { label: "On your hardware", text: "Sessions run on your own computer's engine, not a rented cloud." },
          { label: "Encrypted at rest", text: "Your chats, settings, and session journals are encrypted on the device (AES-256) under a key in your system's keychain. Your Vault notes and your code stay plain files, so Obsidian and git can open them." },
          { label: "No phone-home", text: "No telemetry, no analytics, no tracking, no ads. The few background requests (update checks, the model list) carry no account and none of your work, only your app version and the network address any request carries, and each one is on the published list." },
        ],
      },
      {
        heading: "Cloud is a deliberate tap",
        body: "You can call Claude, OpenAI, Gemini, Kimi, or Perplexity, but only on your own keys, and only when you pick one or place it in Stack. That provider sees the conversation that turn carries, under its own terms. OpenShore never sends private notes to a cloud model. A command you run or allow, or a change you allow, can still carry their words to one.",
        bullets: [
          { label: "Your keys", text: "Cloud calls run on your account. We never proxy inference or rehost weights." },
          { label: "Local until you send it", text: "What you send a local model stays on your machine, and so does its answer, unless a cloud model in the same chat reads it later. If it searches the web, only the search words go out." },
        ],
      },
      {
        heading: "Ethical screening runs on the device",
        body: "Prompts are checked locally before they run. Nothing is sent anywhere to screen them.",
        bullets: [
          { label: "Never sent", text: "Your prompt is never stored or transmitted to be checked." },
          { label: "A block records only what enforcement needs", text: "The category, tier, time, a keyed one-way hash, and whether a local or cloud model was in play. If you are signed in, that record goes to your account for 180 days so enforcement survives a reinstall. Your words never leave." },
        ],
      },
    ],
    cta: { label: "Read the ethical standards", href: "/ethics/", note: "The floor is on for everyone and cannot be turned down." },
  },

  sustainability: {
    hero: {
      eyebrow: "Sustainability",
      headline: "The token you don't send.",
      subhead:
        "Work that stays on hardware you already own does not spin up a data center on your behalf.",
    },
    sections: [
      {
        heading: "Same work, shorter trip",
        body: "A local model answers on the machine in front of you. Nothing round-trips to a metered hyperscale cloud, and no new capacity is provisioned to serve you. The saving is proportion: the work you keep local is work the grid never routes to a warehouse of GPUs.",
      },
      {
        heading: "Reuse before rent",
        body: "OpenShore runs on a computer you already have. A laptop or a desktop you keep on, awake while you work. There is no appliance to buy and no fleet to keep warm. You harness the hardware you own instead of renting someone else's.",
        bullets: [
          { label: "Your machine", text: "Local inference uses the runtime you installed, on power you already pay for." },
          { label: "Cloud on purpose", text: "A frontier model is one deliberate tap on your own key, not the default for every token." },
        ],
      },
      {
        heading: "Measured, not hand-waved",
        body: "Coming in a later release: Stack Health estimates your footprint on your device and refreshes it once a day, with energy, water, and carbon avoided versus a data center, each marked as an estimate. Nothing leaves the machine to compute it. It is not in this release yet.",
      },
      {
        heading: "The honest limits",
        body: "Local inference still uses power, and a large model on a big GPU is not free. This is about choice and proportion, not a zero-carbon claim. Long runs need the computer awake, and the figures are directional estimates, not a meter reading.",
      },
    ],
    cta: { label: "See what is inside", href: "/#everything", note: "Stack Health arrives in a later release, computed on your device." },
  },

  "self-hosting": {
    hero: {
      eyebrow: "Self-Hosting",
      headline: "Your home server, without the DevOps.",
      subhead:
        "Run OpenShore on a computer you own, and reach it from your phone over your own private network.",
    },
    sections: [
      {
        heading: "The pieces",
        body: "The engine is the OpenShore daemon. It owns your sessions and does the generating on your computer. Your phone attaches and detaches freely, more remote control than compute.",
        bullets: [
          { label: "Desktop engine", text: "Runs your sessions and journals every step, so a dropped connection loses nothing and just reattaches." },
          { label: "Private network", text: "Tailscale links your phone and computer directly. No port forwarding, nothing exposed to the internet." },
          { label: "Local runtime", text: "The desktop app pulls DeepBlue through Ollama on your computer. Or point OpenShore at any OpenAI-compatible runtime you run. It orchestrates, it never hosts weights." },
        ],
      },
      {
        heading: "Set it up",
        body: "There is no one-click installer yet, and no DevOps degree either. It is a handful of steps, each a copy-paste command.",
        steps: [
          { name: "Pick a runtime", body: "Install Ollama and let the desktop app pull DeepBlue, or run any OpenAI-compatible runtime and point OpenShore at it." },
          { name: "Join a network", body: "Install Tailscale on both devices, sign into the same account, turn it on." },
          { name: "Keep it awake", body: "A sleeping machine kills in-flight runs. Run osc doctor and it prints the one-line fix." },
          { name: "Start the engine", body: "Run osc serve --bind tailscale, or just open the desktop app, which runs the same daemon." },
          { name: "Connect your computer", body: "On the computer, open Pairing. On the phone, choose Connect your computer and scan the QR, then allow the phone on the computer. Each phone gets its own key, which you can revoke." },
        ],
      },
      {
        heading: "Models on your terms",
        body: "Place a local model, connect one you host, or reach a cloud model on your own key. They all show up in Stack and route the same way.",
        bullets: [
          { label: "Bring your own model", text: "Any OpenAI-compatible endpoint you run: a base URL, a model id, an optional key." },
          { label: "Cloud on your key", text: "Claude, OpenAI, Gemini, Kimi, and Perplexity on your own key, only when you pick one or place it in Stack. On your computer, the coding agent asks before a cloud model's first step in each task." },
          { label: "Offline", text: "Choose Offline, or lose the connection, and OpenShore uses only models on this computer or your own network." },
        ],
      },
      {
        heading: "For a team, later",
        body: "This release is for one person: your computer and your own phone. Sharing a computer with a team, with roles and shared projects, comes in a later release.",
        bullets: [
          { label: "Today", text: "Each phone you connect gets its own key, and you can revoke one without touching the rest." },
          { label: "Same private link", text: "Every connection runs over Tailscale. Still no public URL." },
        ],
      },
    ],
    cta: {
      label: "Get early access",
      note: "Free and open source. OpenShore runs on your machine, so when it sleeps or powers off, in-flight runs stop. No OpenShore cloud runner takes over yet.",
    },
  },
};
