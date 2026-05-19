import { Link } from "@inertiajs/react";
import PageHero from "../components/shared/PageHero";
import ProjectDetailHeader from "../components/projects/detail/ProjectDetailHeader";
import ProjectDetailContent from "../components/projects/detail/ProjectDetailContent";
import OtherProjects from "../components/projects/OtherProjects";
import Testimonials from "../components/projects/Testimonials";
import CTA from "../components/home/CTA";
import { getProjectBySlug } from "../data/projectsData";

export default function ProjectDetail({ slug }) {
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-bold text-dark-bg mb-4">Project not found</h1>
        <Link href="/projects" className="text-primary font-bold hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHero
        title="Project Detail"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      />
      <ProjectDetailHeader project={project} />
      <ProjectDetailContent project={project} />
      <OtherProjects currentSlug={project.slug} />
      <Testimonials />
      <CTA compact />
    </>
  );
}
