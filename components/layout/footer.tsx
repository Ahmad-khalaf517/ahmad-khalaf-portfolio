import Github from "@/assets/icons/github";
import Linkedin from "@/assets/icons/linkedin";
import Image from "next/image";
import SectionContent from "../app/section-content";
import type { SocialLink } from "@/lib/content/types";
import type { PortfolioNavigationLink } from "@/lib/portfolio/rendering";
import type { PublishedPortfolioSnapshot } from "@/lib/portfolio/schemas";

const socialIcons: Record<SocialLink["platform"], typeof Github> = {
  github: Github,
  linkedin: Linkedin,
};

const socialLabels: Record<SocialLink["platform"], string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
};

export const Footer = ({
  identity,
  navigationLinks,
}: {
  identity: PublishedPortfolioSnapshot["identity"];
  navigationLinks: PortfolioNavigationLink[];
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <SectionContent>
        <div className="flex flex-col flex-wrap md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a href="#" aria-label="Back to top" className="inline-flex p-1 -m-1 rounded-xl">
              <Image
              src={identity.logoUrl}
              alt={`${identity.displayName} logo`}
                width={100}
                height={100}
                className="w-10 h-10"
              />
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              © {currentYear} {identity.displayName}. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {identity.socialLinks.map((social) => {
              const Icon = socialIcons[social.platform];
              const label = socialLabels[social.platform];

              return (
                <a
                  key={social.platform}
                  href={social.href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full glass hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </SectionContent>
    </footer>
  );
};
