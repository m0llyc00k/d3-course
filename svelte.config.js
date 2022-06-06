import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
import dsv from '@rollup/plugin-dsv';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: preprocess({
		postcss: true
	}),
	kit: {
		adapter: adapter(),
		trailingSlash: 'never',
		vite: {
			plugins: [dsv()]
		}
	}
};
