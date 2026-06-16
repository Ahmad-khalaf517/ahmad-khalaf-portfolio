import React from "react";
import {
  ShieldCheck,
  Users,
  Code2,
  HeartHandshake,
  Zap,
  ArrowUpRight,
} from "lucide-react";

export default function WhyHireMe() {
  const values = [
    {
      icon: <Code2 className="h-5 w-5 text-(--color-primary)" />,
      title: "Adaptable & Growth-Driven",
      description:
        "Proven track record of evolving with the industry. Successfully transitioned from a 2-year foundation in Windows Forms desktop architecture to mastering modern web ecosystems through proactive, self-directed learning.",
    },
    {
      icon: <Users className="h-5 w-5 text-(--color-primary)" />,
      title: "Remote Leadership Experience",
      description:
        "Rose to Lead Front-End Developer at Schedex within a distributed team. Deeply experienced in API integration, shaping frontend architecture, and collaborating closely across design and backend boundaries under high autonomy.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-(--color-primary)" />,
      title: "Accountable & Proactive",
      description:
        "Remote work has sharpened my self-management, absolute accountability, and cross-timezone communication skills. I don't just wait for tasks; I proactively solve blockers before they hit production.",
    },
    {
      icon: <HeartHandshake className="h-5 w-5 text-(--color-primary)" />,
      title: "User-Centric Philosophy",
      description:
        "I firmly believe software is about helping people, not just writing code. I excel at taking a complex problem, translating user pain points into practical solutions, and delivering rewarding user experiences.",
    },
  ];

  return (
    <section
      id="why-hire"
      className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden bg-background text-foreground border-t border-border"
    >
      {/* Soft background ambient glow */}
      <div className="absolute left-1/3 top-1/2 -z-10 h-96 w-96 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_5%,transparent)] blur-[140px]" />

      <div className="space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-(--color-primary) font-semibold text-xs uppercase tracking-widest mb-3 bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-3 py-1 rounded-full border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]">
            <Zap className="h-3.5 w-3.5" /> Core Value
          </div>
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight leading-tight mb-6">
            What I bring to{" "}
            <span className="text-(--color-primary) font-medium">
              your engineering team
            </span>
            .
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed animate-fade-in">
            With a Bachelor&apos;s in Computer Science and over 5 years of
            professional evolution, I blend rigorous engineering fundamentals
            with real-world leadership. Here is why I am ready to hit the ground
            running on your product:
          </p>
        </div>

        {/* 2x2 Grid Layout for Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-fade-in animation-delay-200">
          {values.map((item, index) => (
            <div
              key={index}
              className="glass p-6 md:p-8 rounded-(--radius) border border-border group transition-all duration-300 hover:border-(--color-primary)/40 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary border border-border group-hover:border-(--color-primary)/30 transition-colors duration-300">
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Impact Statement & Call to Action Box */}
        <div className="glass-strong rounded-2xl border border-border glow-border animate-fade-in animation-delay-300 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl space-y-2">
            <h4 className="text-lg font-medium text-foreground">
              Looking for a developer who owns the problem?
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I’m searching for a collaborative engineering team where I can
              contribute full-stack value, tackle complex systems, and deliver
              features that make an actual impact on daily operations.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-(--color-primary) text-primary-foreground text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90 shadow-[0_0_15px_color-mix(in_srgb,var(--color-primary)_30%,transparent)] group"
          >
            Let&apos;s build together
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
