import PageHero from "../components/shared/PageHero";
import ContactSection from "../components/contact/ContactSection";
import Testimonials from "../components/projects/Testimonials";
import CTA from "../components/home/CTA";

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
      <ContactSection />
      
      {/* Map Section */}
      <section className="w-full h-[500px] mt-10 mb-20 relative px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="w-full h-full rounded-[3rem] overflow-hidden shadow-2xl relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.003310023447!2d74.2758223151493!3d31.469145881386524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919016186fb51db%3A0xc39f8263721edc72!2sJohar%20Town%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1689255018698!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Solarkon Location"
            className="absolute inset-0"
          ></iframe>
        </div>
      </section>

      <Testimonials />
      <CTA compact />
    </>
  );
}
