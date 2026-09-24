// Copy for the tab pages (Models, Privacy, Sustainability, Self-Hosting).
// Written by the CMO, run through an editor and revision pass against the
// house voice (no em dashes, no hype, honest, digestible), then updated to the
// advisory org's copy review of 2026-09-24 (heroes from Creative Studio). One
// source of truth: each page template reads its object by id. Visual markup
// lives in _includes/viz.njk.
//
// No em dashes anywhere a customer reads (enforced by scripts/check-copy.mjs).
export default {
  models: {
    hero: {
      eyebrow: "Models",
      headline: "Three to start. Room for yours.",
      subhead:
        "Harbor Lite shows you around your phone. Harbor writes and explains code in chat, even with no signal. DeepBlue edits your repositories from your computer. Add a model you host, or a cloud model on your own key.",
    },
    sections: [
      {
        heading: "Three models, picked for the job",
        body: "One to show you around, two to write code.",
        bullets: [
          { label: "Harbor Lite", text: "Built into the phone app. Works with no signal. A guide that shows you around and hands you off; it doesn't write code." },
          { label: "Harbor", text: "A small coder on your iPhone for short edits, with web search. Longer work happens on your computer." },
          { label: "DeepBlue", text: "The coding agent on your desktop. Qwen 2.5 Coder, sized to your computer, set up in one tap. It edits your repositories, and your phone reaches it when docked." },
        ],
        note: "A full model Marketplace is coming. It stays grayed out in the app until it's ready.",
      },
      {
        heading: "Three ways to add a model",
        body: "Mix and match. They all land on your Bench, your installed models, and place into your Stack the same way.",
        bullets: [
          { label: "The three models", text: "Harbor Lite is built into the phone app. Harbor and DeepBlue download from their source, from inside the app." },
          { label: "Bring your own", text: "Connect any OpenAI-compatible endpoint you run: a self-hosted vLLM, Ollama, or a fine-tune behind your gateway." },
          { label: "Cloud on your key", text: "Claude, OpenAI, Gemini, and Kimi on your own account, plus Perplexity Sonar for research. Spend asks first." },
        ],
      },
      {
        heading: "How the Stack works",
        body: "One model is the anchor: the model that plans (the Reasoning LLM in the app). It plans the work and hands each step to the specialist you placed for that job: coding, writing, analysis, image reading, or a fast model for quick turns. You decide who sits in each seat, and you can change it any time.",
        bullets: [
          { label: "One planner", text: "The model that plans routes each step; you never juggle models by hand." },
          { label: "You place the specialists", text: "Assign a model to a category, set when it is called, tune its effort." },
          { label: "No lock-in", text: "Swap any seat, keep the rest. Local and cloud sit side by side." },
          { label: "Open weights", text: "What runs on your own hardware is yours to control, and no app can take that back." },
        ],
      },
    ],
    cta: { label: "See the plans", href: "/#pricing", note: "Free to chat, free to build during beta." },
  },

  privacy: {
    hero: {
      eyebrow: "Privacy",
      headline: "Your code never leaves home unless you send it.",
      // Creative Studio's subhead, with the web search sentence kept, so
      // search is named here and in "What leaves, and when".
      subhead:
        "Home is your own devices and the private network between them. By default your code, prompts, and chats stay there. Code goes out only when you choose a cloud model, on your own key, one call at a time. When the agent searches the web, it asks first, then the search words go to the search service. No telemetry. If you're signed in and the safety screen blocks a request, a short record goes to your account, never your prompt.",
    },
    sections: [
      {
        heading: "Local-first, by construction",
        body: "The work happens on your machine, on your models. No OpenShore server sits in the path of your prompts and code.",
        bullets: [
          { label: "On your hardware", text: "Sessions run on your own computer's engine, not a rented cloud." },
          { label: "Sealed on your device", text: "Keys and chats are sealed on your device. On Linux that needs a system keyring; the app tells you if yours doesn't have one. Your files stay in folders you control." },
          { label: "No telemetry", text: "No telemetry and no analytics. The activity log is off unless you turn it on, stays on your device, and is never sent." },
        ],
      },
      {
        heading: "What leaves, and when",
        body: "These are the things that can leave home, and where each one goes.",
        bullets: [
          { label: "A cloud call you choose", text: "Sent to that provider, on your key, one call at a time." },
          { label: "Web search", text: "When the agent searches the web, it asks first, then the search words go to the search service. A self-hosted SearXNG keeps searches on your own network." },
          { label: "Model downloads", text: "Models come in from their source. OpenShore never hosts weights." },
          { label: "Signing in", text: "Signing in to your account talks to OpenShore's sign-in service. Chatting with local models needs no account." },
          { label: "The guardrail record", text: "When you're signed in, a block sends a short record to your account: the category and tier, the time, a one-way fingerprint of the text, whether it ran locally or in the cloud, what the screen did, whether it was your request or the model's reply, and the names of the rules that matched. Never the text, and never a person's name. Blocks are kept for 180 days. Consent you give to depict a real person stays on your device." },
          { label: "IP addresses", text: "The guardrail record never contains an IP address, and OpenShore never uses one for enforcement. Our hosting and sign-in providers see IP addresses as any server does." },
          { label: "Vault", text: "On team plans, org Vault content is stored on OpenShore's backend. A personal Vault on iCloud Drive or Google Drive goes to that provider." },
          { label: "Voice", text: "Voice on iPhone is recognized on the device. On the desktop, voice asks before any audio goes to a speech service." },
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
          { label: "What a block records", text: "Signed out, a block is noted on your device and goes nowhere. Signed in, the guardrail record above goes to your account. Never the text." },
        ],
      },
    ],
    cta: { label: "Read the Ethics page", href: "/ethics/", note: "The floor is on for everyone and cannot be turned down." },
  },

  sustainability: {
    hero: {
      eyebrow: "Sustainability",
      headline: "The token you don't send.",
      subhead:
        "Work that stays home, on hardware you already own, spins up no data center on your behalf.",
    },
    sections: [
      {
        heading: "Same work, shorter trip",
        body: "A local model answers on the machine in front of you. Nothing round-trips to a metered hyperscale cloud, and no new capacity is provisioned to serve you. The saving is proportion: the work you keep local is work the grid never routes to a warehouse of GPUs.",
      },
      {
        heading: "Reuse before rent",
        body: "OpenShore runs on a computer you already have. A laptop, or a home machine you leave running, awake while you work. There is no appliance to buy and no fleet to keep warm. You harness the hardware you own instead of renting someone else's.",
        bullets: [
          { label: "Your machine", text: "Local inference uses the runtime you installed, on power you already pay for." },
          { label: "Cloud on purpose", text: "A frontier model is one deliberate tap on your own key, not the default for every token." },
        ],
      },
      {
        heading: "Estimated on your device, and labeled that way",
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
      headline: "Your code stays home. You don't have to.",
      subhead:
        "Your computer runs the engine and the models. Your phone reaches it over Tailscale, a private network between your own devices, with nothing exposed to the internet.",
    },
    sections: [
      {
        heading: "The pieces",
        body: "The engine is the OpenShore daemon. It owns your sessions and does the generating on your computer. Your phone attaches and detaches freely, more remote control than compute.",
        bullets: [
          { label: "Desktop engine", text: "Runs your sessions and journals every step, so a dropped connection loses nothing and just reattaches." },
          { label: "Private network", text: "Tailscale links your phone and computer directly. No port forwarding, nothing exposed to the internet." },
          { label: "Local runtime", text: "DeepBlue runs through Ollama on your computer. OpenShore installs and runs models from their source; it never hosts weights." },
          { label: "Docked, Offshore, Offline", text: "Docked, your phone uses your computer's models. Offshore, when your computer is out of reach, it uses cloud on your key and its own model. Offline, only the model on the phone." },
        ],
      },
      {
        heading: "Your home server, without the DevOps.",
        body: "Install the app, then a few steps, mostly taps. Ollama and Tailscale are separate installs.",
        steps: [
          { name: "Install the desktop app", body: "It starts the engine when it opens and keeps running in the tray. No terminal needed." },
          { name: "Set up DeepBlue", body: "One tap sizes the model to your computer. If Ollama isn't installed, the app helps you get it." },
          { name: "Join a private network, if you'll use your phone", body: "Install Tailscale on your computer and phone and sign in to the same account." },
          { name: "Keep it awake", body: "A sleeping computer stops work in progress. Run osc doctor and it prints the one-line fix." },
          { name: "Pair each phone", body: "The desktop app shows a one-time QR code for each phone. Scan it and you're connected." },
        ],
        terminal: { lead: "Prefer a terminal?", command: "osc serve --bind tailscale", tail: "runs the same engine." },
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
    // The desktop app is a live download now, so the page ends on it rather
    // than the old early-access email.
    cta: {
      label: "Download free",
      href: "/#get-app",
      note: "In private beta, free to chat and free to build for now. OpenShore runs on your machine, so when it sleeps or powers off, in-flight runs stop. No OpenShore cloud runner takes over yet.",
    },
  },
};
