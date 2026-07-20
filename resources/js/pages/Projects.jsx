import SEO from "../components/SEO";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsList from "../components/projects/ProjectsList";
import Testimonials from "../components/projects/Testimonials";

export default function Projects() {
  return (
    <>
      <SEO />
      <ProjectsHero />
      <ProjectsList />
      <Testimonials />
    </>
  );
}
