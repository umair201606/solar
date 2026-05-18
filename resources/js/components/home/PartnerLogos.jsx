import React from "react";

const logos = [
  { id: "astronergy", src: "/logos/astronergy-seeklogo.svg", alt: "Astronergy" },
  { id: "goodwe", src: "/logos/goodwe-seeklogo.svg", alt: "Goodwe" },
  { id: "jinko", src: "/logos/jinko-solar-seeklogo.svg", alt: "Jinko Solar" },
  { id: "longi", src: "/logos/longi-seeklogo.svg", alt: "Longi" },
  { id: "tesvolt", src: "/logos/tesvolt-seeklogo.svg", alt: "Tesvolt" },
  { id: "trina", src: "/logos/trina-solar-seeklogo.svg", alt: "Trina Solar" },
  { id: "abb", src: "/logos/abb-seeklogo.png", alt: "ABB" },
  { id: "canadian", src: "/logos/canadiansolar-seeklogo.png", alt: "Canadian Solar" },
  { id: "fronius", src: "/logos/fronius-seeklogo.png", alt: "Fronius" },
  { id: "huawei", src: "/logos/huawei-seeklogo.png", alt: "Huawei" },
  { id: "pakistan", src: "/logos/pakistan-cables-seeklogo.png", alt: "Pakistan Cables" },
  { id: "schneider", src: "/logos/schneider-electric-seeklogo.png", alt: "Schneider Electric" },
  { id: "sma", src: "/logos/sma-solar-technology-seeklogo.png", alt: "SMA Solar Technology" },
  { id: "voltronic", src: "/logos/voltronic-power-seeklogo.png", alt: "Voltronic Power" },
];

function LogoItem({ logo }) {
  return (
    <div
      className="shrink-0 px-10 flex items-center justify-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition duration-500"
    >
      <img src={logo.src} alt={logo.alt} className="h-12 w-auto object-contain" />
    </div>
  );
}

export default function PartnerLogos() {
  const loop = [...logos, ...logos];

  return (
    <div className="mt-24 text-center">
      <p className="font-bold text-dark-bg mb-8 px-6">
        Our Technology &amp; Equipment Partners
      </p>
      <div className="logo-marquee overflow-hidden">
        <div className="logo-marquee-track flex w-max items-center">
          {loop.map((logo, index) => (
            <LogoItem key={`${logo.id}-${index}`} logo={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}
