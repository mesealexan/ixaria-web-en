import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({ title: z.string(), label: z.string(), updatedLabel: z.string() }),
});
const careers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/careers' }),
  schema: z.object({ title: z.string() }),
});
export const collections = { legal, careers };
