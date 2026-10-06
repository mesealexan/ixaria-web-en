import { audit } from '../data/audit';
import { site } from '../data/site';
import type { PageSEO, StructuredData } from './types';
import { pageDates } from './metadata';

export const auditSEO: PageSEO = {
  path: '/audit.html',
  title: audit.seo.title,
  description: audit.seo.description,
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: audit.seo.title,
    description: audit.seo.description,
    image: `${site.url}/preview.webp`,
    imageAlt: 'Ixaria',
    locale: site.locale,
  },
  lastModified: pageDates.audit,
};

export function auditStructuredData(): StructuredData {
  const url = new URL(auditSEO.path, site.url).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      site.company,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: auditSEO.title,
        description: auditSEO.description,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': `${url}#service` },
        dateModified: auditSEO.lastModified,
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: audit.hero.label,
        description: audit.hero.description,
        url,
        provider: { '@id': site.company['@id'] },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Audit', item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: audit.questions.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };
}
