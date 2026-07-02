import { Link } from "@inertiajs/react";
import { Zap, MapPin, Phone, Mail } from "lucide-react";
import { company } from "../../data/companyData";
import { siteImages } from "../../data/siteImages";

export default function FAQContactCard() {
  return (
    <div className="relative sticky top-28 h-fit overflow-hidden rounded-3xl bg-dark-card p-8 text-white">
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('${siteImages.panelsCloseup}')` }}
        aria-hidden
      />

      <span className="rounded-full border border-primary px-4 py-1 text-xs text-primary">
        Have Any Other Question?
      </span>
      <h3 className="relative z-10 mt-4 mb-3 text-2xl font-bold slide-from-left">
        Reach Out, We&apos;re Always Listening
      </h3>
      <p className="relative z-10 mb-8 text-sm text-gray-300 animate-fade-in-up-delay-1">
        Our 24/7 help line ensures clients can reach us anytime for urgent support.
      </p>

      <ul className="relative z-10 mb-8 space-y-5 text-sm">
        <li className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <span>{company.address}</span>
        </li>
        <li className="flex items-center gap-3">
          <Phone className="h-5 w-5 shrink-0 text-primary" />
          <span>
            {company.phone}
            <br />
            {company.tel}
          </span>
        </li>
        <li className="flex items-center gap-3">
          <Mail className="h-5 w-5 shrink-0 text-primary" />
          <span>{company.email}</span>
        </li>
      </ul>

      <Link
        href="/contact"
        className="relative z-10 flex w-max items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-dark-bg transition hover:bg-primary-hover"
      >
        Say Hello <Zap className="h-4 w-4" />
      </Link>
    </div>
  );
}
