import useScrollAnimation from '../../lib/useScrollAnimation';

export default function CTA({ compact = false }) {
  const [sectionRef, isVisible] = useScrollAnimation();

  return (
    <section className={compact ? "py-10 px-6" : "py-20 px-6 overflow-hidden"}>
      <div
        className={`max-w-7xl mx-auto bg-dark-bg flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden ${
          compact
            ? "rounded-[2rem] p-8 md:p-10 items-center"
            : "rounded-[3rem] p-12 md:p-16 items-center"
        }`}
      >
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('/background.webp')] bg-cover opacity-20 mix-blend-overlay pointer-events-none" />

        <div
          ref={sectionRef}
          className={`max-w-lg relative z-10 ${compact ? "md:max-w-md" : ""} mb-0 overflow-hidden`}
        >
          <span className="border border-gray-600 rounded-full px-4 py-1 text-xs text-primary">
            Powered by Trust and Results
          </span>
          <h2
            className={`font-bold text-white leading-tight ${
              compact
                ? "text-2xl md:text-3xl mt-4 mb-3"
                : `text-4xl md:text-5xl mt-6 mb-6 ${isVisible ? 'slide-from-left' : 'slide-from-left-init'}`
            }`}
          >
            Ready to switch to solar? Let's start the journey.
          </h2>
          <p
            className={`text-gray-300 text-sm ${compact ? "mb-5 max-w-sm" : `mb-8 ${isVisible ? 'animate-fade-in-up-delay-1' : 'animate-fade-in-up-init'}`}`}
          >
            With <strong className="text-white">Solarkon</strong>, solar isn't
            complicated. It's reliable, intelligent, and built to perform.
            Let's bring clean energy to life together.
          </p>
          <button
            type="button"
            className={`bg-white text-dark-bg rounded-full font-bold hover:bg-gray-200 transition ${
              compact ? "px-6 py-2.5 text-sm" : "px-8 py-3"
            }`}
          >
            Start The Journey
          </button>
        </div>

        <div
          className={`bg-white rounded-2xl w-full relative z-10 shadow-2xl shrink-0 ${
            compact ? "max-w-sm p-5" : "max-w-md p-8 rounded-3xl"
          }`}
        >
          <h3
            className={`font-bold text-dark-bg ${
              compact ? "text-lg mb-4" : "text-2xl mb-6"
            }`}
          >
            Get Your Free Consultation
          </h3>
          <form className={compact ? "space-y-2.5" : "space-y-4"}>
            <div>
              <label className="text-xs font-bold text-dark-bg block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className={`w-full border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-primary ${
                  compact ? "px-3 py-2 text-sm" : "px-4 py-3 rounded-xl"
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-dark-bg block mb-1">
                Email *
              </label>
              <input
                type="email"
                placeholder="e.g. info@solarkon.org"
                className={`w-full border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-primary ${
                  compact ? "px-3 py-2 text-sm" : "px-4 py-3 rounded-xl"
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-dark-bg block mb-1">
                Message *
              </label>
              <textarea
                placeholder="Tell us what you need here..."
                rows={compact ? 2 : 3}
                className={`w-full border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-primary resize-none ${
                  compact ? "px-3 py-2 text-sm" : "px-4 py-3 rounded-xl"
                }`}
              />
            </div>
            <button
              type="button"
              className={`w-full bg-primary text-dark-bg rounded-lg font-bold hover:bg-primary-hover transition ${
                compact ? "py-2.5 text-sm mt-1" : "py-3 rounded-xl mt-2"
              }`}
            >
              Free Consultation
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
