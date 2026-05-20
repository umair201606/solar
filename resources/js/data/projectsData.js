import { Zap, Building2, Sun } from "lucide-react";

export const projects = [
  {
    slug: "brightmall-complex",
    img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800",
    title: "BrightMall Complex",
    detailTitle: "BrightMall Complex Solar Rooftop Installation",
    loc: "Lisbon, Portugal",
    desc: "Solar rooftop installation across a large-scale shopping mall to reduce grid dependency and promote sustainable retail operations. Integrated with smart energy monitoring for maximum efficiency.",
    completionDate: "Completed",
    tags: [
      { icon: Zap, text: "500 kWp" },
      { icon: Building2, text: "Commercial Retail" },
      { icon: Sun, text: "Grid-Tied Solar PV" },
    ],
    overview: "Solar rooftop installation across a large-scale shopping mall to reduce grid dependency and promote sustainable retail operations. Integrated with smart energy monitoring for maximum efficiency.",
    objectives: "Lower operational carbon footprint and power retail sectors with sustainable clean energy.",
    objectivesList: ["Smart energy tracking integration", "High-yield roof solar design", "System safety certification"],
    results: ["30% reduction in grid overheads", "Reliable clean energy supply during peak business hours"],
    delivered: [
      { title: "Rooftop Solar Array", desc: "Premium high-capacity solar setup." },
    ],
    impact: "Empowering commercial hubs with dependable solar energy solutions.",
    testimonial: {
      quote: "BrightMall has taken a massive step toward sustainable retail operations thanks to Solarkon's engineered rooftop system.",
      name: "BrightMall Retail Director",
      role: "Operations Chief, Portugal",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150",
    },
  },
  {
    slug: "suncare-hospital",
    img: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=800",
    title: "SunCare Hospital",
    detailTitle: "SunCare Hospital Solar-Battery Hybrid System",
    loc: "Melbourne, Australia",
    desc: "Development of a solar-battery hybrid system for uninterrupted power in critical hospital zones, including ICUs and emergency rooms. Designed to meet high safety and reliability standards.",
    completionDate: "Completed",
    tags: [
      { icon: Zap, text: "420 kWp" },
      { icon: Building2, text: "Healthcare" },
      { icon: Sun, text: "Solar Hybrid (PV + Battery)" },
    ],
    overview: "Development of a solar-battery hybrid system for uninterrupted power in critical hospital zones, including ICUs and emergency rooms. Designed to meet high safety and reliability standards.",
    objectives: "Maintain clean, continuous power for medical machines in high-need hospital zones.",
    objectivesList: ["Integrated emergency backup batteries", "Continuous voltage stabilization", "Medical safety grade layout"],
    results: ["100% uninterrupted power during grid failures", "Lower monthly power tariffs for the facility"],
    delivered: [
      { title: "Solar-Battery Hybrid Setup", desc: "Continuous backup battery systems." },
    ],
    impact: "Providing life-saving stable energy arrays to healthcare sectors.",
    testimonial: {
      quote: "Reliable power is non-negotiable for hospitals. Solarkon's solar-battery system ensures our emergency zones never skip a beat.",
      name: "SunCare Facility Chief",
      role: "Facility Management, Australia",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150",
    },
  },
  {
    slug: "ecobank-tower",
    img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800",
    title: "EcoBank Tower",
    detailTitle: "EcoBank Tower Solar Façade & Rooftop System",
    loc: "Nairobi, Kenya",
    desc: "Solar façade and rooftop system installed on a 20-story corporate office building, integrated with energy-efficient HVAC systems to reduce operational carbon footprint.",
    completionDate: "Completed",
    tags: [
      { icon: Zap, text: "350 kWp" },
      { icon: Building2, text: "Financial/Corporate" },
      { icon: Sun, text: "(BIPV)" },
    ],
    overview: "Solar façade and rooftop system installed on a 20-story corporate office building, integrated with energy-efficient HVAC systems to reduce operational carbon footprint.",
    objectives: "Integrate building-applied solar solutions to drive financial hub efficiency.",
    objectivesList: ["Bi-facial solar façade integration", "HVAC system load balancing", "Modern grid-tied feed-in controls"],
    results: ["Dramatic cooling cost reductions", "Sleek architectural design that produces clean energy"],
    delivered: [
      { title: "Façade BIPV Panels", desc: "High-grade building integrated photovoltaic array." },
    ],
    impact: "Setting a new benchmark for green corporate infrastructure.",
    testimonial: {
      quote: "Our corporate headquarters now stands as a beacon of green design in Nairobi. Beautiful clean energy design.",
      name: "EcoBank Infrastructure Lead",
      role: "Finance Hub Operations, Kenya",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150",
    },
  },
  {
    slug: "greenforge-factory",
    img: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800",
    title: "GreenForge Factory",
    detailTitle: "GreenForge Factory Megawatt Industrial Array",
    loc: "Hamburg, Germany",
    desc: "Large-scale solar installation for a metal fabrication plant, optimized to meet industrial energy demand while supporting Germany's renewable transition goals. Includes automated load balancing.",
    completionDate: "Completed",
    tags: [
      { icon: Zap, text: "1.2 MWp" },
      { icon: Building2, text: "Heavy Manufacturing" },
      { icon: Sun, text: "Solar PV" },
    ],
    overview: "Large-scale solar installation for a metal fabrication plant, optimized to meet industrial energy demand while supporting Germany's renewable transition goals. Includes automated load balancing.",
    objectives: "Offset heavy manufacturing energy overheads with megawatt-scale arrays.",
    objectivesList: ["Megawatt industrial panels array", "Automated smart load balancing systems", "Peak-demand power shaving integration"],
    results: ["Massive factory carbon footprint reduction", "Significant protections from conventional utility tariff spikes"],
    delivered: [
      { title: "Megawatt Solar Array", desc: "Highly robust and durable industrial-grade PV panels." },
    ],
    impact: "Accelerating heavy industries along clean energy pathways.",
    testimonial: {
      quote: "Our fabrication plant operates steadily while lowering grid electricity expenses. The automated load balancing works perfectly.",
      name: "GreenForge Operations Director",
      role: "Manufacturing Chief, Germany",
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
