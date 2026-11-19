// The systems OpenShore connects to out of the box (founder, 2026-11-18),
// shown on the home page (_includes/ent-connections.njk). Every name here is
// a connector in the product plan (openshore.enterprise, docs/ENTERPRISE_PLAN.md:
// HubSpot, Salesforce, Shopify and QuickBooks Online from milestone 4b;
// Google Workspace, Microsoft 365, Slack, Teams, SPS Commerce, Amazon, NetSuite
// and ShipBob from 4c; Zendesk, Gorgias and Jira Service Management with ticket
// triage; sign-in through Google Workspace, Microsoft Entra ID, Okta or any
// SAML or OIDC provider). Anything else connects through an MCP connection or
// a connector built for that company. Add a name only when the plan has it.
//
// Names only, no logos: a vendor's logo goes on the page only from its own
// brand kit and under its terms.
export default [
  { group: "Sales and CRM", items: ["HubSpot", "Salesforce"] },
  { group: "Finance and accounting", items: ["QuickBooks Online", "NetSuite"] },
  { group: "Commerce and inventory", items: ["Shopify", "Amazon Seller Central", "Amazon Vendor Central", "ShipBob", "SPS Commerce"] },
  { group: "Email, files and chat", items: ["Google Workspace", "Microsoft 365", "Slack", "Microsoft Teams"] },
  { group: "Support", items: ["Zendesk", "Gorgias", "Jira Service Management"] },
  { group: "Sign-in", items: ["Google Workspace", "Microsoft Entra ID", "Okta", "Any SAML or OIDC provider"] },
];
