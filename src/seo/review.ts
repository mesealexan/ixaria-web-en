import { review } from '../data/review';
import { site } from '../data/site';
import type { PageSEO, StructuredData } from './types';
import { pageDates } from './metadata';

export const reviewSEO: PageSEO = {
  path: '/review.html',
  title: review.seo.title,
  description: review.seo.description,
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: review.seo.title,
    description: review.seo.description,
    image: `${site.url}/webpreview.webp`,
    imageAlt: 'Ixaria',
    locale: site.locale,
  },
  lastModified: pageDates.review,
};

export function reviewStructuredData(): StructuredData {
  const url = new URL(reviewSEO.path, site.url).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      site.company,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: reviewSEO.title,
        description: reviewSEO.description,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': `${url}#service` },
        dateModified: reviewSEO.lastModified,
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: review.hero.label,
        description: review.hero.description,
        url,
        provider: { '@id': site.company['@id'] },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Review', item: url },
        ],
      },
    ],
  };
}
