import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsList from "../components/projects/ProjectsList";
import Testimonials from "../components/projects/Testimonials";
import CTA from "../components/home/CTA";

export default function Projects() {
  return (
    <>
      <ProjectsHero />
      <ProjectsList />
      <Testimonials />
      <CTA compact />
      
    </>
  );
}
