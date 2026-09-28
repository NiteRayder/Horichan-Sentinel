import test from 'node:test';
import assert from 'node:assert/strict';
import { horichanRequest, isHorichanApiConfigured } from './horichan.js';

test('Horichan integration reports whether credentials are configured', () => {
  assert.equal(typeof isHorichanApiConfigured(), 'boolean');
});

test('Horichan integration fails closed when not configured', async () => {
  if (isHorichanApiConfigured()) return;
  await assert.rejects(horichanRequest('/guilds/example/overview'), {
    code: 'HORICHAN_API_NOT_CONFIGURED',
  });
});
