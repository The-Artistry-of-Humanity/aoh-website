import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Shared links use addresses without a trailing slash (e.g. /fulfilment-check-in),
// so both forms must work.
export default defineConfig({
  integrations: [react()],
  site: 'https://artistry-of-humanity.com',
  trailingSlash: 'never',
  // /fulfilment-check-in.html etc., so Netlify serves the shared links exactly as written.
  build: { format: 'file' },
});
