import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      pages: 'build',      // Output folder for pages
      assets: 'build',     // Output folder for assets
      fallback: 'index.html',
      precompress: false
    }),
    prerender: {
      // Specify paths to prerender
      entries: ['*']      // This will prerender all pages
    }
  }
};

export default config;
