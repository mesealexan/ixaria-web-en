import type { PageSEO } from '../../seo/types';
import { pageDates } from '../../seo/metadata';

export interface StoryImage {
  src: string; alt: string; width: number; height: number; label: string; caption: string;
}
const asset = (file: string) => `/customer-stories/agache/${file}.webp`;

// Monthly EUR totals are approved for this story. Keep source exports and
// customer-level records outside the repository.
export const agacheStory = {
  seo: {
    path: '/customer-stories/agache.html',
    title: 'Agache: 256% Revenue Growth | Ixaria Customer Story',
    description: 'How Agache made custom furniture easier to choose online, with clearer product pages, material guidance and behavioural adaptation. Revenue grew 256% following the March 2026 launch.',
    robots: 'index, follow, max-image-preview:large',
    lastModified: pageDates.agache,
    openGraph: { type: 'article', title: 'Agache: 256% Revenue Growth | Ixaria', description: 'A clearer path from sofa browsing to buying. Explore the before-and-after experience.', image: 'https://ixaria.eu/customer-stories/agache/leni-after.webp', imageAlt: 'Agache’s current Leni sofa product page' },
  } satisfies PageSEO,
  hero: {
    eyebrow: 'Customer story / Furniture ecommerce',
    heading: 'Agache’s sales revenue grew', result: '256%', ending: 'following Ixaria’s launch.',
    introduction: 'Agache partnered with Ixaria to make custom furniture easier to choose online, bringing product choices, practical guidance and relevant reassurance into the buying experience.',
  },
  metrics: [
    { value: '+256%', label: 'sales revenue growth', detail: 'April–October 2026 vs 2025' },
    { value: '7 / 7', label: 'months with higher sales', detail: 'Each compared with the same month in 2025' },
  ],
  facts: [
    { label: 'Customer', value: 'Agache, Romania' },
    { label: 'Products', value: 'Custom upholstered furniture' },
    { label: 'Work', value: 'Buying experience & adaptation' },
    { label: 'Launch', value: 'March 2026' },
  ],
  challenge: {
    heading: 'Plenty of options. Too much work to understand them.',
    paragraphs: [
      'Agache is a Romanian family business making upholstered furniture since 1994. Its customers can choose from sofas, corner sofas and beds, with a wide range of fabrics and configurations.',
      'The website already had reviews, specifications and a configurator. But material categories appeared as separate product listings, key details sat inside accordions, and shoppers had to move between sections to understand their choices.',
      'The task was to make that information easier to use, then adapt the page to what each visitor needed before deciding.',
    ],
  },
  comparisons: [
    {
      id: 'product', number: '01', heading: 'One product, clearer choices.',
      description: 'Instead of sending shoppers between separate material variants, the new Leni page brings material categories and colours into one selection experience. A short product explanation sits alongside the choices.',
      before: { src: asset('leni-before'), alt: 'Previous Leni Material Practic page with colour swatches and product information inside accordions', width: 1600, height: 1107, label: 'Before · November 2025', caption: 'A material-specific product page, with important details inside accordions.' },
      after: { src: asset('leni-after'), alt: 'Current Leni page with integrated material categories, colour swatches and a short product description', width: 1348, height: 926, label: 'After · November 2026', caption: 'Material categories, colour choices and practical guidance together.' },
    },
    {
      id: 'materials', number: '02', heading: 'Explain materials while shoppers choose.',
      description: 'The old page explained fabric categories further down the page and linked to other variants. Today, shoppers can open material guidance directly from the selection controls, keeping the explanation connected to the choice.',
      before: { src: asset('materials-before'), alt: 'Previous material category comparison below the Leni buying area, linking to separate variants', width: 1490, height: 1400, label: 'Before · Material variants', caption: 'Material descriptions and separate product links further down the page.' },
      after: { src: asset('materials-after'), alt: 'Current in-page material information panel with fabric imagery and characteristics', width: 785, height: 490, label: 'After · In-page guidance', caption: 'Material characteristics open within the current product experience.' },
    },
    {
      id: 'configuration', number: '03', heading: 'Give customization a clearer sequence.',
      description: 'The earlier configurator led with a long swatch panel. The current controls separate material, colour and summary, show fabric collections and price differences, and keep the purchase action visible.',
      before: { src: asset('configurator-before'), alt: 'Previous Leni configurator sidebar dominated by a long grid of fabric swatches', width: 525, height: 1275, label: 'Before · Selection controls', caption: 'A long swatch grid led the configuration experience.' },
      after: { src: asset('configurator-after'), alt: 'Current Leni configurator selection controls with stages, fabric categories, collections and a purchase action', width: 450, height: 920, label: 'After · Selection controls', caption: 'Stages, fabric collections and price differences organise the choices.' },
    },
  ],
  reassurance: {
    heading: 'Useful answers near the decision.',
    description: 'Sleeping dimensions, delivery information, payment options and transport and returns details are presented close to the purchase controls. Shoppers can check practical questions while considering the product.',
  },
  adaptation: {
    heading: 'Different shoppers need different reassurance.',
    description: 'Agache introduced Ixaria’s Signals, Correlations and Responses in March 2026. Interactions provide clues; context helps interpret them; relevant information becomes the response.',
    note: 'Illustrative journey. Replace with a confirmed Agache trigger and response before publishing.',
    steps: [
      {
        name: 'Signals', heading: 'Notice the interaction', description: 'A high intent visitor interacts with the Signals that helps us understand their needs',
        image: { src: asset('signals'), srcset: `${asset('signals-480')} 480w, ${asset('signals-800')} 800w, ${asset('signals')} 1052w`, width: 1052, height: 786, alt: 'Agache mobile sofa listings with shopper prompts about showroom priorities and long-term comfort, with Comfort and Support selected' },
      },
      {
        name: 'Correlations', heading: 'Connect the clues', description: 'Combined with browsing context, this may suggest that everyday upkeep matters.',
        image: { src: asset('correlations'), srcset: `${asset('correlations-480')} 480w, ${asset('correlations-800')} 800w, ${asset('correlations')} 1435w`, width: 1435, height: 1096, alt: 'Ixaria connects a returning visit, reading delivery terms and a question about damage to a possible need for delivery reassurance' },
      },
      {
        name: 'Responses', heading: 'Show useful information', description: 'Bring relevant, verified cleaning and durability guidance into the page.',
        image: { src: asset('responses'), srcset: `${asset('responses-480')} 480w, ${asset('responses-800')} 800w, ${asset('responses')} 1052w`, width: 1052, height: 786, alt: 'Mobile sofa shopping examples with recommended search suggestions, a best-match product and optional apartment delivery and assembly services' },
      },
    ],
  },
  results: {
    heading: 'Higher sales in every comparable month.',
    introduction: 'Across the seven full months following the March launch, recorded sales revenue was 256% higher than in the same period of 2025. Every corresponding month showed growth.',
    months: [
      { month: 'April', short: 'Apr', growth: 196, revenue2025Eur: 8450.8, revenue2026Eur: 24990.8 },
      { month: 'May', short: 'May', growth: 259, revenue2025Eur: 5321, revenue2026Eur: 19126 },
      { month: 'June', short: 'Jun', growth: 603, revenue2025Eur: 2032, revenue2026Eur: 14286 },
      { month: 'July', short: 'Jul', growth: 102, revenue2025Eur: 9460, revenue2026Eur: 19094 },
      { month: 'August', short: 'Aug', growth: 383, revenue2025Eur: 2664, revenue2026Eur: 12864.8 },
      { month: 'September', short: 'Sep', growth: 261, revenue2025Eur: 4895.8, revenue2026Eur: 17651 },
      { month: 'October', short: 'Oct', growth: 411, revenue2025Eur: 5758, revenue2026Eur: 29423 },
    ],
    currencyNote: 'Approximate EUR amounts, rounded to the nearest euro. Indicative conversion: €1 = RON 5.00.',
  },
  testimonial: {
    heading: 'Agache’s perspective',
    placeholder: 'Add an approved quote about what became easier for customers, the commercial change Agache observed and the experience of working with Ixaria.',
    attribution: 'Name and role to be confirmed',
  },
  closing: {
    heading: 'What do your customers need before they feel ready to buy?',
    description: 'Start with the unanswered questions in your buying journey. Find where clearer, more relevant information could help.',
    label: 'Take your first step', href: '/audit.html',
  },
};
