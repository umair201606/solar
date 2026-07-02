import SEO from "../components/SEO";
import HeroSection from "../components/home/HeroSection";
import WhoWeAre from "../components/home/WhoWeAre";
import Services from "../components/home/Services";
import Features from "../components/home/Features";
import Projects from "../components/home/Projects";
import CaseStudies from "../components/home/CaseStudies";
import CTA from "../components/home/CTA";
import Blog from "../components/home/Blog";
import Testimonials from "../components/projects/Testimonials";

export default function Home() {
  return (
    <>
        <SEO />
        <HeroSection />
       <WhoWeAre />
      <Services />
      <Features />
      <Projects />
      <CaseStudies />
      <Testimonials />
      <CTA />
      <Blog />
    </>
  );
}
