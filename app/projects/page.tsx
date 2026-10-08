import type { Metadata } from "next";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Projects from "@/components/sections/projects";
import { getHeroContent, getProjectsContent } from "@/lib/content/loaders";

export const metadata: Metadata = {
  title: "Projects | Ahmad Khalaf",
  description: "Explore all projects by Ahmad Khalaf.",
};

export default async function ProjectsPage() {
  const [hero, projects] = await Promise.all([getHeroContent(), getProjectsContent()]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header resumeUrl={hero.resumeUrl} />
      <main id="main-content" tabIndex={-1}>
        <Projects content={projects} showAll />
      </main>
      <Footer homeHref="/" />
    </div>
  );
}
