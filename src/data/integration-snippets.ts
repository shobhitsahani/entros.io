import type { IntegrationSnippet } from "./types";

export const integrationSnippets: IntegrationSnippet[] = [
  {
    mode: "walletless",
    title: "Walletless verification",
    description:
      "Users verify without a wallet. The Pulse SDK generates a proof and submits it via the IAM relayer. Your API key identifies your escrow account.",
    code: `import { PulseSDK } from '@iam-protocol/pulse-sdk';

const pulse = new PulseSDK({
  cluster: 'devnet',
  relayerUrl: 'https://relayer.iam-protocol.org',
});

// User completes Pulse challenge on your site
const result = await pulse.verify();

if (result.success) {
  // result.commitment — the on-chain TBH hash
  grantAccess(result.commitment);
}`,
  },
  {
    mode: "wallet-connected",
    title: "Wallet-connected verification",
    description:
      "For DeFi and DAO users who want self-custody. The user signs the verification transaction with their own wallet.",
    code: `import { PulseSDK } from '@iam-protocol/pulse-sdk';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

const pulse = new PulseSDK({ cluster: 'devnet' });
const { wallet } = useWallet();
const { connection } = useConnection();

// User completes challenge, signs tx with wallet
const result = await pulse.verify(
  touchElement, wallet.adapter, connection
);

if (result.success) {
  // result.txSignature — Solana transaction signature
  grantAccess(result.commitment);
}`,
  },
];
