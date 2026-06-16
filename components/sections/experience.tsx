import Section from "../app/section";
import SectionContent from "../app/section-content";
import SectionTitle from "../app/section-title";

const experiences = [
  {
    period: "2025 – Present",
    role: "Full Stack Development Cohort Participant",
    company: "Unrwa Digital Hub",
    description:
      "I am currently participating in the Full Stack Development Cohort Program at UNRWA Digital Hub, where I am expanding my expertise in backend development, system architecture, databases, DevOps, and modern full-stack engineering practices.",
    technologies: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "NodeJS",
      "Prisma",
      "AWS",
      "NestJS",
      "Python",
      "Django",
      "FastAPI",
    ],
    current: true,
  },
  {
    period: "2025 – Present",
    role: "Freelance Electron & React Developer",
    company: "Self-Employed",
    description:
      "Develop cross-platform desktop applications for clients using Electron and React. These projects focus on creating reliable business solutions with local database support, secure communication, and production-ready deployments.",
    technologies: [
      "React",
      "TypeScript",
      "Electron",
      "Tailwind CSS",
      "SQLite",
      "TypeORM",
      "NodeJS",
    ],
    current: false,
  },
  {
    period: "2024 – 2025",
    role: "Lead Front-End Developer",
    company: "Schedex",
    description:
      "As Lead Front-End Developer at Schedex, I oversee frontend architecture and development standards while mentoring team members and driving technical decisions. I work closely with cross-functional teams to build scalable applications that deliver real business value",
    technologies: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "NestJS",
      "PostgreSQL",
      "Docker",
    ],
    current: false,
  },
  {
    period: "2021 – 2024",
    role: "Front-End Developer",
    company: "Schedex",
    description:
      "At Schedex, I developed responsive and scalable web applications using React. I collaborated closely with designers and backend developers to deliver user-focused features, improve performance, and create modern user experiences.",
    technologies: ["React", "Redux", "Material-UI"],
    current: false,
  },
  {
    period: "2020 – 2021",
    role: "Full Stack Developer (Personal Projects)",
    company: "Self-Employed",
    description:
      "As I transitioned into web development, I dedicated my time to learning modern web technologies and building real-world projects. One of my first major projects was an Order Management System built with React and Flask, which helped me gain hands-on experience with full-stack application development.",
    technologies: ["React", "Flask", "Python", "PostgreSQL", "REST API"],
    current: false,
  },
  {
    period: "2019 – 2021",
    role: "Desktop Application Developer",
    company: "Various Business Projects",
    description:
      "I started my software development career building desktop business applications using Windows Forms and C#. During this period, I developed solutions that helped businesses manage their daily operations while strengthening my problem-solving, database, and software design skills.",
    technologies: ["C#", "Windows Forms", "SQL Server", ".NET Framework"],
    current: false,
  },
];

export default function Experience() {
  return (
    <Section id="experience" className="py-32">
      <div
        className="absolute top-1/2 left-1/4 w-96
       h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
      />

      <SectionContent className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <SectionTitle title="Career Journey" />
          <h2
            className="text-4xl md:text-5xl font-bold
           mt-4 mb-6 animate-fade-in animation-delay-100
            text-secondary-foreground"
          >
            Experience that{" "}
            <span className="font-serif italic font-normal text-white">
              {" "}
              speaks volumes.
            </span>
          </h2>

          <p
            className="text-muted-foreground
           animate-fade-in animation-delay-200"
          >
            A timeline of my professional growth, from curious beginner to
            senior engineer leading teams and building products at scale.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="timeline-glow absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/70 via-primary/30 to-transparent md:-translate-x-1/2 shadow-[0_0_25px_rgba(32,178,166,0.8)]" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="relative grid md:grid-cols-2 gap-8 animate-fade-in"
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10">
                  {exp.current && (
                    <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`pl-8 md:pl-0 ${
                    idx % 2 === 0
                      ? "md:pr-16 md:text-right"
                      : "md:col-start-2 md:pl-16"
                  }`}
                >
                  <div
                    className={`glass p-6 rounded-2xl border border-primary/30 hover:border-primary/50 transition-all duration-500`}
                  >
                    <span className="text-sm text-primary font-medium">
                      {exp.period}
                    </span>
                    <h3 className="text-xl font-semibold mt-2">{exp.role}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      {exp.description}
                    </p>
                    <div
                      className={`flex flex-wrap gap-2 mt-4 ${
                        idx % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      {exp.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-3 py-1 bg-surface text-xs rounded-full text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionContent>
    </Section>
  );
};
