import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactItems = [
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "94-C J1 Johar Town,\nPhase 2 Lahore, Pakistan",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+92 306 2935768\n042-36449602",
  },
  {
    icon: Mail,
    title: "Email Us",
    detail: "info@solarkon.org",
  },
  {
    icon: Clock,
    title: "Web",
    detail: "www.solarkon.org",
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div>
        <span className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-600">
          Get In Touch
        </span>
        <h2 className="text-4xl font-bold mt-6 mb-4 text-dark-bg leading-tight">
          Let's Power Your Future Together
        </h2>
        <p className="text-gray-600 text-sm">
          Whether you're planning a residential install or an enterprise-scale
          project, <strong className="text-dark-bg">Solarkon</strong> is ready to
          help you make the switch to solar.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {contactItems.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
              <item.icon className="w-6 h-6 text-primary group-hover:text-dark-bg transition-colors" />
            </div>
            <h3 className="font-bold text-dark-bg mb-2 text-lg">{item.title}</h3>
            <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#041a12] rounded-3xl p-8 text-white mt-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        <h3 className="text-2xl font-bold mb-3 relative z-10">Customer Care</h3>
        <p className="relative z-10 mb-6 max-w-sm text-sm leading-relaxed text-gray-300">
          At Solarkon, client satisfaction goes beyond installation. We offer maintenance,
          expert repairs, warranty support, and remote monitoring throughout your
          system&apos;s life cycle.
        </p>
        <a
          href="tel:+923062935768"
          className="inline-flex items-center gap-2 bg-primary text-dark-bg font-bold px-6 py-3 rounded-full hover:bg-primary-hover transition-colors relative z-10"
        >
          <Phone className="w-4 h-4" /> +92 306 2935768
        </a>
      </div>
    </div>
  );
}
