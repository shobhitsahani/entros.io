import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";

const FINDINGS = [
  {
    title: "Single-Modality Detection Is Failing",
    source: "SONAR Benchmark, ACM 2024-2025",
    body: "The most comprehensive evaluation of audio deepfake detection found that OpenAI's TTS is detected only 78% of the time by the best available classifier. Traditional acoustic features alone show \"significant generalization limitations\" against modern neural speech synthesis. Models trained on older datasets lose up to 43% performance when tested against newer TTS systems. Audio-only verification is a losing game.",
  },
  {
    title: "Multi-Modal Fusion Is the Defense",
    source: "BioMoTouch, arXiv 2025",
    body: "Touch and motion sensor fusion from commodity devices achieves 99.71% accuracy with 0.27% equal error rate. Mimicry attacks succeed less than 1% of the time. The strength comes from requiring an attacker to simultaneously replicate physiological characteristics across multiple independent sensor modalities in temporally consistent patterns. This represents an exponentially harder attack surface than any single modality.",
  },
  {
    title: "Voice-Gesture Coupling Is Biomechanical",
    source: "Pouw et al., Royal Society Proceedings B, 2025",
    body: "Hand movement and voice prosody couple through shared respiratory and motor control systems. This coupling is involuntary and biomechanical, not cognitive. Under delayed auditory feedback, the synchrony becomes stronger, not weaker, confirming it originates below conscious control. A bot using text-to-speech and a movement simulator produces two independent signals that lack this natural coupling. IAM detects this.",
  },
  {
    title: "Physics-Informed Detection Still Works",
    source: "VoiceRadar, NDSS 2025 (Distinguished Paper Award)",
    body: "Micro-frequency oscillations derived from vocal fold physics achieve 0.45% equal error rate against modern TTS and voice conversion. The key insight: TTS systems model the statistical distribution of speech features but not the underlying physics of speech production. Features grounded in biomechanics remain discriminative because they capture signals that emerge from the human vocal tract, not from statistical distributions that can be learned.",
  },
  {
    title: "Modern TTS Produces Artifacts in Both Directions",
    source: "Warren et al., \"Pitch Imperfect\", 2025",
    body: "Neural vocoders can produce acoustic perturbation values higher than human baselines, not just lower. This overturns the assumption that synthetic speech is \"too perfect.\" Effective detection must account for artifacts in both directions. IAM's validation pipeline is calibrated against these findings.",
  },
  {
    title: "Touch-IMU Shockwave Is a Binary Liveness Signal",
    source: "Device physics, validated by BioMoTouch 2025",
    body: "Physical touch interaction produces measurable hardware responses that programmatic touch injection does not. Scripted emulators, headless browsers, and automation frameworks generate valid touch coordinates without triggering the corresponding physical sensor responses. IAM uses this discrepancy as a liveness signal on supported devices.",
  },
];

export function ResearchValidationSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-base tracking-widest uppercase"
        duration={3}
      >
        {"// RESEARCH VALIDATION"}
      </TextShimmer>

      <h2 className="mt-4 font-mono text-2xl font-bold text-foreground md:text-3xl">
        Why multi-modal behavioral verification works.
      </h2>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Single-modality detection is losing to modern AI. IAM&apos;s multi-modal
        approach is validated by recent research as the correct architecture for
        proof of personhood in an era of neural speech synthesis and behavioral
        simulation.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {FINDINGS.map((f) => (
          <GlowCard key={f.title}>
            <p className="font-mono text-sm font-semibold text-foreground">
              {f.title}
            </p>
            <p className="mt-1 text-[11px] font-mono text-cyan/60">
              {f.source}
            </p>
            <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
              {f.body}
            </p>
          </GlowCard>
        ))}
      </div>

      <div className="mt-16">
        <div className="rounded-xl border border-cyan/10 bg-cyan/5 px-6 py-5">
          <p className="font-mono text-sm font-semibold text-foreground">
            The core advantage of IAM
          </p>
          <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
            IAM captures voice, movement, and touch simultaneously and
            verifies their temporal correlation. Spoofing one modality in
            isolation is feasible. Spoofing all three with consistent
            behavioral characteristics across modalities is an exponentially
            harder problem. IAM&apos;s Trust Score then requires maintaining that
            consistency across sessions over weeks, compounding the difficulty
            further.
          </p>
        </div>
      </div>
    </section>
  );
}
