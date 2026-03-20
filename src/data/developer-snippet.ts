import type { DeveloperSnippet } from "./types";

export const sdkSnippet: DeveloperSnippet = {
  language: "typescript",
  title: "5 lines to verify a human",
  code: `import { PulseSDK } from '@iam-protocol/pulse-sdk';

const pulse = new PulseSDK({ cluster: 'devnet' });
const result = await pulse.verify();

if (result.success) {
  grantAccess(result.commitment);
}`,
  installCommand: "npm install @iam-protocol/pulse-sdk",
};
