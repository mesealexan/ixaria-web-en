import { pilot } from './pilot';
import { fullImplementation } from './full-implementation';

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
    introduction: pilot.hero.description,
    focusTitle: pilot.implement.heading,
    focus: pilot.implement.points.map(point => ({ title: point.heading, description: point.text })),
    outcomes: pilot.why.steps,
    next: pilot.final.next,
    callToAction: pilot.bookingLabel,
  },
  {
    slug: 'full-implementation',
    title: 'Full Implementation',
    label: 'Scale',
    summary:
      'Roll out the validated approach across your product catalogue, connect the workflows and keep improving.',
    introduction: fullImplementation.hero.description,
    focusTitle: fullImplementation.implement.heading,
    focus: fullImplementation.implement.points.map(point => ({ title: point.heading, description: point.text })),
    outcomes: fullImplementation.rollout.steps.map(step => step.text),
    next: fullImplementation.final.description,
    callToAction: fullImplementation.bookingLabel,
  },
];

export const implementationPath = (stage: ImplementationStage) => `/${stage.slug}.html`;
