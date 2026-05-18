function TestimonialDecor() {
  return (
    <svg
      className="pointer-events-none absolute bottom-4 right-4 h-16 w-28 opacity-[0.18] sm:h-[72px] sm:w-[120px]"
      viewBox="0 0 148 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M118 18c-2 0-4 1.5-4 4v6h-8v-4c0-5.5 4.5-10 10-10s10 4.5 10 10v14c0 2.2-1.8 4-4 4h-6v10h8"
        stroke="#d4ff00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M128 78V48M128 48l-10-9M128 48l10-9M128 48V30"
        stroke="#d4ff00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="128" cy="48" r="2.5" fill="#d4ff00" />
      <path
        d="M98 78V58M98 58l-7-7M98 58l7-7M98 58V44"
        stroke="#d4ff00"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="98" cy="58" r="2" fill="#d4ff00" />
      <path
        d="M8 78 26 54h44L52 78H8Z"
        stroke="#d4ff00"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M20 66h36M30 54v24M42 54v24M54 54v24" stroke="#d4ff00" strokeWidth="1.25" />
      <path d="M24 78v6M48 78v6" stroke="#d4ff00" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white px-6 py-10 font-sans sm:px-10 lg:px-16 lg:py-12">
      <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-5">
        {/* Left ~38% — stretches to match right column height */}
        <div className="relative min-h-[260px] w-full shrink-0 overflow-hidden rounded-[1.75rem] sm:min-h-[300px] lg:min-h-0 lg:w-[38%] lg:max-w-[492px] lg:rounded-[2rem]">
          <img
            src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1200&auto=format&fit=crop"
            alt="Solarkon engineers smiling in front of solar panels"
            className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
          />
        </div>

        {/* Right ~62% — top-aligned with image */}
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <div className="mb-3 inline-flex w-fit items-center rounded-full border border-gray-900 px-4 py-1.5">
            <span className="text-xs font-medium tracking-tight sm:text-[13px]">
              Powered by Trust and Results
            </span>
          </div>

          <h2 className="mb-3 text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-[#050505] sm:text-4xl lg:text-[44px]">
            What Our Clients Say Matters
          </h2>

          <p className="mb-5 text-base leading-[1.55] text-gray-800 sm:mb-6 sm:text-[17px]">
            Every <strong className="font-bold text-black">Solarkon</strong> customer experience
            reflects the trust and quality behind our services. Their voices aren&apos;t just
            validation, they&apos;re a guiding force for our continued innovation in clean energy.
          </p>

          <div className="relative w-full">
            <div className="absolute left-0 top-0 z-10 hidden h-[80px] w-[80px] rounded-br-[24px] bg-white lg:block" />

            <div className="absolute left-0 top-0 z-20 flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary lg:h-[68px] lg:w-[68px] lg:rounded-[20px]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="lg:h-7 lg:w-7"
              >
                <path
                  d="M19 14H6V29H13C13 34 9 38 4 40L7 44C15 40 19 32 19 24V14Z"
                  fill="#041a12"
                />
                <path
                  d="M44 14H31V29H38C38 34 34 38 29 40L32 44C40 40 44 32 44 24V14Z"
                  fill="#041a12"
                />
              </svg>
            </div>

            <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-dark-bg lg:rounded-[2.25rem]">
              <TestimonialDecor />

              <div className="relative z-30 px-5 pb-6 pt-[4.25rem] sm:px-6 sm:pb-7 lg:px-8 lg:pb-8 lg:pl-[5.75rem] lg:pt-8 lg:pr-8">
                <p className="mb-5 text-base font-medium italic leading-[1.4] text-white lg:mb-6 lg:text-lg">
                  &ldquo;Solarkon delivered our 500 KWp installation across multiple branches
                  with professionalism and precision. Their after-sales support gives us
                  confidence that our investment will perform for years to come.&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                    alt="Lahore Grammar School representative"
                    className="h-11 w-11 shrink-0 rounded-full border-2 border-primary object-cover lg:h-12 lg:w-12"
                  />
                  <div>
                    <h4 className="text-sm font-bold leading-tight tracking-wide text-white lg:text-base">
                      Lahore Grammar School
                    </h4>
                    <p className="mt-0.5 text-xs font-medium text-primary lg:text-sm">
                      Education Sector Client
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
