import type { IdentifyResponseData, VisitorVerifyResponse } from '@onedeskpro/chatbot-types';

export const VISITOR_TOKEN = 'sv_test_token';

/** localStorage key the token manager uses once scoped to the default agent id. */
export const VISITOR_TOKEN_KEY = 'onedeskpro_visitor_token:a';

export function buildVisitorVerify(
  overrides: Partial<VisitorVerifyResponse> = {},
): VisitorVerifyResponse {
  return { valid: true, name: 'Remo', ...overrides };
}

export function buildIdentifyResponse(
  overrides: Partial<IdentifyResponseData> = {},
): IdentifyResponseData {
  return { visitorToken: VISITOR_TOKEN, ...overrides };
}

/** Seed a stored visitor token so init() verifies it instead of showing the identify form. */
export function seedVisitorToken(token = VISITOR_TOKEN): void {
  localStorage.setItem(VISITOR_TOKEN_KEY, token);
}
