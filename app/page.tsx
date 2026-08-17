import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Header from "@/components/layout/header";
import HireMe from "@/components/sections/hire-me";
import { Footer } from "@/components/layout/footer";
import { getDefaultPublishedPortfolio } from "@/lib/data/published-portfolios";
import { getRequiredPublishedSection } from "@/lib/portfolio/sections";

export default async function Home() {
  const portfolio = await getDefaultPublishedPortfolio();
  const hero = getRequiredPublishedSection(portfolio, "hero");
  const about = getRequiredPublishedSection(portfolio, "about");
  const experience = getRequiredPublishedSection(portfolio, "experience");
  const projects = getRequiredPublishedSection(portfolio, "projects");
  const hireMe = getRequiredPublishedSection(portfolio, "hire-me");
  const contact = getRequiredPublishedSection(portfolio, "contact");

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header resumeUrl={hero.content.resumeUrl} />
      <main id="main-content" tabIndex={-1}>
        <Hero content={hero.content} technologies={hero.technologies} />
        <About content={about.content} />
        <Experience content={experience.content} />
        <Projects content={projects.content} />
        <HireMe content={hireMe.content} />
        <Contact content={contact.content} />
      </main>
      <Footer />
    </div>
  );
}
