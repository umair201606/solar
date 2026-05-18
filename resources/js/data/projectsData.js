import { Home, Building2, Factory, Tractor, Zap, MapPin } from "lucide-react";

export const projects = [
  {
    slug: "residential-solutions",
    img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800",
    title: "Residential Solutions",
    detailTitle: "Home Solar Power System",
    loc: "Across Pakistan",
    desc: "Solarkon Private Limited is committed to lowering electricity costs and delivering top tier, cutting edge solutions for Pakistani communities.",
    completionDate: "Ongoing",
    tags: [
      { icon: Home, text: "Residential" },
      { icon: Zap, text: "Off-Grid & On-Grid" },
    ],
    overview: "Solarkon Private Limited, supported by a skilled team of engineers and technical specialists across Pakistan, is committed to lowering electricity costs and delivering top tier, cutting edge solutions for Pakistani communities.",
    objectives: "Lower electricity costs for homeowners with sustainable energy.",
    objectivesList: ["Custom system design for homes", "Seamless roof integration", "Long-term warranties"],
    results: ["Reduced monthly bills", "Energy independence for families"],
    delivered: [
      { title: "Home Solar System", desc: "Complete installation and after-sales service." },
    ],
    impact: "Empowering households with clean, renewable energy.",
    testimonial: {
      quote: "Our electricity bills have dropped significantly thanks to Solarkon. Their team ensured quick installation and reliable after-sales support.",
      name: "Residential Client",
      role: "Homeowner, Pakistan",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150",
    },
  },
  {
    slug: "commercial-solutions",
    img: "https://images.unsplash.com/photo-1611365892502-86f183700b06?w=800",
    title: "Commercial Solutions",
    detailTitle: "Commercial Solar Power Systems",
    loc: "Commercial Hubs, Pakistan",
    desc: "Our commercial solar solutions in Pakistan empower your workplace with efficient solar power systems, effectively replacing high-cost conventional energy.",
    completionDate: "Ongoing",
    tags: [
      { icon: Building2, text: "Commercial" },
      { icon: Zap, text: "High Efficiency" },
    ],
    overview: "Our commercial solar solutions in Pakistan empower your workplace with efficient solar power systems, effectively replacing high-cost conventional energy.",
    objectives: "Reduce operational energy costs for businesses.",
    objectivesList: ["Scalable commercial installations", "ROI-focused designs", "Minimal business disruption"],
    results: ["Substantial overhead reduction", "Enhanced corporate sustainability"],
    delivered: [
      { title: "Commercial Solar Array", desc: "High-yield panels for business operations." },
    ],
    impact: "Driving profitability through sustainable energy adoption.",
    testimonial: {
      quote: "Solarkon helped us cut operational overheads drastically. The commercial solar array performs exactly as promised.",
      name: "Gourmet Bakeries",
      role: "3.5 MWp, Multiple Branches",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150",
    },
  },
  {
    slug: "industrial-solutions",
    img: "https://images.unsplash.com/photo-1509391366360-515432d667c4?w=800",
    title: "Industrial Solutions",
    detailTitle: "Industrial Solar Installations",
    loc: "Industrial Zones, Pakistan",
    desc: "From factories to warehouses, our high-capacity solar systems are designed for heavy-load usage. We deliver stable energy and operational savings without compromising performance.",
    completionDate: "Ongoing",
    tags: [
      { icon: Factory, text: "Industrial" },
      { icon: MapPin, text: "Heavy-Load Capacity" },
    ],
    overview: "From factories to warehouses, our high-capacity solar systems are designed for heavy-load usage. We deliver stable energy and operational savings without compromising performance.",
    objectives: "Ensure stable, low-cost power for heavy manufacturing.",
    objectivesList: ["Megawatt-scale deployments", "Integration with heavy machinery", "Peak load shaving"],
    results: ["Massive reduction in grid dependency", "Protection against tariff hikes"],
    delivered: [
      { title: "Industrial Solar Plant", desc: "Engineered for maximum durability and yield." },
    ],
    impact: "Securing the energy future of Pakistan's industrial sector.",
    testimonial: {
      quote: "Reliable energy for our heavy machinery, delivered flawlessly. Bashir Sons trusts Solarkon for megawatt-scale industrial deployments.",
      name: "Bashir Sons Steel Industry",
      role: "5 MWp, Kala Shah Kaku",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150",
    },
  },
  {
    slug: "agricultural-solutions",
    img: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=800",
    title: "Agricultural Solutions",
    detailTitle: "Solar for Farms & Irrigation",
    loc: "Rural Pakistan",
    desc: "Transition your farm to dependable, off-grid solar energy ensuring steady power for irrigation, pumping, and operations while slashing expenses.",
    completionDate: "Ongoing",
    tags: [
      { icon: Tractor, text: "Agricultural" },
      { icon: Zap, text: "Off-Grid Pumping" },
    ],
    overview: "Fulfilling your agricultural energy needs with unreliable grid power and expensive conventional fuel is no longer viable. Transition your farm to dependable, off-grid solar energy ensuring steady power for irrigation, pumping, and operations while slashing expenses. Make your farming profitable with clean, cost effective solar solutions that boost both yield and income.",
    objectives: "Provide reliable off-grid power for farming and irrigation.",
    objectivesList: ["Solar tube wells", "Off-grid farm power", "Reduced diesel reliance"],
    results: ["Increased farming profitability", "Uninterrupted irrigation schedules"],
    delivered: [
      { title: "Agricultural Solar Setup", desc: "Robust systems built for rural environments." },
    ],
    impact: "Revolutionizing agriculture with cost-effective, clean energy.",
    testimonial: {
      quote: "Our irrigation costs have plummeted. Off-grid solar pumping made our farm more profitable with steady, dependable power.",
      name: "Agricultural Client",
      role: "4 MWp+ Agricultural Projects",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150",
    },
  }
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}

export function getOtherProjects(currentSlug) {
  return projects.filter((p) => p.slug !== currentSlug);
}
