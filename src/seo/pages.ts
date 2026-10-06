import type { PageSEO } from './types';
import { implementationStages } from '../data/implementation';
import { implementationSEO } from './implementation';
import { auditSEO } from './audit';
import { homeMetadata, careerMetadata, pageDates } from './metadata';

export const pageSEO = {
  audit: auditSEO,
  pilot: implementationSEO(implementationStages[1]!),
  'full-implementation': implementationSEO(implementationStages[2]!),
  home: {
    path: '/',
    title: homeMetadata.title,
    description: homeMetadata.description,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    openGraph: {
      type: 'website',
      title: homeMetadata.title,
      description: homeMetadata.description,
      image: 'https://ixaria.eu/preview.webp',
      imageAlt: 'Ixaria — furniture product pages shaped by real customer behavior',
      imageWidth: '1200',
      imageHeight: '630',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: homeMetadata.title,
      description: homeMetadata.description,
      image: 'https://ixaria.eu/preview.webp',
      imageAlt: 'Ixaria — furniture product pages shaped by real customer behavior',
    },
    alternates: [
      {
        language: 'en',
        href: 'https://ixaria.eu/',
      },
      {
        language: 'x-default',
        href: 'https://ixaria.eu/',
      },
    ],
    lastModified: pageDates.home,
  },
  cofounder: {
    lastModified: pageDates.cofounder,
    path: '/cofounder.html',
    title: careerMetadata.title,
    description: careerMetadata.description,
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      title: careerMetadata.title,
      description: careerMetadata.description,
      image: 'https://ixaria.eu/005.webp',
      locale: 'en_US',
    },
    alternates: [],
  },
  'privacy-policy': {
    path: '/privacy-policy.html',
    title: 'Privacy Policy — Ixaria',
    description:
      "Read Ixaria's Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR.",
    robots: 'noindex, follow',
    openGraph: {
      type: 'website',
      title: 'Privacy Policy — Ixaria',
      description:
        "Read Ixaria's Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR.",
    },
    alternates: [],
  },
  terms: {
    path: '/terms.html',
    title: 'Terms of Service — Ixaria',
    description:
      "Read Ixaria's Terms of Service. Understand the rules and conditions for using our website and product page optimization services.",
    robots: 'noindex, follow',
    openGraph: {
      type: 'website',
      title: 'Terms of Service — Ixaria',
      description:
        "Read Ixaria's Terms of Service for using our website and product page optimization platform for furniture manufacturers.",
    },
    alternates: [],
  },
  'cookie-policy': {
    path: '/cookie-policy.html',
    title: 'Cookie Policy — Ixaria',
    description:
      "Read Ixaria's Cookie Policy. Learn which cookies we use, why we use them, and how you can manage your preferences.",
    robots: 'noindex, follow',
    openGraph: {
      type: 'website',
      title: 'Cookie Policy — Ixaria',
      description:
        'Learn which cookies Ixaria uses, why, and how to manage your cookie preferences.',
    },
    alternates: [],
  },
} satisfies Record<string, PageSEO>;
