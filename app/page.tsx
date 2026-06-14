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
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black  dark:text-white">
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
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
