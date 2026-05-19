import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component injects meta tags, Open Graph, Twitter cards, and JSON‑LD.
 * Props can be overridden per page; defaults target the Home page.
 */
const SEO = ({
  title = 'Solarize – Premium Solar Solutions for a Sustainable Future',
  description = 'Solarize delivers next‑gen solar design, smart storage, and over 12k installations worldwide. Go renewable with award‑winning, premium solar solutions.',
  keywords = 'premium solar solutions, solar design, solar installation, solar storage, renewable energy, solarize, clean energy, solar projects',
  url = typeof window !== 'undefined' ? window.location.href : '',
  image = '/assets/og-default.jpg',
  type = 'website',
}) => {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Solarize",
    "url": url,
    "logo": "/assets/logo.svg",
    "sameAs": [
      "https://www.facebook.com/solarize",
      "https://twitter.com/solarize",
      "https://www.linkedin.com/company/solarize"
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
