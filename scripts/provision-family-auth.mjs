import { randomBytes, pbkdf2Sync } from 'node:crypto';

const emails = process.argv.slice(2).map(email => email.trim().toLowerCase());
if (emails.length === 0 || new Set(emails).size !== emails.length || emails.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
  throw new Error('Provide one or more distinct email addresses.');
}

// Print once for secure delivery; this script never writes credentials to disk.
const password = randomBytes(24).toString('base64url');
const accounts = Object.fromEntries(emails.map(email => {
  const salt = randomBytes(24).toString('base64url');
  const hash = pbkdf2Sync(password, Buffer.from(salt, 'base64url'), 210000, 32, 'sha256').toString('base64url');
  return [email, { salt, hash, userId: 'family-main' }];
}));
console.log(JSON.stringify({ password, accounts: JSON.stringify(accounts), secret: randomBytes(48).toString('base64url') }));
