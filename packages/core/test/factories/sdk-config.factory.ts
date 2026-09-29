import type { SdkConfigResponse } from '@onedeskpro/chatbot-types';

export function buildSdkConfig(overrides: Partial<SdkConfigResponse> = {}): SdkConfigResponse {
  return {
    agentId: 'a',
    agentName: 'Remote Bot',
    ready: true,
    blockReason: null,
    ...overrides,
  };
}
