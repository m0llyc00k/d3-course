<script context="module">
	// https://kit.svelte.dev/docs#loading
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, fetch, session, stuff }) {
		return {
			// props: {
			// 	title: 'Mapping Vulnerability in the Opioid Crisis',
			// 	subtitle:
			// 		'Using attribute clustering to determine the risk status of US counties based on opioid pill distribution, overdose death rates, and the availability of medication-assisted treatment (MAT).'
			// }
		};
	}
</script>

<script>
	import Map from '$lib/components/charts/Map.svelte';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	// export let title = '';
	// export let subtitle = '';

	let title = 'Mapping Vulnerability in the Opioid Crisis';
	let subtitle =
		'Using attribute clustering to determine the risk status of US counties based on opioid pill distribution, overdose death rates, and the availability of medication-assisted treatment (MAT).';

	const mapURL =
		'https://raw.githubusercontent.com/m0llyc00k/Summer2022/main/county-state-analysis.json';

	// let counties = [];
	export let geojson = [];

	// get data
	// onMount(async () => {
	// 	await d3.json(mapURL).then((geojson) => {
	// 		counties = geojson.features;
	// 	});
	// });
</script>

<article class="prose-headings:text-primary pt-4 content-well text-center">
	<header class="mb-0">
		<h1 class="sm:text-4xl font-bold mx-auto">{title}</h1>
		<h2 class="sm:text-md mx-auto pt-2 pb-0 max-w-3xl">{subtitle}</h2>
	</header>
	<Map {geojson} />
</article>
