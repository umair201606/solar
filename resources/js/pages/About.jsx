import PageHero from "../components/shared/PageHero";
import CTA from "../components/home/CTA";
import AboutSection from "../components/about/AboutSection";
import FAQSection from "../components/faq/FAQSection";

export default function About() {
  return (
    <div className="bg-light-bg min-h-screen">
      <PageHero
        title="About Solarkon"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />
      <AboutSection />
      <FAQSection />
      <CTA compact />
    </div>
  );
}
