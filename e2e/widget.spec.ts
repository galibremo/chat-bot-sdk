import { expect, test, type Page, type Route } from '@playwright/test';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const envelope = (data: unknown) => ({ statusCode: 200, message: 'ok', data });

function fulfillJson(route: Route, data: unknown) {
  if (route.request().method() === 'OPTIONS') {
    return route.fulfill({ status: 204, headers: CORS_HEADERS });
  }
  return route.fulfill({ json: envelope(data), headers: CORS_HEADERS });
}

/** Mock the SDK API and refuse every other request that leaves the dev server. */
async function mockApi(page: Page): Promise<void> {
  // Registered first so it runs last: later routes take precedence.
  await page.route(
    (url) => url.hostname !== 'localhost' && url.hostname !== '127.0.0.1',
    (route) => route.abort(),
  );
  await page.route('**/sdk/config', (route) =>
    fulfillJson(route, { agentId: 'e2e-agent', agentName: 'E2E Bot', ready: true, blockReason: null }),
  );
  // The socket only connects after identify, but never let it reach a real server.
  await page.routeWebSocket(
    (url) => url.hostname !== 'localhost',
    (ws) => ws.close(),
  );
}

/**
 * The widget renders into a closed shadow root, which Playwright cannot query.
 * Open it for the test only, the same way the unit tests capture the root.
 */
async function openShadowRoots(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const attachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init: ShadowRootInit) {
      return attachShadow.call(this, { ...init, mode: 'open' });
    };
  });
}

test.describe('chat widget', () => {
  test('should open the chat panel when the visitor clicks the launcher', async ({ page }) => {
    // Arrange
    await mockApi(page);
    await openShadowRoots(page);
    await page.goto('/');
    const launcher = page.getByRole('button', { name: 'Open chat' });

    // Act
    await launcher.click();

    // Assert
    const panel = page.getByRole('dialog', { name: 'Onedesk Pro Assistant' });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('button', { name: /Start Chatting/ })).toBeVisible();
  });
});
