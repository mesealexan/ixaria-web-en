import { site } from '../site';
import type { PageSEO } from '../../seo/types';

export interface StoryImage {
  number: string;
  ratio: string;
  description: string;
  // Set these together when approved photography or screenshots are available.
  src?: string;
  alt?: string;
  width: number;
  height: number;
  comparisons?: { label: string; description: string }[];
}

const comparisonPeriods = {
  before: 'First eight-week period',
  after: 'Second eight-week period',
  weeksEach: 8,
  sessionsEach: 20000,
  purchasesBefore: 100,
  purchasesAfter: 160,
  averageOrderValueRON: 4000,
};
const formatNumber = (value: number) => value.toLocaleString('en-GB');

// Working content only. Keep example results and proposed activities labelled
// until Agache has approved the evidence, implementation details and imagery.
export const agacheStory = {
  seo: {
    path: '/customer-stories/agache.html',
    title: 'Agache Customer Story (Working Draft) | Ixaria',
    description: 'A working draft exploring how clearer, more relevant product information could help Agache shoppers feel ready to buy online.',
    robots: 'noindex, nofollow, noarchive',
  } satisfies PageSEO,
  draftNotice: 'Working draft. Example figures and implementation details await verification.',
  hero: {
    eyebrow: 'Customer story / Agache',
    heading: 'Helping Agache’s customers feel ready to buy online',
    introduction: 'Choosing a sofa means deciding more than its shape and colour. Agache and Ixaria worked on making the information behind that decision clearer, easier to find and more relevant to each shopper.',
  },
  images: {
    hero: {
      number: '01', ratio: '16 / 10', width: 1600, height: 1000,
      description: 'An Agache sofa in a real home, paired with a legible view of its product page on mobile. The product should be the main focus.',
    } satisfies StoryImage,
    beforeAfter: {
      number: '02', ratio: '16 / 9 per image', width: 1600, height: 900,
      description: 'The same Agache product on the same device size. Use matching crops.',
      comparisons: [
        { label: 'Before', description: 'Important buying information is difficult to locate.' },
        { label: 'After', description: 'Dimensions, fabric guidance and delivery information are easier to find.' },
      ],
    } satisfies StoryImage,
    adaptations: {
      number: '03', ratio: '16 / 9 per image', width: 1600, height: 900,
      description: 'Two versions of the same Agache product page. Highlight only the information that changes.',
      comparisons: [
        { label: 'Fabric-care reassurance', description: 'The page brings practical fabric-care information into focus.' },
        { label: 'Size guidance', description: 'The same page brings dimensions and access information into focus.' },
      ],
    } satisfies StoryImage,
  },
  resultsLabel: 'Illustrative results',
  metrics: [
    { label: 'Purchase conversion', change: '+60%', before: '0.50%', after: '0.80%' },
    { label: 'Online revenue', change: '+60%', before: 'RON 400,000', after: 'RON 640,000' },
    { label: 'Pre-purchase enquiries per 100 orders', change: '−30%', before: '40', after: '28' },
  ],
  context: {
    eyebrow: 'Agache at a glance',
    facts: [
      { label: 'Company', value: 'Romanian upholstered furniture manufacturer' },
      { label: 'Products', value: 'Sofas, corner sofas and upholstered beds' },
      { label: 'Focus', value: 'Direct online purchases' },
      { label: 'Scope', value: 'Selected product pages' },
    ],
    heading: 'A product customers liked. A decision they still needed help making.',
    paragraphs: [
      'Agache wanted more customers to complete their purchase online and fewer to depend on a call for information they should be able to find on the website.',
      'The work focused on understanding where shoppers hesitated, improving the product information and making the next step easier.',
      'For a furniture purchase, the product page has to help someone picture everyday life with the product. A shopper may like the design but still need to check access, compare fabrics or understand what happens after ordering. Those practical questions shape the decision alongside appearance and price.',
    ],
  },
  hesitation: {
    eyebrow: 'Understanding the hesitation',
    heading: 'What did shoppers need to know before buying?',
    questions: [
      'Will it fit my room and get through the door?',
      'Which fabric makes sense for my home?',
      'What happens with delivery, assembly and returns?',
    ],
    description: 'These questions guided the research and the information we prioritised. The aim was to understand which concerns mattered, where they appeared and what would help customers decide.',
    detail: 'Each question points to a different information gap. Clear measurements can support a size decision. Fabric guidance can help someone compare options for daily use. Delivery information can make the steps after purchase easier to understand. The research needs to establish which of these concerns actually matters to Agache’s shoppers.',
    researchNote: 'Evidence to add: research methods, participant count, dates and confirmed findings.',
  },
  approach: {
    eyebrow: 'From customer concern to useful information',
    heading: 'The same sofa. Different questions to answer.',
    description: 'Ixaria’s approach connects what a visitor explores with information that may help them decide. A fabric question calls for different reassurance from a question about size.',
    note: 'Proposed adaptation examples. Confirm against the live implementation.',
    columns: ['Shopper interaction', 'Possible interpretation', 'Relevant page response'],
    examples: [
      { interaction: 'Fabric-care interaction', interpretation: 'Practical upkeep may matter', response: 'Cleaning guidance and verified fabric properties near the selection controls' },
      { interaction: 'Dimensions interaction', interpretation: 'Size or access may be uncertain', response: 'Room dimensions, packaged measurements and access guidance' },
      { interaction: 'Delivery interaction', interpretation: 'Fulfilment may be holding up the decision', response: 'Delivery, assembly and returns information near the buying controls' },
    ],
    explanation: 'Signals reveal interests. Correlations connect those clues with the visitor’s context. Responses bring relevant information into the page.',
    detail: 'These are proposed ways to make existing information more useful. Any response should rely on confirmed product details and agreed service information. An interaction is a clue about a possible concern; it still needs to be interpreted carefully and checked against what helps shoppers decide.',
  },
  implementation: {
    eyebrow: 'Implementation and learning',
    heading: 'Research, implementation, then refinement.',
    stages: [
      { heading: 'Understand', description: 'Review customer questions, product information and the purchase journey.' },
      { heading: 'Implement', description: 'Improve copy, images and information order; introduce the selected interactions and responses.' },
      { heading: 'Refine', description: 'Observe customer behaviour, test changes and review purchase outcomes.' },
    ],
    detailsLabel: 'Implementation details to confirm',
    details: [
      { label: 'Products covered', value: 'To confirm' },
      { label: 'Launch dates', value: 'To confirm' },
      { label: 'Test rounds', value: 'To confirm' },
      { label: 'Agache’s team involvement', value: 'To confirm' },
    ],
  },
  measurement: {
    eyebrow: 'Results in context',
    heading: 'Measure what changed in the buying journey.',
    columns: ['Metric', 'Before', 'After', 'Change'],
    periods: comparisonPeriods,
    comparison: `Illustrative comparison: two ${comparisonPeriods.weeksEach === 8 ? 'eight' : comparisonPeriods.weeksEach}-week periods, each with ${formatNumber(comparisonPeriods.sessionsEach)} sessions. Purchase conversion: ${comparisonPeriods.purchasesBefore}/${formatNumber(comparisonPeriods.sessionsEach)} versus ${comparisonPeriods.purchasesAfter}/${formatNumber(comparisonPeriods.sessionsEach)}. Revenue assumes RON ${formatNumber(comparisonPeriods.averageOrderValueRON)} average order value. Replace with verified data.`,
    caveat: 'Before/after comparisons show observed changes. Traffic mix, advertising, promotions and availability should be considered when interpreting results.',
    voiceLabel: 'Client voice / awaiting approval',
    voicePlaceholder: '[Add an approved Agache quote describing a specific observed change. Include the speaker’s name and role.]',
  },
  closing: {
    heading: 'What do your customers need before they feel ready to buy?',
    description: 'Start by identifying the unanswered questions in your buying journey and where more relevant information could help.',
    primary: { label: 'Book a discovery call', href: site.bookingUrl },
    secondary: { label: 'Explore the Audit', href: site.websiteLinks.find(link => link.label === 'Audit')!.href },
  },
};
