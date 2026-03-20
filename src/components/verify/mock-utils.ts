export function generateMockCommitment(): string {
  return (
    "0x" +
    Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
  );
}

export function generateMockTxSignature(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 44 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
