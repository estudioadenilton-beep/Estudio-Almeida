import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical, ogImage, ogType = 'website' }) => {
  const siteName = 'Estúdio Almeida';
  const fullTitle = `${title} | ${siteName}`;
  const absoluteUrl = `https://estudioalmeida.com${canonical || ''}`;

  return (
    <Helmet>
      {/* SEO Básica */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={absoluteUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:image" content={ogImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg6inCEPL8XpfUXi3PRq91yZKLn42d_px4wLHWchVy0FzAjt-QvQeKC18sJX3xAYRAvRMURpP5oNOlyM7DhExkBu2_jqDixH2p4DCiXJNcnU5MaTvxKqnB-cs25KL_3WkJIw0qSOXJprxZlVWuJT_16xrcrDsRfcNbPYAJ6iepTnmUzej77EkntTnldsLwzrOVTVwbFij_qHOdxrUQUXUHUlM4aSuoa_HzGxm4G3EzXyMoVTfKxRc3CjY-CaxnhxGUysctLrk2Hwg'} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg6inCEPL8XpfUXi3PRq91yZKLn42d_px4wLHWchVy0FzAjt-QvQeKC18sJX3xAYRAvRMURpP5oNOlyM7DhExkBu2_jqDixH2p4DCiXJNcnU5MaTvxKqnB-cs25KL_3WkJIw0qSOXJprxZlVWuJT_16xrcrDsRfcNbPYAJ6iepTnmUzej77EkntTnldsLwzrOVTVwbFij_qHOdxrUQUXUHUlM4aSuoa_HzGxm4G3EzXyMoVTfKxRc3CjY-CaxnhxGUysctLrk2Hwg'} />
    </Helmet>
  );
};

export default SEO;
