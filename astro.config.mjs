import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [starlight({
    title: 'MCFSO',
    disable404Route: true,
  })],

  adapter: cloudflare(),
});