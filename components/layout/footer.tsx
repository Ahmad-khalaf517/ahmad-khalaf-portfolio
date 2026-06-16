import Github from "@/assets/icons/github";
import Linkedin from "@/assets/icons/linkedin";
import Image from "next/image";
import SectionContent from "../app/section-content";

const socialLinks = [
  { icon: Github, href: "https://github.com/Ahmad-khalaf517", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ahmad-khalaf-7a2637264/",
    label: "LinkedIn",
  },
];

const footerLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  // { href: "#skills", label: "Experience" },
  { href: "#experience", label: "Experience" },
  // { href: "#testimonials", label: "Testimonials" },
  { href: "#hire-me", label: "Hire Me" },
  { href: "#contact", label: "Contact" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <SectionContent>
        <div className="flex flex-col flex-wrap md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a href="#">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={100}
                height={100}
                className="w-10 h-10"
                loading="eager"
              />
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              © {currentYear} Ahmad Khalaf. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </SectionContent>
    </footer>
  );
};
