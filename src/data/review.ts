import { site } from './site';

export const review = {
  seo: {
    title: 'Furniture Conversion Review | IXARIA',
    description: 'Connect your business goals, marketing, technology, and customer knowledge in a practical plan for improving furniture website conversion.',
  },
  bookingUrl: site.bookingUrl,
  bookingLabel: 'Book a discovery call',
  hero: {
    label: 'FURNITURE CONVERSION REVIEW',
    heading: 'Find out why your visitors',
    highlight: "don't buy?",
    description: 'We connect your business goals, marketing, technology, and customer knowledge to create a practical plan for improving your website conversion.',
  },
  receive: {
    heading: 'What you get from the Review',
    description: 'Find out what each customer needs, what information to show, and how to measure success. The review includes:',
    items: [
      'An agreed success metric',
      'Priority customer questions and information gaps',
      'Recommended signals and responses',
      'Technical requirements and implementation priorities',
    ],
    image: 'Example review report.',
  },
  process: {
    heading: 'One review built on your team\'s knowledge.',
    description: 'A 45 minutes call with: leadership, marketing, IT, and sales.',
    steps: [
      { callLabel: '1st call', heading: 'Leadership', text: 'Business goals, timing, and success metric.' },
      { callLabel: '2nd call', heading: 'Marketing', text: 'Traffic sources, campaigns, and visitor expectations.' },
      { callLabel: '3rd call', heading: 'Technology', text: 'Webshop, CRM, configurators, other tools.' },
      { callLabel: '4th call', heading: 'Sales', text: 'Customer questions, needs, and fears.' },
    ],
    note: 'Review delivered seven days after the final call.',
  },
  approach: {
    heading: 'The right information, at the right moment.',
    description: 'The review lays the groundwork for a website that responds to each shopper.',
    steps: [
      { heading: 'Signals', text: 'Learn what your visitors need, fear, and desire.' },
      { heading: 'Correlations', text: 'Connect interactions with visitor context.' },
      { heading: 'Responses', text: 'Show the information that helps them decide.' },
    ],
    image: 'Shopper explores fabric care → relevant cleaning information appears.',
    note: 'The review defines the plan. Implementation follows in the pilot.',
  },
  team: {
    heading: 'Meet your review team.',
    description: 'Business direction, furniture e-commerce marketing, and user experience.',
    people: [
      {
        name: 'Alex Mesesan', assetKey: 'Alex', role: 'Senior Sales & Technology',
        text: 'Furniture E-commerce & Product Experience | Product page analysis, shopper behaviour and cultural differences | 10+ years building product configurators | 6 years focused on online furniture sales',
        linkedinUrl: 'https://www.linkedin.com/in/alexandru-mesesan/',
      },
      {
        name: 'Ovidiu Stegari', assetKey: 'Ovidiu', role: 'Senior Marketing',
        text: 'Growth Marketing for furniture e-commerce | Marketing reviews, data analysis, conversion rate optimization | €769K extra revenue | 38% lower CAC | 6,444 customers converted | 65,000+ leads generated',
        linkedinUrl: 'https://www.linkedin.com/in/ovidiu-stegari-b16100100/',
      },
      {
        name: 'Eduard Badea', assetKey: 'Eduard', role: 'Senior Product & UX/UI',
        text: 'UX reviews, customer journeys, usability and interface design | UX designer for Mercedes and Bayer | 5+ years combining design and psychology to make digital products easier to understand and use',
        linkedinUrl: 'https://www.linkedin.com/in/eduard-badea/',
      },
    ],
  },
  newsletter: {
    heading: 'Not ready for a review yet?',
    description: 'Get practical ideas for helping furniture shoppers buy with confidence.',
    buttonLabel: 'Join the newsletter',
  },
  final: {
    heading: 'Start with your business goals.',
    description: 'Discuss your goals, timeline, and how we would measure success.',
    pilotLabel: 'Next: explore the pilot →',
    pilotUrl: '/pilot.html',
  },
  // Shared homepage client strip; not displayed on the review page.
  companies: {
    heading: 'Companies we’ve worked with',
    text: 'Experience built through working with furniture businesses and their online buying journeys.',
  },
};
