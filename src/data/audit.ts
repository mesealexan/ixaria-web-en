import type { FAQ } from './types';

export const audit = {
  seo: {
    title: 'Furniture Ecommerce Audit | Ixaria',
    description:
      'Find the barriers in your furniture webshop and what to improve first, based on your customers, markets and business goals. Start with a free discovery call.',
  },
  hero: {
    label: 'Furniture ecommerce audit',
    heading: 'What keeps your visitors from becoming customers?',
    description:
      'Find the barriers in your buying journey and what to improve first, based on your customers, markets and business goals.',
    reassurance: 'Start with a free call to check whether the audit fits your business.',
  },
  price: '€1,500',
  heroPriceLabel: 'One-time fee',
  bookingLabel: 'Book a discovery call',
  logoCaption: 'Furniture companies we’ve worked with',
  qualification: {
    heading: 'Is this for your webshop?',
    description:
      'For brands and retailers selling sofas, chairs, tables, desks and other freestanding furniture.',
    criteria: [
      'Active webshop',
      'Existing online sales',
      'Paid advertising',
      '30,000+ monthly visitors',
    ],
  },
  shoppers: {
    heading: 'Start with how your customers buy.',
    paragraphs: [
      'Our research database combines studies of furniture buying across cultures with customer reviews worldwide. We connect this with your customer segment and sales insights to understand what buyers expect and what makes them hesitate.',
      'We assess up to three priority markets against your goals, such as more orders or higher order value.',
    ],
  },
  investigation: {
    heading: 'What we investigate',
    description:
      'We work with your team to understand the context behind the customer experience and the numbers.',
    areas: [
      {
        heading: 'Commercial fit',
        description:
          'Does your product information answer the questions that matter to your shoppers? We examine material explanations, product value and supporting evidence.',
        name: 'Alex',
        experience: 'Six years focused on furniture ecommerce.',
      },
      {
        heading: 'UX and usability',
        description:
          'We review navigation, information hierarchy and page usability to find where comparing and choosing products becomes difficult.',
        name: 'Eduard',
        experience: 'UX and product designer. Experience with Porsche, BMW and Bayer.',
      },
      {
        heading: 'Technical performance',
        description:
          'We examine loading speed, technical issues and your webshop setup for problems that interrupt the buying journey.',
        name: 'Victor',
        experience: 'Enterprise developer with experience including Deutsche Bank.',
      },
      {
        heading: 'Marketing data',
        description:
          'We connect traffic sources and advertising messages with landing pages and funnel data to understand where shoppers drop off.',
        name: 'Ovidiu',
        experience: 'Marketer specialising in furniture webshops.',
      },
    ],
  },
  report: {
    heading: 'Know what to improve next.',
    items: [
      {
        heading: 'Shopper and market insights',
        description: 'What your target customers expect, worry about and need to make a decision.',
      },
      {
        heading: 'Findings and recommendations',
        description:
          'The issues we identify, the evidence behind them and practical improvements to prioritise.',
      },
      {
        heading: 'A recommended next step',
        description:
          'Where improving product-page content for your shoppers is a priority, we may propose an Ixaria pilot and explain what it should test.',
      },
    ],
    presentation: 'We present the report live and discuss the findings with your team.',
    exampleHeading: 'See what an audit looks like',
    exampleDescription: 'Explore an example before you decide.',
    downloadLabel: 'Download example audit (PDF)',
    missingLabel: 'Example audit coming soon',
  },
  process: {
    heading: 'How the audit works',
    steps: [
      {
        heading: 'Check the fit',
        description:
          'A free call to discuss your webshop, goals and whether the audit is right for you.',
      },
      {
        heading: 'Share the context',
        description:
          'Three calls with sales, marketing and your technical contact. We send preparation questions and request relevant reports in advance. The sales call takes 30–45 minutes.',
      },
      {
        heading: 'Complete the analysis',
        description:
          'Your report is delivered within seven calendar days after all specialist calls are complete and all requested data has been received.',
      },
      {
        heading: 'Review the findings',
        description:
          'We present the report, answer your questions and discuss the recommended next steps.',
      },
    ],
    reassurance:
      'You provide reports and data exports. We don’t need access to your analytics or advertising accounts.',
  },
  offer: {
    heading: 'Your audit',
    priceLabel: 'One-time fee.',
    inclusions:
      'Includes four specialist assessments, up to three markets, your report and a live presentation.',
    reassurance: 'We confirm fit before you pay.',
    guaranteeHeading: '14-day money-back guarantee',
    guaranteeDescription:
      'If you don’t find the audit valuable, tell us within 14 days of the presentation and we’ll refund the full fee.',
  },
  faqHeading: 'Frequently asked questions',
  questions: [
    {
      question: 'Do you review every product?',
      answer:
        'We assess the structure and information shared across your product pages, using representative products to examine how well they support buying decisions.',
    },
    {
      question: 'What if our tracking or data is incomplete?',
      answer:
        'We establish what information is available before starting and explain where missing data limits the conclusions.',
    },
    {
      question: 'What access do you need?',
      answer:
        'Your team provides the requested reports and exports. Access to analytics or advertising accounts is not required.',
    },
    {
      question: 'Can our existing agency be involved?',
      answer:
        'Yes. Your agency can provide context and use the findings. We focus on the buying experience and the evidence behind our recommendations.',
    },
    {
      question: 'Do we have to start an Ixaria pilot afterwards?',
      answer:
        'No. We recommend a pilot where the findings justify it. You can also act on the recommendations with your own team or agency.',
    },
    {
      question: 'Does the audit guarantee more sales?',
      answer:
        'The audit helps you decide what to improve and test. Sales impact depends on the changes you implement and how your customers respond.',
    },
  ],
  final: {
    heading: 'Is the audit right for your business?',
    description:
      'Tell us about your webshop and what you want to improve. We’ll check whether the audit is a useful next step.',
  },
} as const;

export const auditFAQs: FAQ[] = audit.questions.map((item, index) => ({
  id: `faq-audit-${index + 1}`,
  question: item.question,
  answer: [item.answer],
}));
