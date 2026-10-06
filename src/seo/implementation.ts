import { implementationPath } from '../data/implementation';
import type { ImplementationStage } from '../data/implementation';
import { site } from '../data/site';
import type { PageSEO, StructuredData } from './types';
import { implementationMetadata, pageDates } from './metadata';

export function implementationSEO(stage: ImplementationStage): PageSEO {
  const metadata = stage.slug === 'audit' ? null : implementationMetadata[stage.slug];
  const title = metadata?.title ?? `${stage.title} — How Ixaria Works`;
  const description = metadata?.description ?? stage.summary;
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
    lastModified: pageDates[stage.slug],
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
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': `${url}#service` },
        dateModified: seo.lastModified,
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: stage.slug === 'pilot' ? 'Furniture product page optimisation pilot' : 'Furniture ecommerce product page implementation',
        description: stage.introduction,
        url,
        provider: { '@id': site.company['@id'] },
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
