import { Terminal, GraduationCap } from "lucide-react";

export default function AboutMe() {
  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden"
    >
      <div className="px-6 pt-34 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        {/* Left Column: Interactive Stats & Focus Card (Takes 4 cols on large screens) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="glass p-6 rounded-(--radius) border border-border relative group transition-all duration-300 hover:border-primary/40 shadow-xl">
            {/* Minimalist Top Accent Tag */}
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary border border-border text-primary">
              <Terminal className="h-5 w-5" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">
              Current Focus
            </span>
            <h3 className="text-xl font-bold mb-4 tracking-tight text-foreground">
              Full-Stack Engineering
            </h3>

            {/* Status indicators */}
            <div className="space-y-3.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_varprimary]" />
                <span className="text-foreground font-medium">
                  UNRWA Digital Hub Fellow
                </span>
              </div>
              <div className="flex items-center gap-3 pl-5">
                <span>Advanced Full Stack Program</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-border" />
                <span>5+ Years Industry Experience</span>
              </div>
            </div>

            {/* Tech Stack Pills to match your CV skills */}
            <div className="mt-6 pt-5 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript", "NestJS"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-muted text-foreground border border-border transition-colors duration-200 hover:border-primary/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Copy (Takes 8 cols on large screens) */}
        <div className="lg:col-span-8 space-y-8 animate-fade-in">
          {/* Section Header */}
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-widest mb-3 bg-[color-mix(in_srgb,varprimary_10%,transparent)] px-3 py-1 rounded-full border border-[color-mix(in_srgb,varprimary_20%,transparent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
              About Me
            </div>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight leading-tight">
              Bridging modern UI architecture with{" "}
              <span className="text-primary font-medium">
                end-to-end
              </span>{" "}
              capabilities.
            </h2>
          </div>

          {/* Core Paragraphs - Matching Option 1 */}
          <div className="space-y-6 text-base md:text-lg leading-relaxed text-muted-foreground">
            <p>
              I am a dedicated{" "}
              <strong className="text-foreground font-medium">
                Front-End Developer
              </strong>{" "}
              with over 5 years of professional experience building highly
              scalable and performant web applications using{" "}
              <strong className="text-primary font-medium">
                React, Next.js, and TypeScript
              </strong>
              . My engineering foundation began with developing
              cross-platform desktop applications before finding my true
              alignment in web technologies—where I focus on
              engineering intuitive, pixel-perfect user interfaces and highly
              optimized code systems.
            </p>

            <p>
              Driven by a deep commitment to architectural growth, I recently
              transitioned from my full-stack role at Schedex to dedicate my
              focus to the intensive{" "}
              <strong className="text-foreground font-medium">
                Full-Stack Development Program at the UNRWA Digital Hub
              </strong>
              . This intentional pivot empowers me to expand my knowledge beyond
              frontend interfaces, allowing me to confidently master backend
              development, advanced database optimization, and scalable system
              architectures.
            </p>
          </div>

          {/* Goal Callout Box using glass-strong for premium depth */}
          <div className="glass-strong rounded-(--radius) border border-border p-6 relative overflow-hidden group">
            {/* Subtle highlight strip on the left edge */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />

            <div className="flex gap-4 items-start">
              <GraduationCap className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  The Vision
                </h4>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  My objective is to consistently sharpen my engineering skill
                  set to become a highly versatile software engineer who
                  seamlessly blends elegant frontend visuals with resilient,
                  clean server logic to deliver production-ready products that
                  solve actual user problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
