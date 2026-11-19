// The worked examples on the home page (ent-demos.njk), one per planned bot,
// in the tab order. Each is one conversation: someone asks, the bot finds the
// cause and proposes a fix, the bot's admin approves, the bot reports it done
// with a figure that counts, then the fix becomes a rule. Every one is an
// example, labelled so on the page: the people, companies and figures are
// made up. The bots and their admins follow the product plan's six packs
// (Data Foundations, RevOps, Finance, Planning, Supply chain and Performance
// Analytics, each with one bot admin).
//
//   text      a message's words; html, for the @mentions (at())
//   chip      what the approval approved, shown under it
//   stmt      the done message's figure: label, from, to, and how it reads
//             (format, with {n} for the number; without one, "+$n")
//
// Revenue ops (founder, 2026-11-18) is the promo film's commission scene,
// word for word. Finance, Planning, Analytics and Data (founder, 2026-11-19:
// "add the other planned workers") each take the job the plan gives that bot.
//
// Every example is a documented, common problem that companies usually staff
// a role or build a process for (founder, 2026-11-19). Each one's sources and
// the people who traditionally handle it are noted above it; the vendor
// surveys among them are directional, and none of their figures is on the
// page. Change an example only for another problem that is just as
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
    tab: "Revenue ops",
    eyebrow: "Let’s say a rep’s commission comes up short.",
    heading: "Fixed in two minutes, without leaving the conversation.",
    channel: "sales",
    bot: "RevOps bot",
    messages: [
      { name: "Maya Chen", initials: "MC", role: "Account rep", time: "10:02", text: `My October commission looks $2,140 short. ${at("RevOps")} can you check?` },
      { time: "10:03", text: `Found it. The deal is in your territory but booked to someone else. Moving it needs ${at("Dana Reyes")} to approve.` },
      { name: "Dana Reyes", initials: "DR", role: "Head of Revenue", time: "10:04", text: "Approved.", chip: "Rebook the deal to Maya" },
      { time: "10:04", text: "Done. Your October statement is up $2,140.", stmt: { label: "October statement", from: 0, to: 2140, text: "+$2,140" } },
    ],
    stamp: "Asked at 10:02. Fixed at 10:04.",
    lead: "And that approval did more than fix one statement.",
    ruleFrom: "Rule saved · from Dana’s approval",
    rule: "Deals count toward the rep who owns the territory.",
    runs: "Runs before any pay change",
  },
  // A stockout that is really a wrong inventory record (a receipt booked to
  // the wrong warehouse). DeHoratius and Raman, "Inventory Record Inaccuracy:
  // An Empirical Analysis", Management Science 54(4), 2008: 65% of nearly
  // 370,000 records at one retailer were wrong, with the distribution
  // structure among the causes. Traditionally: inventory control, receiving
  // checks and cycle counts.
  {
    id: "inv",
    tab: "Supply chain",
    eyebrow: "Let’s say a best seller is about to run out.",
    heading: "Stock found and moving in three minutes, before anyone pays to rush it.",
    channel: "ops",
    bot: "Supply chain bot",
    messages: [
      { name: "Priya Shah", initials: "PS", role: "Operations lead", time: "2:14", text: `Reno is down to 40 Trail Packs with four days of orders waiting. The PO for 600 says received. ${at("Supply chain")} where did they go?` },
      { time: "2:15", text: `Found them. The PO was for Reno, but the 600 were received at Dallas, so Reno’s count never went up. Moving 400 to Reno needs ${at("Marcus Lee")} to approve.` },
      { name: "Marcus Lee", initials: "ML", role: "Head of Operations", time: "2:16", text: "Approved.", chip: "Transfer 400 units, Dallas to Reno" },
      { time: "2:17", text: "Done. The transfer ships today and lands in Reno Thursday, ahead of the orders.", stmt: { label: "Reno, on the way", from: 0, to: 400, unit: "units", text: "+400 units" } },
    ],
    stamp: "Asked at 2:14. Moving by 2:17.",
    lead: "And that approval did more than move one shipment.",
    ruleFrom: "Rule saved · from Marcus’s approval",
    rule: "Receipts are checked against the order’s ship-to before they count as stock.",
    runs: "Runs on every receipt",
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
    heading: "Disputed in four minutes, with the proof attached.",
    channel: "finance",
    bot: "Finance bot",
    messages: [
      { name: "Jordan Kim", initials: "JK", role: "Accounts receivable", time: "9:41", text: `Cedar Grove paid invoice 1182 short by $3,600 and called it a promo deduction. ${at("Finance")} is that right?` },
      { time: "9:42", text: `It isn’t. The trade promotions sheet has no Cedar Grove promo in October, so nothing backs the deduction. Disputing it needs ${at("Nia Brooks")} to approve.` },
      { name: "Nia Brooks", initials: "NB", role: "Controller", time: "9:44", text: "Approved.", chip: "Dispute $3,600 on invoice 1182" },
      { time: "9:45", text: "Done. The dispute is with Cedar Grove’s buyer, with the October promo calendar attached.", stmt: { label: "Disputed with Cedar Grove", from: 0, to: 3600, format: "${n}", text: "$3,600" } },
    ],
    stamp: "Asked at 9:41. Disputed by 9:45.",
    lead: "And that approval did more than dispute one invoice.",
    ruleFrom: "Rule saved · from Nia’s approval",
    rule: "A deduction is matched to an agreed promotion before it’s accepted.",
    runs: "Runs on every payment",
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
    heading: "Back on plan in four minutes, before the month closes.",
    channel: "leadership",
    bot: "Planning bot",
    messages: [
      { name: "Ava Morgan", initials: "AM", role: "Founder", time: "4:02", text: `Marketing feels heavy this quarter. ${at("Planning")} are we still on plan?` },
      { time: "4:03", text: `Not quite. Marketing is $12,000 over its Q4 budget after October’s holiday ads. Trimming November’s ads by that much keeps the quarter on plan. The new plan needs ${at("Sam Okafor")} to approve.` },
      { name: "Sam Okafor", initials: "SO", role: "Head of Planning", time: "4:05", text: "Approved.", chip: "Plan version 4: November ads down $12,000" },
      { time: "4:06", text: "Done. Plan version 4 is live, and the marketing lead has a task to rework November.", stmt: { label: "Q4 marketing, over plan", from: 12000, to: 0, format: "${n}", text: "$0" } },
    ],
    stamp: "Asked at 4:02. On plan by 4:06.",
    lead: "And that approval did more than fix one budget.",
    ruleFrom: "Rule saved · from Sam’s approval",
    rule: "A budget line running 10% over plan is flagged the week it happens.",
    runs: "Runs every Monday",
  },
  // A margin dip nobody can explain, here freight: UPS and FedEx add holiday
  // demand surcharges to home deliveries from late October to mid-January
  // every year (on top of an average 5.9% annual rate rise for 2026), a
  // documented hit to shipping-heavy margins. A one-point move is what a
  // surcharge of that size can do. Traditionally: an analyst who builds the
  // weekly business review and chases each variance.
  {
    id: "pa",
    tab: "Analytics",
    eyebrow: "Let’s say margin dips and nobody knows why.",
    heading: "Explained in three minutes, with every number traced.",
    channel: "leadership",
    bot: "Performance Analytics bot",
    messages: [
      { name: "Dana Reyes", initials: "DR", role: "Head of Revenue", time: "8:30", text: `Gross margin dipped last week. ${at("Performance")} do we know why?` },
      { time: "8:31", text: `Freight. Our carriers’ holiday surcharges are on every home delivery until mid-January, which took margin from 42% to 41%. It’s in this week’s business review, which needs ${at("Ava Morgan")} to approve.` },
      { name: "Ava Morgan", initials: "AM", role: "Founder", time: "8:33", text: "Approved.", chip: "Week 46 business review" },
      { time: "8:33", text: "Done. The review is in #leadership, and every number in it links to its source.", stmt: { label: "Numbers traced to their source", from: 0, to: 24, format: "{n} of 24", text: "24 of 24" } },
    ],
    stamp: "Asked at 8:30. Explained by 8:33.",
    lead: "And that approval did more than explain one dip.",
    ruleFrom: "Rule saved · from Ava’s approval",
    rule: "Any margin move of a point or more is explained in the weekly review.",
    runs: "Runs on every weekly review",
  },
  // Two reports disagree because they measure different things under one
  // name: the deck shows revenue earned (ASC 606 recognizes revenue as it is
  // earned, not when a deal is signed or invoiced), the dashboard shows deals
  // signed, which are bookings. Bookings, billings and revenue rarely match
  // at a growing company (the SaaS finance guides from Zuora, ChartMogul and
  // Drivetrain all warn of it), and one name with two meanings is the usual
  // cause of reports that disagree. Traditionally: a finance or data team
  // that owns the metric definitions and a data dictionary.
  {
    id: "df",
    tab: "Data",
    eyebrow: "Let’s say two reports disagree on revenue.",
    heading: "Settled in three minutes, with one meaning in every report after.",
    channel: "finance",
    bot: "Data Foundations bot",
    messages: [
      { name: "Nia Brooks", initials: "NB", role: "Controller", time: "11:20", text: `The board deck says October revenue was $1.42M. The sales dashboard says $1.51M. ${at("Data Foundations")} which is right?` },
      { time: "11:21", text: `Both, for different things. The deck shows revenue earned in October. The dashboard shows deals signed, which are bookings. Labelling that one as bookings needs ${at("Dana Reyes")} to approve.` },
      { name: "Dana Reyes", initials: "DR", role: "Head of Revenue", time: "11:22", text: "Approved.", chip: "Signed deals are bookings, everywhere" },
      { time: "11:23", text: "Done. Every report now shows $1.42M as revenue and $1.51M as bookings, each linked to its source.", stmt: { label: "Reports that agree", from: 7, to: 12, format: "{n} of 12", text: "12 of 12" } },
    ],
    stamp: "Asked at 11:20. Settled by 11:23.",
    lead: "And that approval did more than relabel one dashboard.",
    ruleFrom: "Rule saved · from Dana’s approval",
    rule: "Revenue means revenue earned. Signed deals are reported as bookings.",
    runs: "Checked on every report",
  },
];
