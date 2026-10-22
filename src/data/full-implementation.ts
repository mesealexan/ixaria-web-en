import { site } from './site';

export const fullImplementation = {
  bookingUrl: site.bookingUrl,
  bookingLabel: 'Book a Discovery call',
  price: '€1,500 / month',
  revenueShare: '+ 2% of every sales attributed to Ixaria',
  hero: {
    heading: 'Bring the proven approach to',
    highlight: 'every product.',
    description: 'We expand the signals, correlation, and responses validated during the pilot across your full product catalog.',
    image: 'Several furniture product pages showing relevant information for different shopper needs.',
  },
  implement: {
    heading: 'One approach. Adapted to each product.',
    description: 'We apply what worked in the pilot, adapting signals and responses to each product’s features and customer questions.',
    points: [
      { heading: 'Signals', text: 'Identify what shoppers need to know.' },
      { heading: 'Correlation', text: 'Connect their interactions with visitor context.' },
      { heading: 'Responses', text: 'Surface relevant information on listing and product pages.' },
    ],
    image: 'Two products addressing different concerns: sofa comfort and dining-table dimensions.',
  },
  rollout: {
    heading: 'A structured rollout across your catalog.',
    description: 'We agree on product priorities, technical requirements, and a rollout schedule based on the audit and pilot findings.',
    steps: [
      { heading: 'Prioritize', text: 'Agree on product groups and rollout order.' },
      { heading: 'Adapt', text: 'Prepare signals and responses for each product.' },
      { heading: 'Launch', text: 'Extend the experience across your full catalog.' },
    ],
  },
  measurement: {
    heading: 'Keep measuring as we expand.',
    description: 'We track performance against the agreed success metric to understand how the approach performs across products and categories.',
    image: 'Performance overview by product and category — no invented figures.',
  },
  final: {
    heading: 'Plan your full implementation.',
    description: 'Together, we define the scope and rollout timeline for extending the experience to all your products.',
  },
};
