import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object;
}

/**
 * SEO Head Component
 * Updates document meta tags for page-specific SEO optimization
 */
export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
  ogType = 'website',
  structuredData
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Let It Ride Electric Bikes`;
    
    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Primary meta tags
    updateMeta('description', description);
    if (keywords) {
      updateMeta('keywords', keywords);
    }

    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:type', ogType, true);
    if (canonicalUrl) {
      updateMeta('og:url', canonicalUrl, true);
    }

    // Twitter tags
    updateMeta('twitter:title', title, true);
    updateMeta('twitter:description', description, true);
    updateMeta('twitter:image', ogImage, true);

    // Update canonical link
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('script[data-page-structured-data]');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-structured-data', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      const pageScript = document.querySelector('script[data-page-structured-data]');
      if (pageScript) {
        pageScript.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, structuredData]);

  return null;
}

// Pre-defined SEO configurations for each page
export const PAGE_SEO = {
  tours: {
    title: 'E-Bike Tours in Bend Oregon',
    description: 'Guided electric bike tours along the Deschutes River, downtown Bend, and local breweries. From $75/person. Book your adventure today!',
    keywords: 'e-bike tours Bend, guided bike tours Oregon, Deschutes River tour, Bend brewery tour, electric bike adventure',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": "Let It Ride E-Bike Tours",
      "description": "Guided electric bike tours exploring Bend, Oregon's scenic trails and attractions",
      "touristType": ["Adventure Tourism", "Eco Tourism"],
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "75",
        "highPrice": "150",
        "priceCurrency": "USD"
      }
    }
  },
  shop: {
    title: 'Buy Pedego Electric Bikes in Bend Oregon',
    description: 'Shop premium Pedego e-bikes: Cruisers, Tandems, Cargo & Mountain bikes. Expert advice, test rides, and local service. Visit our Bend showroom!',
    keywords: 'Pedego electric bikes, buy e-bike Bend Oregon, electric bike shop, Pedego dealer Central Oregon',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "Let It Ride Electric Bikes Shop",
      "description": "Authorized Pedego electric bike dealer in Bend, Oregon",
      "priceRange": "$$$$",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Pedego Electric Bikes",
        "itemListElement": [
          { "@type": "Product", "name": "Pedego Interceptor", "category": "Cruiser E-Bikes" },
          { "@type": "Product", "name": "Pedego Tandem", "category": "Tandem E-Bikes" },
          { "@type": "Product", "name": "Pedego Stretch", "category": "Cargo E-Bikes" }
        ]
      }
    }
  },
  rentals: {
    title: 'E-Bike Rentals in Bend Oregon',
    description: 'Rent premium Pedego electric bikes by the hour or day. Easy booking, helmets included, downtown Bend pickup. Starting at $25/hour.',
    keywords: 'e-bike rental Bend, electric bike hire Oregon, Pedego rental, bike rental downtown Bend',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "E-Bike Rental Service",
      "description": "Hourly and daily electric bike rentals in Bend, Oregon",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "25",
        "highPrice": "75",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  },
  blog: {
    title: 'E-Bike Blog - Tips, Trails & Bend Oregon Adventures',
    description: 'Discover the best e-bike trails, local tips, and adventure guides for Bend, Oregon. Expert insights from Let It Ride Electric Bikes.',
    keywords: 'e-bike blog, Bend Oregon trails, electric bike tips, Central Oregon cycling, Deschutes River biking',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Let It Ride E-Bike Blog",
      "description": "Tips, trails, and adventure guides for e-biking in Bend, Oregon",
      "publisher": {
        "@type": "Organization",
        "name": "Let It Ride Electric Bikes"
      }
    }
  },
  about: {
    title: 'About Let It Ride Electric Bikes - Bend Oregon',
    description: 'Family-owned e-bike tour company in downtown Bend since 2010. 189+ 5-star reviews. Meet our team and learn our story.',
    keywords: 'about Let It Ride, Bend e-bike company, electric bike tours history, Bend Oregon business',
  },
  contact: {
    title: 'Contact Let It Ride Electric Bikes - Bend Oregon',
    description: 'Contact us at (541) 647-2331 or visit 25 NW Minnesota Ave #6, Bend, OR. Book tours, ask questions, or schedule a test ride.',
    keywords: 'contact Let It Ride, Bend e-bike phone, electric bike shop address, book e-bike tour',
  }
};
