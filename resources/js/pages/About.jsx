import SEO from "../components/SEO";
import PageHero from "../components/shared/PageHero";
import AboutSection from "../components/about/AboutSection";
import FAQSection from "../components/faq/FAQSection";
import Reveal from "../components/shared/Reveal";

export default function About() {
  return (
    <div className="bg-light-bg min-h-screen">
      <SEO />
      <PageHero title="About Solarkon" />
        <AboutSection />
      <Reveal animation="fade-left" delay="50ms" slideOffset={60}>
        <FAQSection />
      </Reveal>
    </div>
  );
}
