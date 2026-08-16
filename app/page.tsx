import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Header from "@/components/layout/header";
import HireMe from "@/components/sections/hire-me";
import { Footer } from "@/components/layout/footer";
import {
  getAboutContent,
  getContactContent,
  getExperienceContent,
  getHeroContent,
  getHireMeContent,
  getProjectsContent,
  getTechnologies,
} from "@/lib/content/loaders";

export default async function Home() {
  const [hero, about, experience, projects, technologies, hireMe, contact] =
    await Promise.all([
      getHeroContent(),
      getAboutContent(),
      getExperienceContent(),
      getProjectsContent(),
      getTechnologies(),
      getHireMeContent(),
      getContactContent(),
    ]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header resumeUrl={hero.resumeUrl} />
      <main id="main-content" tabIndex={-1}>
        <Hero content={hero} technologies={technologies} />
        <About content={about} />
        <Experience content={experience} />
        <Projects content={projects} />
        <HireMe content={hireMe} />
        <Contact content={contact} />
      </main>
      <Footer />
    </div>
  );
}
