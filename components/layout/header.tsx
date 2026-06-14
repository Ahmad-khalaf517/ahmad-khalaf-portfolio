"use client";
import Navbar from "./navbar";
import { useScrolledY } from "@/hooks/useScrolledY";

export default function Header() {
  const isScrolled = useScrolledY(50);

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
        isScrolled ? "glass-strong py-3" : "bg-transparent py-5"
      }  z-50`}
    >
      <Navbar />
    </header>
  );
}
