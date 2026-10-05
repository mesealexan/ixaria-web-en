import entities from './home-entities.json';
import { site } from '../data/site';
import { steps } from '../data/home';
import { faqs } from '../data/faqs';
import type { StructuredData } from './types';

export function homeStructuredData(): StructuredData {
  return {
    '@context': entities['@context'],
    '@graph': [
      site.company,
      ...entities['@graph'].map((entity) =>
        entity['@type'] === 'HowTo'
          ? {
              ...entity,
              step: steps.map((step, index) => ({
                '@type': 'HowToStep',
                position: index + 1,
                name: step.title,
                text: step.body,
              })),
            }
          : entity,
      ),
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer.join(' ') },
        })),
      },
    ],
  };
}

// Escape characters that could end the JSON-LD script or change its HTML parsing.
export function serializeStructuredData(data: StructuredData): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
