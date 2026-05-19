import { Battery, LineChart, Settings, Tractor } from "lucide-react";
import { serviceOfferings } from "../../data/companyData";
import ServiceCard from "./ServiceCard";
import Reveal from "../shared/Reveal";

const icons = [Settings, Battery, LineChart, Tractor];

export default function Services() {
  return (
    <section className="bg-light-bg py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header Animate */}
        <Reveal animation="fade-right" delay="50ms" slideOffset={40}>
          <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600">
                What We Offer
              </span>
              <h2 className="mt-6 mb-4 max-w-lg text-4xl font-bold leading-tight text-dark-bg md:text-5xl">
                Comprehensive Solar Solutions for All
              </h2>
              <p className="max-w-md text-sm text-gray-600">
                From homes to factories and farms, our high-capacity solar systems deliver
                stable energy and operational savings across Pakistan.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <h3 className="text-4xl font-bold text-dark-bg">150MW</h3>
                <p className="mt-1 text-sm font-bold text-gray-600">
                  Installed
                  <br />
                  Capacity
                </p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-dark-bg">700+</h3>
                <p className="mt-1 text-sm font-bold text-gray-600">
                  Successful
                  <br />
                  Installations
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Staggered Cards Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {serviceOfferings.map((service, index) => (
            <Reveal
              key={service.title}
              animation="fade-up"
              delay={`${index * 125}ms`}
              slideOffset={40}
            >
              <ServiceCard
                {...service}
                icon={icons[index]}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
