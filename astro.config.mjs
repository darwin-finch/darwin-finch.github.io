import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://darwin-finch.github.io',
  integrations: [
    starlight({
      title: 'Finch',
      description: 'Documentation for the experimental Finch terminal agent runtime.',
      favicon: '/favicon.svg',
      disable404Route: true,
      customCss: ['./src/styles/starlight.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/darwin-finch/finch',
        },
      ],
      sidebar: [
        {
          label: 'Documentation',
          items: [{ autogenerate: { directory: 'docs' } }],
        },
      ],
    }),
  ],
});
