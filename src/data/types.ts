export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  benefit: string;
}

export interface UseCase {
  icon: string;
  title: string;
  problem: string;
  solution: string;
}

export interface Stat {
  label: string;
  value: string;
  numericValue?: number;
  suffix?: string;
}

export interface DeveloperSnippet {
  language: string;
  title: string;
  code: string;
  installCommand: string;
}

export interface VerificationStep {
  title: string;
  description: string;
  detail: string;
  icon: string;
}

export interface ProtocolComponentLink {
  label: string;
  href: string;
}

export interface ProtocolComponent {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  links?: ProtocolComponentLink[];
}

export interface PrivacyGuarantee {
  icon: string;
  title: string;
  description: string;
}

export interface SolutionCase {
  icon: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  example: string;
}

export interface IntegrationPartner {
  name: string;
  category: string;
  description: string;
  icon: string;
  logoUrl?: string;
}

export interface IntegrationSnippet {
  mode: "walletless" | "wallet-connected";
  title: string;
  description: string;
  code: string;
}
