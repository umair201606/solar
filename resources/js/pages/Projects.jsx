import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsList from "../components/projects/ProjectsList";
import Testimonials from "../components/projects/Testimonials";
import CTA from "../components/home/CTA";
import Reveal from "../components/shared/Reveal";

export default function Projects() {
  return (
    <>
      <ProjectsHero />
      <Reveal animation="fade-left" delay="50ms" slideOffset={60}>
        <ProjectsList />
      </Reveal>
      <Reveal animation="fade-right" delay="50ms" slideOffset={60}>
        <Testimonials />
      </Reveal>
      <Reveal animation="scale-up" delay="50ms">
        <CTA compact />
      </Reveal>
    </>
  );
}
