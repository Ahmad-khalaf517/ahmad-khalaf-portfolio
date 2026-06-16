import { View, ChevronDown, Download } from "lucide-react";
import { AnimatedBorderButton } from "@/components/ui/animated-border-button";
import Image from "next/image";
import Github from "@/assets/icons/github";
import Linkedin from "@/assets/icons/linkedin";
import Section from "../app/section";
import SectionContent from "../app/section-content";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  // "GraphQL",
  "PostgreSQL",
  // "MongoDB",
  // "Redis",
  "Docker",
  // "AWS",
  "Vercel",
  "Tailwind CSS",
  "Prisma",
  // "Jest",
  // "Cypress",
  "Figma",
  "Git",
  "GitHub Actions",
];

const socialLinks = [
  { icon: Github, href: "https://github.com/Ahmad-khalaf517" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ahmad-khalaf-7a2637264/",
  },
];

const dots = Array.from({ length: 30 }).map(() => ({
  id: crypto.randomUUID(),
  left: Math.random() * 100,
  top: Math.random() * 100,
  animationDuration: 15 + Math.random() * 20,
  animationDelay: Math.random() * 5,
}));

export default function Hero() {
  return (
    <Section
      id="hero"
      className="min-h-screen flex items-center"
    >
      {/* Bg */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Hero image"
          className="w-full h-full object-cover opacity-40"
          fill
          preload
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/80 to-background" />
      </div>

      {/* Green Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Software Engineer • React Specialist
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in animation-delay-100">
                Crafting <span className="text-primary glow-text">digital</span>
                <br />
                experiences with
                <br />
                <span className="font-serif italic font-normal text-white">
                  precision.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg animate-fade-in animation-delay-200">
                Hi, I&apos;m <span className="text-primary"> Ahmad Khalaf</span>{" "}
                — a software engineer specializing in React, Next.js, and
                TypeScript. I build scalable, performant web applications that
                users love.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
              <a href="/Ahmad-khalaf-Resume.pdf" target="_blank" rel="noopener noreferrer">
                <AnimatedBorderButton>
                  <View className="w-5 h-5" />
                  View Resume
                </AnimatedBorderButton>
              </a>
              <a href="/Ahmad-khalaf-Resume.pdf" target="_blank" rel="noopener noreferrer" download>
                <AnimatedBorderButton>
                  <Download className="w-5 h-5" />
                  Download CV
                </AnimatedBorderButton>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 animate-fade-in animation-delay-400">
              <span className="text-md text-muted-foreground">Follow me: </span>
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  {<social.icon className="w-5 h-5" />}
                </a>
              ))}
            </div>
          </div>
          {/* Right Column - Profile Image */}
          <div className="relative animate-fade-in animation-delay-300">
            {/* Profile Image */}
            <div className="max-w-md mx-auto">
              <div
                className="absolute inset-0 
              rounded-3xl bg-linear-to-br 
              from-primary/30 via-transparent 
              to-primary/10 blur-2xl animate-pulse"
              />
              <div className="relative glass rounded-2xl p-2 glow-border">
                <Image
                  width={430}
                  height={430}
                  src="/ahmad-khalaf.png"
                  alt="Ahmad Khalaf"
                  loading="eager"
                  className="w-full aspect-square object-cover rounded-2xl"
                />

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      Available for work
                    </span>
                  </div>
                </div>
                {/* Stats Badge */}
                <div className="absolute -top-4 -left-4 glass rounded-xl px-4 py-3 animate-float animation-delay-500">
                  <div className="text-2xl font-bold text-primary">5+</div>
                  <div className="text-xs text-muted-foreground">
                    Years Exp.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20 animate-fade-in animation-delay-600">
          <p className="text-lg text-white mb-6 text-center">
            Technologies I work with
          </p>
          <div className="relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 w-32
             bg-linear-to-r from-background to-transparent z-10"
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-32
             bg-linear-to-l from-background to-transparent z-10"
            />
            <div className="flex animate-marquee">
              {[...skills, ...skills].map((skill, idx) => (
                <div key={idx} className="shrink-0 px-8 py-4">
                  <span className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContent>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 
      animate-fade-in animation-delay-800"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </div>
    </Section>
  );
}
