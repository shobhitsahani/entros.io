export interface MockAnchor {
  walletAddress: string;
  trustScore: number;
  verificationCount: number;
  lastVerification: string;
  currentCommitment: string;
  createdAt: string;
  status: "active" | "expired" | "pending";
}

export const mockAnchor: MockAnchor = {
  walletAddress: "7xKXp2U8rGHT9kvJDwFB6oKg3GfY9mP4",
  trustScore: 73,
  verificationCount: 12,
  lastVerification: "2026-03-18T14:32:00Z",
  currentCommitment: "0x3a7f81d9c6b2e4f0a8d1c7e5b9f3a6d2e8c4b0e2b1",
  createdAt: "2026-01-15T09:00:00Z",
  status: "active",
};
