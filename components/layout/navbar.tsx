import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ResumeButtonGroup } from "@/components/ui/resume-button-group";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#hire-me", label: "Hire Me" },
  { href: "#contact", label: "Contact" },
];

// Includes "hero" (no nav link of its own) purely so no link is ever
// mis-highlighted while the user is still at the top of the page.
const sectionIds = ["hero", "about", "experience", "projects", "hire-me", "contact"];

export default function Navbar({ resumeUrl }: { resumeUrl: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);

  return (
    <>
      <nav className="container mx-auto px-6 flex items-center justify-between">
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

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <ul className="glass rounded-full px-2 py-1 flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <ResumeButtonGroup resumeUrl={resumeUrl} />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground cursor-pointer"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong animate-fade-in">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  href={link.href}
                  key={index}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={`text-lg py-2 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            <div onClick={() => setIsMobileMenuOpen(false)}>
              <ResumeButtonGroup resumeUrl={resumeUrl} className="w-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
