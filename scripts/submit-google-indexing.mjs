import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';

const KEY_PATH =
  process.env.GOOGLE_INDEXING_KEY ||
  'C:\\Users\\PRASHANT\\Downloads\\gcp-mcp-503913-1a46f0314665.json';

const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));

const now = Math.floor(Date.now() / 1000);
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const header = b64({ alg: 'RS256', typ: 'JWT' });
const claims = b64({
  iss: key.client_email,
  scope: 'https://www.googleapis.com/auth/indexing',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
});

const sign = createSign('RSA-SHA256');
sign.update(`${header}.${claims}`);
const jwt = `${header}.${claims}.${sign.sign(key.private_key, 'base64url')}`;

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  }),
});
const { access_token, error, error_description } = await tokenRes.json();
if (!access_token) {
  console.error('Token error:', error, error_description);
  process.exit(1);
}

const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('Usage: node scripts/submit-google-indexing.mjs <url> [url...]');
  process.exit(1);
}

let ok = 0;
for (const url of urls) {
  const res = await fetch(
    'https://indexing.googleapis.com/v3/urlNotifications:publish',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type: 'URL_UPDATED' }),
    }
  );
  const data = await res.json();
  const time =
    data.urlNotificationMetadata?.latestUpdate?.notifyTime ??
    data.error?.message ??
    JSON.stringify(data);
  if (res.ok) ok++;
  console.log(`${res.ok ? 'OK  ' : 'FAIL'} ${url} — ${time}`);
}
console.log(`\n${ok}/${urls.length} submitted successfully`);
