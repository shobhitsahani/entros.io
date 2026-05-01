/**
 * Derives the deterministic SAS attestation PDA for a given wallet.
 *
 * The address is derived solely from constants and the wallet pubkey, so
 * it is well-defined whether or not the attestation has been written by
 * the executor yet. The popup emits this PDA in the verified envelope
 * so the integrator can poll for the attestation account asynchronously.
 *
 * Constants mirror `pulse-sdk/src/config.ts::SAS_CONFIG`. SAS_CONFIG is
 * not exported from the SDK's public surface, so the values are inlined
 * here. Keep in sync with the SDK if the credential or schema PDAs are
 * ever rotated (they have not been since launch).
 */
import { PublicKey } from "@solana/web3.js";

const SAS_PROGRAM_ID = "22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG";
const ENTROS_CREDENTIAL_PDA = "GaPTkZC6JEGds1G5h645qyUrogx7NWghR2JgjvKQwTDo";
const ENTROS_SCHEMA_PDA = "EPkajiGQjycPwcc3pupqExVdAmSfxWd31tRYZezd8c5g";

export function deriveAttestationPda(walletPubkey: string): string {
  const sasProgram = new PublicKey(SAS_PROGRAM_ID);
  const credential = new PublicKey(ENTROS_CREDENTIAL_PDA);
  const schema = new PublicKey(ENTROS_SCHEMA_PDA);
  const wallet = new PublicKey(walletPubkey);

  const [pda] = PublicKey.findProgramAddressSync(
    [
      new TextEncoder().encode("attestation"),
      credential.toBuffer(),
      schema.toBuffer(),
      wallet.toBuffer(),
    ],
    sasProgram,
  );
  return pda.toBase58();
}
