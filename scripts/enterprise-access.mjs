// Make a username and password for the OpenShore for Enterprise platform page
// and product tour, good for 7 days (worker/enterpriseAccess.js).
//
//   ENTERPRISE_ACCESS_SECRET=... npm run enterprise:access -- "Acme Foods"
//
// The secret is the same value set on the Worker (wrangler secret put
// ENTERPRISE_ACCESS_SECRET). Keep it in a password manager, never in this repo.
import { issue } from '../worker/enterpriseAccess.js';

const secret = process.env.ENTERPRISE_ACCESS_SECRET;
const name = process.argv.slice(2).join(' ');
if (!secret) {
  console.error('Set ENTERPRISE_ACCESS_SECRET to the value on the Worker first.');
  process.exit(1);
}
if (!name) {
  console.error('Give a name for the person or company, for example: npm run enterprise:access -- "Acme Foods"');
  process.exit(1);
}
const { username, password, lastDay } = await issue(secret, name);
console.log(`Username: ${username}`);
console.log(`Password: ${password}`);
console.log(`Good through: ${lastDay.toISOString().slice(0, 10)} (UTC)`);
console.log(`Sign in at: https://openshore.ai/enterprise/platform/`);
