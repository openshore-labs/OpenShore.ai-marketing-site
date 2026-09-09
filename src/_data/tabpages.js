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
        body: "The Marketplace tells you in plain language what each model is good at. Browse by family, size, and license. When you download, weights come straight from the source. OpenShore never rehosts weights or proxies your inference.",
        bullets: [
          { label: "Plain fit", text: "Curated for coding, writing, analysis, and vision, not spec-sheet noise." },
          { label: "Your machine's limit", text: "A capacity chip shows what this device can run before you commit." },
          { label: "Licenses shown", text: "License and details are on the card, so you know what you are taking on." },
        ],
      },
      {
        heading: "Four ways to get a model",
        body: "Mix and match. They all land on your Bench and place into your Stack the same way.",
        bullets: [
          { label: "On device", text: "Harbor Light is built in and works offline. Larger pocket models download on demand." },
          { label: "Bring your own", text: "Connect any OpenAI-compatible endpoint you run: a self-hosted vLLM, Ollama, or a fine-tune behind your gateway." },
          { label: "Cloud on your key", text: "Claude, OpenAI, Gemini, and Kimi on your own account. Spend always asks first." },
          { label: "Open weights", text: "What runs on your own hardware is yours to control, and no app can take that back." },
        ],
      },
      {
        heading: "How the Stack works",
        body: "One Reasoning LLM is the anchor. It plans the work and hands each step to the specialist you placed for that job: coding, writing, analysis, image reading, or a fast model for quick turns. You decide who sits in each seat, and you can change it any time.",
        bullets: [
          { label: "One planner", text: "The Reasoning LLM routes; you never juggle models by hand." },
          { label: "You place the specialists", text: "Assign a model to a category, set when it is called, tune its effort." },
          { label: "No lock-in", text: "Swap any seat, keep the rest. Local and cloud sit side by side." },
        ],
      },
    ],
    cta: { label: "See the plans", href: "/#pricing", note: "Free to chat, free to build during beta." },
  },

  privacy: {
    hero: {
      eyebrow: "Privacy",
      headline: "Answers only to you.",
      subhead:
        "Your prompts, your code, and your keys stay on your own hardware. Nothing leaves unless you tap to send it.",
    },
    sections: [
      {
        heading: "Local-first, by construction",
        body: "The work happens on your machine, on your models. Your prompts and code never reach an OpenShore server, because none sits in the path of your work.",
        bullets: [
          { label: "On your hardware", text: "Sessions run on your own computer's engine, not a rented cloud." },
          { label: "Encrypted at rest", text: "Everything on the device is encrypted, and secrets live in the device secret store." },
          { label: "No phone-home", text: "No telemetry, no analytics, no background pings. Ever." },
        ],
      },
      {
        heading: "Cloud is a deliberate tap",
        body: "You can call Claude, OpenAI, Gemini, or Kimi, but only on your own keys and only when you choose. Providers see just the one call you make, and spend always asks first.",
        bullets: [
          { label: "Your keys", text: "Cloud calls run on your account. We never proxy inference or rehost weights." },
          { label: "Local until you send it", text: "A model runs on your machine until you send it to the cloud on purpose." },
        ],
      },
      {
        heading: "Ethical screening runs on the device",
        body: "Prompts are checked locally before they run. Nothing is sent anywhere to screen them.",
        bullets: [
          { label: "Never sent", text: "Your prompt is never stored or transmitted to be checked." },
          { label: "A block records only three things", text: "Only a category, a time, and a one-way hash. The text stays with you." },
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
        body: "OpenShore runs on a computer you already have. A laptop or an always-on home machine, awake while you work. There is no appliance to buy and no fleet to keep warm. You harness the hardware you own instead of renting someone else's.",
        bullets: [
          { label: "Your machine", text: "Local inference uses the runtime you installed, on power you already pay for." },
          { label: "Cloud on purpose", text: "A frontier model is one deliberate tap on your own key, not the default for every token." },
        ],
      },
      {
        heading: "Measured, not hand-waved",
        body: "Stack Health estimates your footprint on-device and refreshes it once a day: energy, water, and carbon avoided versus a data center, each marked as an estimate. Nothing leaves the machine to compute it.",
      },
      {
        heading: "The honest limits",
        body: "Local inference still uses power, and a large model on a big GPU is not free. This is about choice and proportion, not a zero-carbon claim. Long runs need the computer awake, and the figures are directional estimates, not a meter reading.",
      },
    ],
    cta: { label: "See what your stack saves", href: "/#everything", note: "Stack Health lives in the app, computed on your device." },
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
          { label: "Local runtime", text: "Harbor Light is built in and runs offline. For more, point OpenShore at any OpenAI-compatible runtime you run, Ollama for example. It orchestrates, it never hosts weights." },
        ],
      },
      {
        heading: "Set it up",
        body: "There is no one-click installer yet, and no DevOps degree either. It is a handful of steps, each a copy-paste command.",
        steps: [
          { name: "Pick a runtime", body: "Harbor Light already runs offline. For more, install any OpenAI-compatible runtime, Ollama for example, and pull a model." },
          { name: "Join a network", body: "Install Tailscale on both devices, sign into the same account, turn it on." },
          { name: "Keep it awake", body: "A sleeping machine kills in-flight runs. Run osc doctor and it prints the one-line fix." },
          { name: "Start the engine", body: "Run osc serve --bind tailscale, or just open the desktop app, which runs the same daemon." },
          { name: "Pair the phone", body: "Scan the QR under Desktop and phone. It fills in the address and token for you." },
        ],
      },
      {
        heading: "Models on your terms",
        body: "Place a local model, connect one you host, or reach a cloud model on your own key. They all land on the same Bench and route through your Stack.",
        bullets: [
          { label: "Bring your own model", text: "Any OpenAI-compatible endpoint you run: a base URL, a model id, an optional key." },
          { label: "Cloud on your key", text: "Claude, OpenAI, Gemini, Kimi on your own account. Spend always asks first." },
          { label: "Honest limit", text: "BYOM streaming on iPhone and desktop buffers, then shows the reply. Native streaming is a planned follow-up." },
        ],
      },
      {
        heading: "A hub for your team",
        body: "Run the daemon on a machine you keep on and let an admin control the shared stack. Each person keeps their own chats and crew.",
        bullets: [
          { label: "Real roles", text: "Mint per-person tokens as admin or member and hand them out. Works with no backend at all." },
          { label: "Shared, enforced", text: "Org Projects hold shared instructions and repo access, enforced server-side." },
          { label: "Same private link", text: "Teammates connect over Tailscale, bearer-gated. Still no public URL." },
        ],
      },
    ],
    cta: {
      label: "Get early access",
      note: "In private beta, free to chat and free to build for now. OpenShore runs on your machine, so when it sleeps or powers off, in-flight runs stop. No OpenShore cloud runner takes over yet.",
    },
  },
};
