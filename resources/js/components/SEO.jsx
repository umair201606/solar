import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Solarkon – Premium Solar Solutions for a Sustainable Future',
  description = 'Solarkon Private Limited is the leading solar energy provider in Pakistan, delivering high-performance solar systems for residential, commercial, industrial, and agricultural needs. Installed 700+ systems including Pakistan\'s largest 150MW solar project.',
  keywords = 'solar energy pakistan, solar panel installation, solarkon, solar power system, residential solar, commercial solar, industrial solar, agricultural solar, off grid solar, hybrid solar, on grid solar, net metering, solar financing, solar company lahore, renewable energy pakistan, solar pv, solar system price pakistan, 150MW solar project',
  url = typeof window !== 'undefined' ? window.location.href : '',
  image = '/brand-logos/android-chrome-512x512.png',
  type = 'website',
}) => {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Solarkon Private Limited",
    "url": "https://solarkon.org",
    "logo": "/brand-logos/android-chrome-192x192.png",
    "description": "Pakistan's leading solar energy solutions provider with 700+ installations across residential, commercial, industrial, and agricultural sectors. Installed Pakistan's largest 150MW solar project.",
    "telephone": "+92-306-2935768",
    "email": "info@solarkon.org",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "94-C J1 Johar Town, Phase 2",
      "addressLocality": "Lahore",
      "addressCountry": "Pakistan"
    },
    "sameAs": [
      "https://www.facebook.com/solarkon",
      "https://twitter.com/solarkon",
      "https://www.linkedin.com/company/solarkon"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Solarkon Private Limited" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Solarkon" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@solarkon" />

      <script type="application/ld+json">{JSON.stringify(jsonLD)}</script>
    </Helmet>
  );
};

export default SEO;
