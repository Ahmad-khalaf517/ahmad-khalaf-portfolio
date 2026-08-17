import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import { AnimatedBorderLink } from "@/components/ui/animated-border-button";
import Github from "@/assets/icons/github";
import Linkedin from "@/assets/icons/linkedin";
import SectionContent from "../app/section-content";
import { CountUp } from "@/components/ui/count-up";
import { TechMarquee } from "@/components/ui/tech-marquee";
import type { SocialLink } from "@/lib/content/types";
import type {
  PublishedPortfolioSnapshot,
  PublishedSectionOfKind,
} from "@/lib/portfolio/schemas";

const socialIcons: Record<SocialLink["platform"], typeof Github> = {
  github: Github,
  linkedin: Linkedin,
};

const dots = Array.from({ length: 30 }).map(() => ({
  id: crypto.randomUUID(),
  left: Math.random() * 100,
  top: Math.random() * 100,
  animationDuration: 15 + Math.random() * 20,
  animationDelay: Math.random() * 5,
}));

export default function Hero({
  content,
  technologies,
  identity,
  sectionId = "hero",
}: {
  content: PublishedSectionOfKind<"hero">["content"];
  technologies: PublishedSectionOfKind<"hero">["technologies"];
  identity: PublishedPortfolioSnapshot["identity"];
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="relative overflow-hidden min-h-screen flex items-center py-0"
    >
      {/* Bg */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-40"
          fill
          preload
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/80 to-background" />
      </div>

      {/* Green Dots */}
      <div className="hero-dots absolute inset-0 overflow-hidden pointer-events-none">
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute w-1.5 h-1.5 rounded-full opacity-60"
            style={{
              backgroundColor: "#20B2A6",
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animation: `slow-drift ${dot.animationDuration}s ease-in-out infinite`,
              animationDelay: `${dot.animationDelay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <SectionContent className="pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary">
                <span className="w-2 h-2 bg-primary rounded-full" />
                {content.badgeText}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {content.headlinePrefix}{" "}
                <span className="text-primary glow-text">
                  {content.headlineHighlight}
                </span>
                <br />
                {content.headlineMiddle}
                <br />
                <span className="font-serif italic font-normal text-white">
                  {content.headlineAccent}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Hi, I&apos;m <span className="text-primary"> {identity.displayName}</span>{" "}
                — {content.subtext}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="hero-primary-cta group">
                View Projects
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <AnimatedBorderLink
                href={identity.resume.url}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Download className="w-5 h-5" />
                Download CV
              </AnimatedBorderLink>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-md text-muted-foreground">Follow me: </span>
              {identity.socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    aria-label={social.platform}
                    className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
          {/* Right Column - Profile Image */}
          <div className="relative">
            {/* Profile Image */}
            <div className="max-w-md mx-auto">
              <div
                className="absolute inset-0
              rounded-xl bg-linear-to-br
              from-primary/30 via-transparent
              to-primary/10 blur-2xl"
              />
              <div className="relative glass rounded-2xl p-2 glow-border">
                <Image
                  width={430}
                  height={430}
                  src={content.profileImage}
                  alt={identity.displayName}
                  sizes="(min-width: 1024px) 430px, (min-width: 640px) 430px, calc(100vw - 64px)"
                  loading="eager"
                  className="w-full aspect-square object-cover rounded-2xl"
                />

                {/* Floating Badge */}
                <div className="hero-availability-badge absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative flex size-3 shrink-0" aria-hidden="true">
                      <span className="availability-ping absolute inset-0 rounded-full bg-green-400" />
                      <span className="relative size-3 rounded-full bg-green-500" />
                    </span>
                    <span className="text-sm font-medium">
                      {content.availabilityText}
                    </span>
                  </div>
                </div>
                {/* Stats Badge */}
                <div className="hero-stat-badge absolute -top-4 -left-4 glass rounded-xl px-4 py-3">
                  <div className="text-2xl font-bold text-primary">
                    <CountUp
                      value={content.yearsExperience}
                      duration={900}
                      delay={450}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {content.yearsLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20">
          <div className="mb-6 flex items-center justify-center gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="h-px w-8 sm:w-14 bg-linear-to-r from-transparent to-primary/60"
            />
            <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-primary">Technologies</span> I work with
            </p>
            <span
              aria-hidden="true"
              className="h-px w-8 sm:w-14 bg-linear-to-l from-transparent to-primary/60"
            />
          </div>
          <TechMarquee technologies={technologies} />
        </div>
      </SectionContent>
    </section>
  );
}
