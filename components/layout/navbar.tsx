import Image from "next/image";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" aria-label="Back to top" className="inline-flex p-1 -m-1 rounded-xl">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            loading="eager"
            className="w-10 h-10"
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
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
        <div className="hidden lg:block">
          <ResumeButtonGroup resumeUrl={resumeUrl} />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl text-foreground hover:bg-surface transition-colors cursor-pointer"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in shadow-2xl shadow-black/25"
        >
          <div className="container mx-auto px-6 py-5 flex flex-col gap-2">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  href={link.href}
                  key={index}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={`text-base min-h-11 px-4 rounded-xl inline-flex items-center transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface"
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
