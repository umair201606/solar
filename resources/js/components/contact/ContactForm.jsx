import { Zap } from "lucide-react";

export default function ContactForm() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-dark-bg mb-2 slide-from-left">Send Us a Message</h2>
      <p className="text-gray-600 text-sm mb-6 animate-fade-in-up-delay-1">
        Fill out the form and our team will get back to you within 24 hours.
      </p>
      <form className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-dark-bg block mb-1">First Name *</label>
            <input
              type="text"
              placeholder="Your first name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-dark-bg block mb-1">Last Name *</label>
            <input
              type="text"
              placeholder="Your last name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-dark-bg block mb-1">Email *</label>
          <input
            type="email"
            placeholder="e.g. info@solarkon.org"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-dark-bg block mb-1">Phone</label>
          <input
            type="tel"
            placeholder="e.g. +92 306 2935768"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-dark-bg block mb-1">Message *</label>
          <textarea
            placeholder="Tell us about your project or question..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:border-primary text-sm resize-none"
          />
        </div>
        <button
          type="button"
          className="bg-dark-card text-primary px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-dark-bg transition"
        >
          Send Message <Zap className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
