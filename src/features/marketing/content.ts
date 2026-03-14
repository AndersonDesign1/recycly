export const supportedWasteTypes = [
  "Plastic bottles, containers, and packaging",
  "Paper, cardboard, and office waste",
  "Glass bottles and jars",
  "Metal cans and household scrap",
  "Small electronic items such as chargers and accessories",
  "Textiles that can still be reused or recycled",
  "Organic waste where collection capacity allows it",
  "Mixed household recyclables as a fallback during early rollout",
];

export const publicNavigation = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/supported-waste", label: "Supported waste" },
  { href: "/rewards", label: "Rewards" },
  { href: "/trust-safety", label: "Trust & safety" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const publicPages = {
  "how-it-works": {
    eyebrow: "How it works",
    title: "Book a pickup, follow the handoff, and earn points after review.",
    intro:
      "Recycly is built for households that want a clear process. You book a pickup, a collector handles the handoff, staff reviews the proof, and points land only after that check is complete.",
    sections: [
      {
        title: "Book a pickup without guesswork",
        body: "Choose the waste type, add the address, pick a time window, and send the request. The app keeps the form practical so you can finish it quickly from your phone.",
      },
      {
        title: "Collectors take work by area",
        body: "When a request is available in the same city, an eligible collector can accept it. That keeps the early rollout local, manageable, and easier to trust.",
      },
      {
        title: "Statuses stay visible",
        body: "You can see whether a request is assigned, accepted, on the way, collected, verified, rejected, completed, or cancelled. Nothing important should happen in the dark.",
      },
      {
        title: "Verification comes before rewards",
        body: "Collectors upload proof after collection. Staff reviews the result before any points are issued. That extra step keeps the reward system honest.",
      },
    ],
  },
  "supported-waste": {
    eyebrow: "Supported waste",
    title:
      "The launch list stays practical because that is what households need.",
    intro:
      "Recycly starts with common household categories that people can actually separate at home. The goal is a list that makes collection easier, not longer.",
    sections: supportedWasteTypes.map((item) => ({
      title: item,
      body: "If you can keep this category separate before pickup, collection and verification usually move faster.",
    })),
  },
  rewards: {
    eyebrow: "Rewards",
    title:
      "Points are earned after verified recycling, not at the moment of request.",
    intro:
      "That is a deliberate choice. Recycly ties rewards to confirmed work on the ground so the system can grow without turning into a payout free-for-all.",
    sections: [
      {
        title: "Points are tied to verified collections",
        body: "Creating a pickup request does not earn points on its own. Staff verification is what confirms the collection and unlocks the reward.",
      },
      {
        title: "Redemption requests are reviewed",
        body: "Users can submit redemption requests for cashout-style options, vouchers, or partner rewards, but those requests still pass through operational review.",
      },
      {
        title: "History stays visible",
        body: "You can track what was requested, what was approved, what was rejected, and what has already been fulfilled from the dashboard.",
      },
    ],
  },
  "trust-safety": {
    eyebrow: "Trust & safety",
    title: "The product is designed to be reviewed, not just used.",
    intro:
      "Recycly treats trust as an operations problem. That means visible statuses, role-based permissions, staff review, and proper support paths when something goes wrong.",
    sections: [
      {
        title: "Verification before value",
        body: "Proof is reviewed before points are issued. That protects the reward pool and makes the platform easier to audit as usage grows.",
      },
      {
        title: "Role-based oversight",
        body: "Collectors, staff, and super admins all have different responsibilities. Sensitive actions stay limited to the right role at the server layer.",
      },
      {
        title: "Support and disputes stay inside the product",
        body: "If a pickup goes badly or a reward decision needs review, users can raise a ticket or dispute directly in the app instead of chasing updates elsewhere.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Straight answers before you decide whether to trust the service.",
    intro:
      "These answers match the MVP that exists in the app now. They are not placeholders and they are not promises about a future version.",
    sections: [
      {
        title: "Do I get points as soon as I book a pickup?",
        body: "No. Points are added only after the collection is reviewed and verified by staff.",
      },
      {
        title: "What if my pickup is rejected?",
        body: "The request status will show the outcome, and you can open a support ticket or dispute if you think the decision should be checked again.",
      },
      {
        title: "Can a collector change pickup status?",
        body: "Yes, but only through allowed workflow steps. The app does not let collectors skip the process.",
      },
      {
        title: "Is cashout automatic?",
        body: "No. Cashout is treated as a redemption request and can be approved, rejected, or fulfilled by staff.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact & help",
    title: "When something breaks down, there should be a clear next step.",
    intro:
      "Support is meant to stay tied to the real pickup or reward record involved. That makes it easier for staff to respond with context instead of starting from scratch.",
    sections: [
      {
        title: "Use the dashboard first",
        body: "Support tickets and disputes can be raised directly inside the app, including the related pickup request when the issue is tied to a collection.",
      },
      {
        title: "Send the details that matter",
        body: "A clear subject, the exact issue, and the request ID when you have it will usually save time for everyone involved.",
      },
      {
        title: "Escalation is built in",
        body: "Staff can resolve issues directly or escalate sensitive cases to super admin when more oversight is needed.",
      },
    ],
  },
} as const;

export const marketingHighlights = [
  {
    title: "Built around pickup, not drop-off",
    description:
      "Households do not need to figure out where to take recyclables before they can participate.",
  },
  {
    title: "Rewards stay tied to proof",
    description:
      "Collectors upload evidence and staff reviews it before points move, which keeps the incentive system credible.",
  },
  {
    title: "Operations stay visible",
    description:
      "Users, collectors, staff, and admins each see the part of the work they actually need, without losing the chain of accountability.",
  },
];

export const trustPrinciples = [
  "Every important workflow step has a visible status",
  "Points are issued only after staff review",
  "Support and disputes stay attached to the underlying record",
  "Operational roles are separated so sensitive actions can be traced",
];

export const docsGuide = [
  {
    title: "What Recycly is",
    body: "Recycly is a pickup-first recycling app for urban households in Nigeria. You schedule a collection, follow the request through the app, and earn points once staff confirms what was collected.",
  },
  {
    title: "What can be recycled",
    body: "The launch list focuses on common household categories such as plastic, paper, glass, metal, small electronics, textiles, and other recyclables that can be handled in early operations.",
  },
  {
    title: "How pickup scheduling works",
    body: "You choose the waste type, enter the address, pick a collection window, and submit the request. The system then tries to match a collector in the same city.",
  },
  {
    title: "What the statuses mean",
    body: "A request can move through requested, assigned, accepted, en route, collected, verified, rejected, completed, or cancelled. Those labels are there so you always know the current stage.",
  },
  {
    title: "How points are earned",
    body: "Points are issued after a collected pickup has been reviewed and verified by staff. That keeps rewards tied to work the team can confirm.",
  },
  {
    title: "How redemption works",
    body: "When you have enough points, you can submit a redemption request. Staff can approve it, reject it, or mark it fulfilled after action has been taken.",
  },
  {
    title: "Support and disputes",
    body: "If a pickup fails, a collector does not show up, or a reward decision feels wrong, you can open a support ticket or dispute inside the app and track the response there.",
  },
];

export const homeSignals = [
  { label: "Pickup visibility", value: "Live status trail" },
  { label: "Rewards control", value: "Verification first" },
  { label: "City focus", value: "Lagos-led rollout" },
];
