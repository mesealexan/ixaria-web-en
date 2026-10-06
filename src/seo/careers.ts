import { site } from '../data/site';
import { pageSEO } from './pages';
import type { StructuredData } from './types';

export function careerStructuredData(): StructuredData {
  const seo = pageSEO.cofounder;
  const url = new URL(seo.path, site.url).href;
  // JobPosting requires confirmed recruitment dates and location/remote details.
  // Describe this page accurately without supplying unconfirmed job attributes.
  return {
    '@context': 'https://schema.org',
    '@graph': [
      site.company,
      {
        '@type': 'WebPage', '@id': `${url}#webpage`, url,
        name: seo.title, description: seo.description,
        dateModified: seo.lastModified,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': site.company['@id'] },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Careers', item: url },
        ],
      },
    ],
  };
}
