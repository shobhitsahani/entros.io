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

export const useCaseSnippets = [
  {
    title: "Check if a wallet is human",
    description: "Use this to verify if a wallet has a valid IAM attestation on-chain.",
    code: `import { verifyIAMAttestation } from '@iam-protocol/pulse-sdk';
import { useConnection } from '@solana/wallet-adapter-react';

// Inside your component or API route
const { connection } = useConnection();

try {
  // result: { verified: boolean, commitment?: string }
  const result = await verifyIAMAttestation(walletAddress, connection);

  if (!result.verified) {
    throw new Error("Access Denied: User is not verified.");
  }

  // Proceed securely
  grantAccess();
} catch (e) {
  console.error("IAM Verification failed:", e);
}`
  },
  {
    title: "Gate access on Trust Score",
    description: "Require a minimum trust score to interact with your protocol.",
    code: `import { fetchIdentityState } from '@iam-protocol/pulse-sdk';

async function checkTrustThreshold(walletAddress, connection, minScore = 50) {
  try {
    // identity: { trustScore: number, ... }
    const identity = await fetchIdentityState(walletAddress, connection);
    
    if (!identity) throw new Error("No IAM Anchor found");
    if (identity.trustScore < minScore) {
      throw new Error(\`Trust score too low: \${identity.trustScore}\`);
    }
    
    return true;
  } catch (e) {
    console.error("Trust threshold validation failed:", e);
    return false;
  }
}`
  },
  {
    title: "Display verification status",
    description: "Use the drop-in React component to show identity status.",
    code: `import { IAMBadge } from "@/components/ui/iam-badge";
import { useConnection } from "@solana/wallet-adapter-react";

export function ProfileHeader({ walletAddress }) {
  const { connection } = useConnection();
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold">{walletAddress}</h2>
      {/* Renders a verified pill with the trust score */}
      <IAMBadge walletAddress={walletAddress} connection={connection} />
    </div>
  );
}`
  }
];
