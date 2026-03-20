export interface MockVerification {
  id: string;
  timestamp: string;
  commitmentHash: string;
  txSignature: string;
  status: "verified" | "failed" | "pending";
  trustScoreDelta: number;
}

export const mockHistory: MockVerification[] = [
  {
    id: "v-012",
    timestamp: "2026-03-18T14:32:00Z",
    commitmentHash: "0x3a7f81d9...e2b1",
    txSignature: "5Uj8kZ...mN4p",
    status: "verified",
    trustScoreDelta: 3,
  },
  {
    id: "v-011",
    timestamp: "2026-03-11T10:15:00Z",
    commitmentHash: "0x9c2e47b3...f8a0",
    txSignature: "3Rk2pY...bQ7w",
    status: "verified",
    trustScoreDelta: 3,
  },
  {
    id: "v-010",
    timestamp: "2026-03-04T16:48:00Z",
    commitmentHash: "0x5d1f93a8...c4d6",
    txSignature: "8Wm4nT...hJ2x",
    status: "verified",
    trustScoreDelta: 3,
  },
  {
    id: "v-009",
    timestamp: "2026-02-25T09:22:00Z",
    commitmentHash: "0x7b4e28c1...a9e3",
    txSignature: "2Lp6vX...qR5k",
    status: "failed",
    trustScoreDelta: 0,
  },
  {
    id: "v-008",
    timestamp: "2026-02-18T11:05:00Z",
    commitmentHash: "0xe8a3d6f0...b2c7",
    txSignature: "9Hs3mK...tW8y",
    status: "verified",
    trustScoreDelta: 3,
  },
  {
    id: "v-007",
    timestamp: "2026-02-11T13:40:00Z",
    commitmentHash: "0x2c9b74e5...d1f8",
    txSignature: "6Fn7aP...vE4z",
    status: "verified",
    trustScoreDelta: 3,
  },
];
