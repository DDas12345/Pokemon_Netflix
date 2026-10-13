process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

test('GET /api/health returns backend status', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.equal(payload.status, 'ok');
    assert.equal(payload.service, 'pokeflix-backend');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
});
