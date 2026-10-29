// Bundles the Netlify functions in netlify/src into netlify/functions before
// the site build. The report function shares its layout and scoring with the
// site (src/islands/report, src/data/checkin), so it needs JSX compiled the same
// way; npm packages stay as imports for Netlify's own bundler to resolve.
import { build } from 'esbuild';

for (const entry of ['send-report.tsx', 'submission-created.ts']) {
  await build({
    entryPoints: [`netlify/src/${entry}`],
    outfile: `netlify/functions/${entry.replace(/\.tsx?$/, '.mjs')}`,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    jsx: 'automatic',
    packages: 'external',
    logLevel: 'warning',
  });
}
