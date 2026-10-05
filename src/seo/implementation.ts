import { implementationPath } from '../data/implementation';
import type { ImplementationStage } from '../data/implementation';
import { site } from '../data/site';
import type { PageSEO, StructuredData } from './types';

export function implementationSEO(stage: ImplementationStage): PageSEO {
  const title = `${stage.title} — How Ixaria Works`;
  const description = stage.summary;
  return {
    path: implementationPath(stage),
    title,
    description,
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      title,
      description,
      image: `${site.url}/preview.webp`,
      imageAlt: 'Ixaria product page experience',
      locale: site.locale,
    },
    lastModified: '2026-10-05',
  };
}

export function implementationStructuredData(stage: ImplementationStage): StructuredData {
  const url = new URL(implementationPath(stage), site.url).href;
  const seo = implementationSEO(stage);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      site.company,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: stage.title,
        description: seo.description,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': site.company['@id'] },
        dateModified: '2026-10-05',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: stage.title, item: url },
        ],
      },
    ],
  };
}
