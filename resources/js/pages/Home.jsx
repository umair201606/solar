import Hero from "../components/home/Hero";
import WhoWeAre from "../components/home/WhoWeAre";
import Services from "../components/home/Services";
import Features from "../components/home/Features";
import Projects from "../components/home/Projects";
import CaseStudies from "../components/home/CaseStudies";
import CTA from "../components/home/CTA";
import Blog from "../components/home/Blog";
import Testimonials from "../components/projects/Testimonials";
import Reveal from "../components/shared/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal animation="fade-left" delay="60ms" slideOffset={90}>
        <WhoWeAre />
      </Reveal>
      <Services />
      <Reveal animation="fade-right" delay="50ms" slideOffset={60}>
        <Features />
      </Reveal>
      <Reveal animation="fade-up" delay="50ms" slideOffset={60}>
        <Projects />
      </Reveal>
      <Reveal animation="fade-left" delay="50ms" slideOffset={60}>
        <CaseStudies />
      </Reveal>
      <Reveal animation="fade-right" delay="50ms" slideOffset={60}>
        <Testimonials />
      </Reveal>
      <Reveal animation="scale-up" delay="50ms">
        <CTA />
      </Reveal>
      <Reveal animation="fade-up" delay="50ms" slideOffset={60}>
        <Blog />
      </Reveal>
    </>
  );
}
