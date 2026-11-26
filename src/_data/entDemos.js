// The worked examples on the home page (ent-demos.njk), one per bot that does
// a company's operations work, in the tab order. Each is one conversation: someone asks, the bot finds the
// cause and proposes a fix, the bot's admin approves, the bot reports it done
// with a figure that counts, then the fix becomes a rule. Every one is an
// example, labelled so on the page: the people, companies and figures are
// made up. The bots and their admins follow the product plan's packs (RevOps,
// Finance, Planning, Supply chain and Performance Analytics, each with one
// bot admin). Data Foundations, the sixth, has no example (founder,
// 2026-11-19: "remove the data example entirely").
//
//   text      a message's words; html, for the @mentions (at())
//   chip      what the approval approved, shown under it
//   stmt      the done message's figure: label, from, to, and how it reads
//             (format, with {n} for the number; without one, "+$n")
//   why       the line under the example (founder, 2026-11-19): the evidence
//             that the problem is common, and who usually handles it. Only
//             a figure checked against its source goes here.
//   more      the home page's one line for this bot (every bot but
//             RevOps, whose example plays there in full)
//   also      optional: one more job this bot does, shown under the why
//             line (founder, 2026-11-19: the Finance bot drafts the monthly
//             board pack).
//
// Revenue ops (founder, 2026-11-18) is the promo film's commission scene,
// word for word. Finance, Planning and Analytics (founder, 2026-11-19: "add
// the other planned workers") each take the job the plan gives that bot.
//
// Every example is a documented, common problem that companies usually staff
// a role or build a process for (founder, 2026-11-19). Each one's sources and
// the people who traditionally handle it are noted above it, and its why line
// on the page carries one checked figure. The vendor surveys among the notes
// are directional. Change an example only for another problem that is just as
// documented, and note its sources here.

const at = (name) => `<span class="cd-at">@${name}</span>`;

