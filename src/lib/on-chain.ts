import { Connection, PublicKey } from "@solana/web3.js";
import { PROGRAM_IDS } from "@iam-protocol/pulse-sdk";

export interface VerificationHistoryEntry {
  id: string;
  timestamp: number;
  commitmentHash: string;
  isValid: boolean;
}

export function commitmentBytesToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Fetch VerificationResult PDAs from iam-verifier program.
 * Filters by verifier pubkey at offset 8 (after Anchor discriminator).
 * Account layout: 8 (disc) + 32 (verifier) + 32 (proof_hash) + 8 (verified_at) + 1 (is_valid)
 */
export async function fetchVerificationHistory(
  walletPubkey: string,
  connection: Connection,
): Promise<VerificationHistoryEntry[]> {
  const verifierProgramId = new PublicKey(PROGRAM_IDS.iamVerifier);

  const accounts = await connection.getProgramAccounts(verifierProgramId, {
    filters: [
      { memcmp: { offset: 8, bytes: walletPubkey } },
    ],
  });

  const entries: VerificationHistoryEntry[] = [];

  for (const { pubkey, account } of accounts) {
    const data = account.data;
    if (data.length < 81) continue;

    // Skip 8 (discriminator) + 32 (verifier) = 40
    const proofHash = data.slice(40, 72);
    // verified_at: i64 at offset 72
    const verifiedAt = Number(data.readBigInt64LE(72));
    // is_valid: bool at offset 80
    const isValid = data[80] === 1;

    entries.push({
      id: pubkey.toBase58(),
      timestamp: verifiedAt,
      commitmentHash:
        "0x" +
        Array.from(proofHash)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
          .slice(0, 16) +
        "...",
      isValid,
    });
  }

  return entries.sort((a, b) => b.timestamp - a.timestamp);
}
