import type { IntegrationSnippet } from "./types";

export const integrationSnippets: IntegrationSnippet[] = [
  {
    mode: "walletless",
    title: "Walletless verification",
    description:
      "Liveness-check tier for non-crypto users. The Pulse SDK generates a proof and submits via the Entros relayer. No wallet needed. The integrator optionally funds verifications via API key.",
    code: `import { PulseSDK } from '@entros/pulse-sdk';

const pulse = new PulseSDK({
  cluster: 'devnet',
  relayerUrl: 'https://relayer.entros-protocol.org',
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
      "The primary verification flow. The user pays a small protocol fee (~0.005 SOL) and signs the transaction with their wallet. Your app reads the result on-chain for free.",
    code: `import { PulseSDK } from '@entros/pulse-sdk';
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
    description: "Use this to verify if a wallet has a valid Entros attestation on-chain.",
    code: `import { verifyEntrosAttestation } from '@entros/pulse-sdk';
import { useConnection } from '@solana/wallet-adapter-react';

// Inside your component or API route
const { connection } = useConnection();

try {
  // attestation: { isHuman: boolean, trustScore: number, verifiedAt: number, mode: string, expired: boolean } | null
  const attestation = await verifyEntrosAttestation(walletAddress, connection);

  if (!attestation || !attestation.isHuman || attestation.expired) {
    throw new Error("Access Denied: User is not verified.");
  }

  // Proceed securely
  grantAccess();
} catch (e) {
  console.error("Entros Verification failed:", e);
}`
  },
  {
    title: "Gate access on Trust Score",
    description:
      "Drop-in React component. Renders children only if the connected wallet meets your Trust Score threshold. Source and live preview at /gate-demo.",
    code: `import { EntrosGate } from "@/components/ui/entros-gate";

export function PremiumPage() {
  return (
    <EntrosGate minTrustScore={100}>
      {/* Children render only when the connected wallet
          has an Entros Anchor with trust score >= 100 */}
      <h1>Welcome, verified human.</h1>
    </EntrosGate>
  );
}`
  },
  {
    title: "Display verification status",
    description: "Use the drop-in React component to show identity status.",
    code: `import { EntrosBadge } from "@/components/ui/entros-badge";
import { useConnection } from "@solana/wallet-adapter-react";

export function ProfileHeader({ walletAddress }) {
  const { connection } = useConnection();
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold">{walletAddress}</h2>
      {/* Renders a verified pill with the trust score */}
      <EntrosBadge walletAddress={walletAddress} connection={connection} />
    </div>
  );
}`
  }
];