export default [
  // A commission paid short because a deal was credited to the wrong rep.
  // Commission errors are routine: Palette's State of Sales Compensation 2023
  // found 56% of companies have error-prone commission calculations, and
  // CaptivateIQ reports 77% of sales professionals have had a payout error
  // and 66% of companies have over- or underpaid commissions. Crediting and
  // territory disputes are a standard category. Traditionally: sales
  // operations and a commission analyst who works the dispute queue.
  {
    id: "rev",
    tab: "Sales ops",
    eyebrow: "Let’s say a salesperson’s commission comes up short.",
    channel: "sales",
    bot: "Sales ops agent",
    messages: [
      { name: "Maya Chen", initials: "MC", role: "Salesperson", time: "10:02", text: `My October commission looks $2,140 short. ${at("Sales ops")} can you check?` },
      { time: "10:03", text: `Found it. The deal is in your territory but booked to someone else. Moving it needs ${at("Dana Reyes")} to approve.` },
      { name: "Dana Reyes", initials: "DR", role: "Head of Revenue", time: "10:04", text: "Approved.", chip: "Rebook the deal to Maya" },
      { time: "10:04", text: "Done. Your October statement is up $2,140.", stmt: { label: "October statement", from: 0, to: 2140, text: "+$2,140" } },
    ],
    stamp: "Asked at 10:02. Fixed at 10:04.",
    lead: "That approval is now a rule.",
    ruleFrom: "Rule saved · from Dana’s approval",
    rule: "A deal counts toward the salesperson who owns its territory.",
    runs: "Runs before any pay change",
    why: "56% of companies have error-prone commission calculations (Palette, The State of Sales Compensation, 2023). Catching them usually takes sales operations and a commission analyst.",
  },
  // A stockout that is really a wrong inventory record (a receipt booked to
  // the wrong warehouse). DeHoratius and Raman, "Inventory Record Inaccuracy:
  // An Empirical Analysis", Management Science 54(4), 2008: 65% of nearly
  // 370,000 records at one retailer were wrong, with the distribution
  // structure among the causes. The figure is a large study, nearly 370,000
// records across 37 stores of one chain, so the why line says so (2026-11-19:
// "at one retailer" read as an anecdote). Traditionally: inventory control, receiving
  // checks and cycle counts.
  {
    id: "inv",
    tab: "Supply chain",
    eyebrow: "Let’s say a best seller is about to run out.",
    channel: "ops",
    bot: "Supply chain agent",
    messages: [
      { name: "Priya Shah", initials: "PS", role: "Operations lead", time: "2:14", text: `Reno is down to 40 Trail Packs with four days of orders waiting. The PO for 600 says received. ${at("Supply chain")} where did they go?` },
      { time: "2:15", text: `Found them. The PO was for Reno, but the 600 were received at Dallas, so Reno’s count never went up. Moving 400 to Reno needs ${at("Marcus Lee")} to approve.` },
      { name: "Marcus Lee", initials: "ML", role: "Head of Operations", time: "2:16", text: "Approved.", chip: "Transfer 400 units, Dallas to Reno" },
      { time: "2:17", text: "Done. The transfer ships today and lands in Reno Thursday, ahead of the orders.", stmt: { label: "Reno, on the way", from: 0, to: 400, unit: "units", text: "+400 units" } },
    ],
    stamp: "Asked at 2:14. Moving by 2:17.",
    lead: "That approval is now a rule.",
    ruleFrom: "Rule saved · from Marcus’s approval",
    rule: "Receipts are checked against the order’s ship-to before they count as stock.",
    runs: "Runs on every receipt",
    more: "Catches stock booked to the wrong warehouse before a best seller runs out.",
    why: "In a study of nearly 370,000 inventory records across 37 stores of a large retailer, 65% did not match what was on the shelf (DeHoratius and Raman, Management Science, 2008). Keeping counts right usually takes inventory control and regular cycle counts.",
  },
  // A retailer short-pays an invoice with a promotion deduction that no
  // agreed promotion backs. Deductions are a standing cost of selling into
  // retail (the Credit Research Foundation's deduction survey, presented at
  // the Minneapolis Fed in 2012, put them near 2% of sales at the median),
  // and vendors that recover them put the invalid share at 10% to 25% or
  // more. Traditionally: a deductions team in accounts receivable that
  // matches each deduction to its promotion and disputes the rest.
  {
    id: "fin",
    tab: "Finance",
    eyebrow: "Let’s say a retailer pays an invoice short.",
    channel: "finance",
    bot: "Finance agent",
    messages: [
      { name: "Jordan Kim", initials: "JK", role: "Accounts receivable", time: "9:41", text: `Cedar Grove paid invoice 1182 short by $3,600 and called it a promo deduction. ${at("Finance")} is that right?` },
      { time: "9:42", text: `It isn’t. The trade promotions sheet has no Cedar Grove promo in October, so nothing backs the deduction. Disputing it needs ${at("Nia Brooks")} to approve.` },
      { name: "Nia Brooks", initials: "NB", role: "Controller", time: "9:44", text: "Approved.", chip: "Dispute $3,600 on invoice 1182" },
      { time: "9:45", text: "Done. The dispute is with Cedar Grove’s buyer, with the October promo calendar attached.", stmt: { label: "Disputed with Cedar Grove", from: 0, to: 3600, format: "${n}", text: "$3,600" } },
    ],
    stamp: "Asked at 9:41. Disputed by 9:45.",
    lead: "That approval is now a rule.",
    ruleFrom: "Rule saved · from Nia’s approval",
    rule: "A deduction is matched to an agreed promotion before it’s accepted.",
    runs: "Runs on every payment",
    more: "Matches every retailer deduction to an agreed promotion and disputes the rest, and drafts your monthly board pack.",
    why: "For suppliers selling mainly to retailers, deductions take about 2% of sales at the median (Credit Research Foundation deduction survey, 2012). Checking each one usually takes a deductions team in accounts receivable.",
    also: "Each month it drafts your board pack and investor update from your own numbers, with a source for every figure, for you to approve before it goes out.",
  },
  // A budget line running over plan partway through a quarter. Comparing
  // actuals with budget and reforecasting is the core routine of financial
  // planning: AFP surveys find most of a finance review meeting goes to
  // results, about half of that to actual against budget, and a reforecast
  // often takes a week or more. Traditionally: an FP&A analyst and the
  // monthly budget review.
  {
    id: "plan",
    tab: "Planning",
    eyebrow: "Let’s say marketing is running over budget.",
    channel: "leadership",
    bot: "Planning agent",
    messages: [
      { name: "Ava Morgan", initials: "AM", role: "Founder", time: "4:02", text: `Marketing feels heavy this quarter. ${at("Planning")} are we still on plan?` },
      { time: "4:03", text: `Not quite. Marketing is $12,000 over its Q4 budget after October’s holiday ads. Trimming November’s ads by that much keeps the quarter on plan. The new plan needs ${at("Sam Okafor")} to approve.` },
      { name: "Sam Okafor", initials: "SO", role: "Head of Planning", time: "4:05", text: "Approved.", chip: "Plan version 4: November ads down $12,000" },
      { time: "4:06", text: "Done. Plan version 4 is live, and the marketing lead has a task to rework November.", stmt: { label: "Q4 marketing, over plan", from: 12000, to: 0, format: "${n}", text: "$0" } },
    ],
    stamp: "Asked at 4:02. On plan by 4:06.",
    lead: "That approval is now a rule.",
    ruleFrom: "Rule saved · from Sam’s approval",
    rule: "A budget line running 10% over plan is flagged the week it happens.",
    runs: "Runs every Monday",
    more: "Flags a budget line the week it runs over, with a fix to keep the quarter on plan.",
    why: "In finance review meetings, 69% of the time goes to financial results, and nearly half of that to actual against budget (AFP survey of 606 financial planning professionals, 2017). The work usually sits with a financial planning analyst.",
  },
  // A margin dip nobody can explain, here freight: UPS and FedEx add holiday
  // demand surcharges to home deliveries from late October to mid-January
  // every year (on top of an average 5.9% annual rate rise for 2026), a
  // documented hit to shipping-heavy margins. A one-point move is what a
  // surcharge of that size can do. The why line carries the rate rise, a
// figure, not just the surcharge (2026-11-19): UPS from December 22, 2025
// and FedEx from January 5, 2026, each a 5.9% average. Traditionally: an analyst who builds the
  // weekly business review and chases each variance.
  {
    id: "pa",
    tab: "Analytics",
    eyebrow: "Let’s say margin dips and nobody knows why.",
    channel: "leadership",
    bot: "Analytics agent",
    messages: [
      { name: "Dana Reyes", initials: "DR", role: "Head of Revenue", time: "8:30", text: `Gross margin dipped last week. ${at("Analytics")} do we know why?` },
      { time: "8:31", text: `Freight. Our carriers’ holiday surcharges are on every home delivery until mid-January, which took margin from 42% to 41%. It’s in this week’s business review, which needs ${at("Ava Morgan")} to approve.` },
      { name: "Ava Morgan", initials: "AM", role: "Founder", time: "8:33", text: "Approved.", chip: "Week 46 business review" },
      { time: "8:33", text: "Done. The review is in #leadership, and every number in it links to its source.", stmt: { label: "Numbers traced to their source", from: 0, to: 24, format: "{n} of 24", text: "24 of 24" } },
    ],
    stamp: "Asked at 8:30. Explained by 8:33.",
    lead: "That approval is now a rule.",
    ruleFrom: "Rule saved · from Ava’s approval",
    rule: "Any margin move of a point or more is explained in the weekly review.",
    runs: "Runs on every weekly review",
    more: "Explains why a number moved, like margin lost to carrier surcharges, in a weekly review where every figure links to its source.",
    why: "UPS and FedEx raised their rates an average of 5.9% for 2026, and add holiday surcharges to home deliveries on top every peak season (the carriers’ 2026 rate and peak schedules). Explaining what that does to margin usually takes an analyst who builds the weekly review.",
  },
];
