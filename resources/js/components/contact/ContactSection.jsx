import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export default function ContactSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}
