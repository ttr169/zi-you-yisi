import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSession, readSession, passwordHash, verifyPassword, newSalt, parseAccounts } from '../app/email-session.ts';

test('only configured email accounts can use a signed session', async () => {
  const salt = newSalt();
  const account = { salt, hash: await passwordHash('a long sample password', salt), userId: 'family-one' };
  const accounts = parseAccounts(JSON.stringify({ 'Parent@Example.com': account }));
  assert.equal(await verifyPassword('a long sample password', account), true);
  assert.equal(await verifyPassword('wrong password', account), false);
  const now = Date.now();
  const token = await makeSession('parent@example.com', 'a test signing secret with adequate length', now);
  assert.deepEqual(await readSession(token, 'a test signing secret with adequate length', accounts, now), { email: 'parent@example.com', userId: 'family-one' });
  assert.equal(await readSession(token, 'different signing secret', accounts, now), null);
  assert.equal(await readSession(token, 'a test signing secret with adequate length', {}, now), null);
  assert.equal(await readSession(token, 'a test signing secret with adequate length', accounts, now + 31 * 86400000), null);
  assert.equal(await readSession(token.slice(0, -2) + 'xy', 'a test signing secret with adequate length', accounts, now), null);
});

test('reject invalid account configuration', () => {
  assert.deepEqual(parseAccounts('{'), {});
  assert.deepEqual(parseAccounts(JSON.stringify({ 'not-email': { salt: 'x', hash: 'y', userId: 'z' } })), {});
});
