import type { FAQ } from './types';

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How the solution works / what it does?',
    answer: [
      'Ixaria improves the product pages on your existing online store. It brings images, videos, product options, dimensions, delivery details and other useful information into one clear page. It then learns from visitor behaviour and shows each customer the information most helpful to their buying decision.',
    ],
  },
  {
    id: 'faq-2',
    question: 'How is it implemented in our webshop?',
    answer: [
      'Ixaria connects to your existing webshop, so there is no need to rebuild it. You can use one of our product-page templates or keep your own. We add your product data to the chosen template, while your checkout, payments and orders continue to work as before.',
    ],
  },
  {
    id: 'faq-3',
    question: 'How do you know what stage of the customer journey the customer is in?',
    answer: [
      'We estimate the customer’s buying stage from several signals. We look at where they came from, whether they visited before, how long they stay and which parts of the website they focus on. We also learn from the questions they ask through the built-in chat. Together, these signals show whether the customer is exploring, comparing options or getting ready to buy.',
    ],
  },
  {
    id: 'faq-4',
    question: 'Can we try a pilot?',
    answer: [
      'Yes. We recommend starting with a small number of products so you can see how Ixaria works and measure the results. If the pilot performs well, you can then expand it to your full product catalogue.',
    ],
  },
  {
    id: 'faq-5',
    question: 'Will your tool update the design of my website? How do we handle brand control?',
    answer: [
      'Ixaria does not redesign your whole website. You can use one of our fully customizable product-page templates or keep your existing template. Your colours, fonts, layout and visual style remain under your control, so every page stays consistent with your brand.',
    ],
  },
  {
    id: 'faq-6',
    question:
      'Would it also affect landing pages, category pages, product listing pages, or search?',
    answer: [
      'Ixaria only changes your product pages. A small plugin is added across the website to understand how visitors move between landing pages, categories, search and products, but it does not change those pages. If you choose, the question bar can also be added to product listing pages.',
    ],
  },
  {
    id: 'faq-7',
    question:
      'Is replacing the PIM and other intelligence layers an absolute hard requirement? Can you connect to existing PIM/DAM?',
    answer: [
      'No. During the pilot, Ixaria can retrieve product data and assets from your existing PIM, DAM or other tools. If the pilot is successful, we recommend moving the relevant product data and workflows fully to Ixaria, so you do not have to maintain and pay for two systems doing the same job.',
    ],
  },
  {
    id: 'faq-8',
    question: 'Can the solution generate images in a live environment?',
    answer: [
      'Yes. Ixaria includes tools that automatically generate and edit product images. It can create floating product images, place products in different rooms and lighting conditions, and generate images that clearly show dimensions. These visuals can then be used directly on live product pages.',
    ],
  },
  {
    id: 'faq-9',
    question: 'Can pages adapt by country or market area?',
    answer: [
      'Yes. This is one of Ixaria’s core features. Customers in different markets often care about different things, so Ixaria can adapt the message, product information and visuals for each country or region. We use our knowledge of each market to recommend what should be shown and emphasized.',
    ],
  },
  {
    id: 'faq-10',
    question: 'How long does it take to have the Ixaria solution live?',
    answer: [
      'Ixaria usually takes between one and three months to go live. The exact time depends on the number of products, how much product data is missing, and whether you already have good images and 3D models available.',
    ],
  },
  {
    id: 'faq-11',
    question: 'How soon can I see the first results?',
    answer: [
      'It depends mainly on how many visitors your website receives. More visitors allow Ixaria to learn and measure results faster. With around 30,000 visitors per month, you can usually see meaningful results within about two months. Websites with less traffic may need more time.',
    ],
  },
  {
    id: 'faq-12',
    question: 'Does it work for both movable and fixed furniture?',
    answer: [
      'Ixaria is built for movable furniture, such as sofas, chairs, tables and some freestanding cabinets. It can support products with customizable options, but it is not designed for fixed furniture or fully bespoke, made-to-order projects.',
    ],
  },
  {
    id: 'faq-13',
    question: 'What kind of work do you provide?',
    answer: [
      'Ixaria can cover the full product page experience for furniture manufacturers. Depending on what you already have and what is missing, we can provide 3D modeling, product image generation, dimensioned images, centralized product reviews, 3D configuration, and product page layout design.',
      'The 3D configuration can range from a simple setup with a few options to a highly complex configurator with many variations, dimensions, materials, and product rules.',
    ],
  },
  {
    id: 'faq-14',
    question: 'Can Ixaria help if we already have a 3D configurator?',
    answer: [
      'Ixaria does not usually work with existing 3D configurators. Most configurators come with their own limitations, rules, and technical restrictions, which makes it difficult for our system to adapt and improve them based on real customer behavior.',
      'Instead, we prefer to build the 3D configuration experience inside the Ixaria system, so it can be connected with the product data, page layout, analytics, and ongoing optimization process.',
    ],
  },
  {
    id: 'faq-15',
    question: 'Do I need to replace my current ecommerce platform?',
    answer: [
      'No. Ixaria does not replace your existing ecommerce platform. It improves the product page layer and helps centralize the elements that are usually scattered across different plugins and tools.',
    ],
  },
];
