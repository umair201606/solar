import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="border border-gray-300 rounded-full px-5 py-1.5 text-sm text-gray-600 font-medium">
            Get In Touch
          </span>
          <h2 className="text-4xl lg:text-[3.5rem] font-black text-dark-bg mt-4 mb-3 leading-[1.05] tracking-tight slide-from-left">
            Let's Power Your Future Together
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto animate-fade-in-up-delay-1">
            Whether you're planning a residential install or an enterprise-scale
            project, <strong className="text-dark-bg">Solarkon</strong> is ready to
            help you make the switch to solar.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
