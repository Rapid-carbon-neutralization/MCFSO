import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const serversCollection = defineCollection({
  loader: glob({ base: './src/content/servers', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  servers: serversCollection,
};
