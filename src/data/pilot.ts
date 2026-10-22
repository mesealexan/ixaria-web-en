import { site } from './site';

export const pilot = {
  bookingUrl: site.bookingUrl,
  bookingLabel: 'Book a Discovery Call',
  monthlyPrice: '€1,500/month',
  terms: 'Three months · €4,500 total',
  hero: {
    heading: 'Use a smarter shopping experience',
    highlight: 'on your bestsellers.',
    description: 'We use your audit findings to implement signals, correlation, and responses on three to five selected products over three months.',
    image: 'A furniture product page showing a shopper interaction and the relevant information it surfaces.',
  },
  implement: {
    heading: 'Three to five products. Three months of testing.',
    description: 'Together, we select bestsellers, preferably higher-value products, and put the audit recommendations into practice.',
    points: [
      { heading: 'Signals', text: 'Identify what shoppers need through their interactions.' },
      { heading: 'Correlation', text: 'Connect those interactions with visitor context.' },
      { heading: 'Responses', text: 'Show relevant information on the selected product pages.' },
    ],
    image: 'One example connecting a shopper’s interaction to a relevant page response.',
  },
  why: {
    heading: 'Establish what works before expanding.',
    description: 'A focused pilot lets us evaluate the approach on selected products before deciding on full implementation.',
    steps: [
      'Select three to five products.',
      'Run the experience for three months.',
      'Review results against the agreed success metric.',
    ],
  },
  measurement: {
    heading: 'Measured against the goal we agreed.',
    description: 'At the end of three months, we analyze performance against the success metric established during discovery.',
    labels: ['Agreed success metric', 'Sales before Ixaria', 'Sales after Ixaria'],
    image: 'Example results comparison — no invented figures.',
    note: 'The results guide the decision to expand.',
  },
  final: {
    heading: 'Start your three-month pilot.',
    description: 'With your audit completed, we can select the products and plan the pilot.',
    price: '€1,500/month · €4,500 total',
    next: 'If the results demonstrate meaningful progress against the agreed success metric, we move toward full implementation.',
    nextLabel: 'Next: explore full implementation →',
    nextUrl: '/full-implementation.html',
  },
};
