import type { IntegrationSnippet } from "./types";

export const integrationSnippets: IntegrationSnippet[] = [
  {
    mode: "walletless",
    title: "Walletless verification",
    description:
      "Users verify without a wallet. The Pulse SDK generates a proof and submits it via the IAM relayer. Your API key identifies your escrow account.",
    code: `import { PulseSDK } from '@iam-protocol/pulse-sdk';

const pulse = new PulseSDK({ cluster: 'devnet' });

// User completes 7-second challenge on your site
const result = await pulse.verify();

if (result.success) {
  // result.commitment — the on-chain TBH hash
  // result.trustScore — current Trust Score
  grantAccess(result.commitment);
}`,
  },
  {
    mode: "wallet-connected",
    title: "Wallet-connected verification",
    description:
      "For DeFi and DAO users who want self-custody. The user signs the verification transaction with their own wallet.",
    code: `import { PulseSDK } from '@iam-protocol/pulse-sdk';
import { useWallet } from '@solana/wallet-adapter-react';

const pulse = new PulseSDK({ cluster: 'devnet' });
const { publicKey, signTransaction } = useWallet();

// Generate proof + build transaction
const proof = await pulse.generateProof();
const tx = pulse.buildVerifyTransaction(proof, publicKey);

// User signs with their wallet
const signed = await signTransaction(tx);
const sig = await connection.sendRawTransaction(
  signed.serialize()
);`,
  },
];
