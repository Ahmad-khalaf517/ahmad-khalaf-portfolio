"use client";
import Navbar from "./navbar";
import { useScrolledY } from "@/hooks/useScrolledY";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import type { PortfolioNavigationModel } from "@/lib/portfolio/rendering";

export default function Header({
  resumeUrl,
  navigation,
}: {
  resumeUrl: string;
  navigation: PortfolioNavigationModel;
}) {
  const isScrolled = useScrolledY(50);
  const scrollProgress = useScrollProgress();

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
        isScrolled ? "glass-strong py-3" : "bg-transparent py-5"
      }  z-50`}
    >
      <Navbar resumeUrl={resumeUrl} navigation={navigation} />
      <div className="absolute bottom-0 left-0 h-px w-full bg-border/50">
        <div
          className="h-full bg-primary shadow-[0_0_8px_var(--color-primary)] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
