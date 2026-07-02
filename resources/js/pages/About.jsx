import PageHero from "../components/shared/PageHero";
import AboutSection from "../components/about/AboutSection";
import FAQSection from "../components/faq/FAQSection";
import Reveal from "../components/shared/Reveal";

export default function About() {
  return (
    <div className="bg-light-bg min-h-screen">
      <PageHero title="About Solarkon" />
      <Reveal animation="fade-right" delay="50ms" slideOffset={60}>
        <AboutSection />
      </Reveal>
      <Reveal animation="fade-left" delay="50ms" slideOffset={60}>
        <FAQSection />
      </Reveal>
    </div>
  );
}
