import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import { AnimatedBorderLink } from "@/components/ui/animated-border-button";
import Github from "@/assets/icons/github";
import Linkedin from "@/assets/icons/linkedin";
import SectionContent from "../app/section-content";
import { CountUp } from "@/components/ui/count-up";
import { TechMarquee } from "@/components/ui/tech-marquee";
import type { HeroContent, SocialLink, TechnologyItem } from "@/lib/content/types";

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
}: {
  content: HeroContent;
  technologies: TechnologyItem[];
}) {
  return (
    <section
      id="hero"
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
                Hi, I&apos;m <span className="text-primary"> {content.name}</span>{" "}
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
                href={content.resumeUrl}
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
              {content.socialLinks.map((social) => {
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
                  alt={content.name}
                  sizes="(min-width: 1024px) 430px, (min-width: 640px) 430px, calc(100vw - 64px)"
                  loading="eager"
                  className="w-full aspect-square object-cover rounded-2xl"
                />

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">
                      {content.availabilityText}
                    </span>
                  </div>
                </div>
                {/* Stats Badge */}
                <div className="absolute -top-4 -left-4 glass rounded-xl px-4 py-3">
                  <div className="text-2xl font-bold text-primary">
                    <CountUp value={content.yearsExperience} />
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
          <p className="text-lg text-white mb-6 text-center">
            Technologies I work with
          </p>
          <TechMarquee technologies={technologies} />
        </div>
      </SectionContent>
    </section>
  );
}
