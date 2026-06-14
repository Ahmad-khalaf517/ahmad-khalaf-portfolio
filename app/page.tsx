import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
// import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Header from "@/components/layout/header";
import Skills from "@/components/sections/skills";
import Technologies from "@/components/sections/technologies";
import HireMe from "@/components/sections/hire-me";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Technologies />
        {/* <Experience /> */}
        <Projects />
        <HireMe />
        <Contact />
      </main>
    </div>
  );
}
