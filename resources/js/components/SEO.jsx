import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component injects meta tags, Open Graph, Twitter cards, and JSON‑LD.
 * Props can be overridden per page; defaults target the Home page.
 */
const SEO = ({
  title = 'Solarkon – Premium Solar Solutions for a Sustainable Future',
  description = 'Solarkon delivers next‑gen solar design, smart storage, and premium solar installations for homes, businesses, and agriculture in Pakistan.',
  keywords = 'premium solar solutions, solar design, solar installation, solar storage, renewable energy, solarkon, clean energy, solar projects, pakistan',
  url = typeof window !== 'undefined' ? window.location.href : '',
  image = '/brand-logos/android-chrome-512x512.png',
  type = 'website',
}) => {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Solarkon",
    "url": url,
    "logo": "/brand-logos/android-chrome-192x192.png",
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
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">{JSON.stringify(jsonLD)}</script>
    </Helmet>
  );
};

export default SEO;
