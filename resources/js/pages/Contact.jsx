import PageHero from "../components/shared/PageHero";
import ContactSection from "../components/contact/ContactSection";
import Testimonials from "../components/projects/Testimonials";
import CTA from "../components/home/CTA";
import Reveal from "../components/shared/Reveal";

export default function Contact() {
  return (
    <>
      <PageHero
        title="Contact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />
      <Reveal animation="fade-right" delay="50ms" slideOffset={60}>
        <ContactSection />
      </Reveal>
      
      {/* Map Section */}
      <Reveal animation="fade-left" delay="50ms" slideOffset={60}>
        <section className="w-full h-[500px] mt-10 mb-20 relative px-4 md:px-8 max-w-[1400px] mx-auto">
          <div className="w-full h-full rounded-[3rem] overflow-hidden shadow-2xl relative">
            <iframe 
              title="SOLARKON Location - Johar Town"
              src="https://maps.google.com/maps?q=94+J1+Block+J1+Phase+2+Johar+Town%2C+Lahore%2C+Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>
        </section>
      </Reveal>

      <Reveal animation="fade-right" delay="50ms" slideOffset={60}>
        <Testimonials />
      </Reveal>
      
    </>
  );
}
