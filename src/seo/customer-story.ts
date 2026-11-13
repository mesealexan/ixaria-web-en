import { agacheStory } from '../data/customer-stories/agache';
import { site } from '../data/site';
import type { StructuredData } from './types';

export function storyStructuredData(): StructuredData {
  const seo = agacheStory.seo;
  const url = new URL(seo.path, site.url).href;
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
        primaryImageOfPage: { '@type': 'ImageObject', url: seo.openGraph.image },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Agache customer story', item: url },
        ],
      },
    ],
  };
}
