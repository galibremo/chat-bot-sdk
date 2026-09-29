import type { SdkConfigResponse } from '@onedeskpro/chatbot-types';

export function buildSdkConfig(overrides: Partial<SdkConfigResponse> = {}): SdkConfigResponse {
  return {
    agentId: 'a',
    agentName: 'Bot',
    ready: true,
    blockReason: null,
    ...overrides,
  };
}
