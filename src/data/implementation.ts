export interface ImplementationStage {
  slug: 'audit' | 'pilot' | 'full-implementation';
  title: string;
  label: string;
  summary: string;
  introduction: string;
  focusTitle: string;
  focus: { title: string; description: string }[];
  outcomes: string[];
  next: string;
  callToAction: string;
}

export const implementationStages: ImplementationStage[] = [
  {
    slug: 'audit',
    title: 'Audit',
    label: 'Understand',
    summary:
      'Understand your current product pages, customer journey and product data. Identify where to focus first.',
    introduction:
      'Start with a clear picture of where you are today. We review how your furniture products are presented online, what customers need to make a decision, and which information or tools are missing.',
    focusTitle: 'Find the right starting point.',
    focus: [
      {
        title: 'Your product pages',
        description:
          'Review the information, imagery, options and buying experience on your existing webshop.',
      },
      {
        title: 'Your customers',
        description:
          'Look at the customer journey and the available signals that help explain where buyers hesitate or need more information.',
      },
      {
        title: 'Your product data',
        description:
          'Identify what is available, what is missing, and how your current systems and workflows fit together.',
      },
    ],
    outcomes: [
      'A prioritized view of the opportunities on your product pages.',
      'A clear picture of the product data and assets needed.',
      'A proposed scope for a focused pilot.',
    ],
    next: 'Use the audit to select the products and improvements to test in a pilot.',
    callToAction: 'Talk about your audit',
  },
  {
    slug: 'pilot',
    title: 'Pilot',
    label: 'Validate',
    summary:
      'Start with a selected group of products. Test the experience, learn from real customers and measure the results.',
    introduction:
      'Put the approach into practice with a focused group of products. The pilot gives us a way to learn from real customer behavior before deciding how to expand across your catalogue.',
    focusTitle: 'Prove the approach on real products.',
    focus: [
      {
        title: 'Choose the scope',
        description:
          'Select the products, opportunities and success measures to focus on, using the findings from the audit.',
      },
      {
        title: 'Build the experience',
        description:
          'Prepare the selected product data and assets, then connect the pilot product pages to your existing webshop.',
      },
      {
        title: 'Learn from customers',
        description:
          'Review how visitors browse, compare and interact with the pilot pages. Use those signals to evaluate and improve the experience.',
      },
    ],
    outcomes: [
      'A working product-page experience for the selected products.',
      'A review of the customer behavior and results observed during the pilot.',
      'A recommendation for the next stage based on what we learn.',
    ],
    next: 'If the pilot supports moving forward, use its findings to plan the full implementation.',
    callToAction: 'Discuss a pilot',
  },
  {
    slug: 'full-implementation',
    title: 'Full Implementation',
    label: 'Scale',
    summary:
      'Roll out the validated approach across your product catalogue, connect the workflows and keep improving.',
    introduction:
      'Turn the lessons from the pilot into a broader product-page system. We plan the rollout around your products, data and existing webshop, then keep improving the experience as customers use it.',
    focusTitle: 'Build on what works.',
    focus: [
      {
        title: 'Prepare the catalogue',
        description:
          'Structure the product information, options and assets needed to extend the experience to the agreed product range.',
      },
      {
        title: 'Connect the workflows',
        description:
          'Bring product data, visuals, configuration and page templates into a coordinated workflow that fits your business.',
      },
      {
        title: 'Roll out and improve',
        description:
          'Launch the agreed product pages and use customer behavior to guide ongoing improvements.',
      },
    ],
    outcomes: [
      'A rollout plan shaped by the audit and pilot.',
      'A consistent product-page experience across the agreed catalogue.',
      'Connected workflows and an ongoing process for improving the experience.',
    ],
    next: 'Continue reviewing customer behavior and improving the product pages as your catalogue and business evolve.',
    callToAction: 'Plan your implementation',
  },
];

export const implementationPath = (stage: ImplementationStage) => `/${stage.slug}.html`;
