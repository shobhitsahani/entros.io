/**
 * Build a Solana Explorer URL for the current cluster.
 * Reads NEXT_PUBLIC_SOLANA_CLUSTER at build time; defaults to devnet.
 */
const cluster =
  (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as
    | "devnet"
    | "mainnet-beta"
    | "localnet"
    | undefined) ?? "devnet";

export function explorerUrl(
  address: string,
  type: "address" | "tx" = "address",
): string {
  if (cluster === "localnet") {
    return `https://explorer.solana.com/${type}/${address}?cluster=custom&customUrl=http://localhost:8899`;
  }
  return `https://explorer.solana.com/${type}/${address}?cluster=${cluster}`;
}
