<script context="module">
	// https://kit.svelte.dev/docs#loading
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, fetch, session, stuff }) {
		return {
			props: { title: 'Mapping Vulnerability in the Opioid Crisis' }
		};
	}
</script>

<script>
	import Map from '$lib/components/charts/Map.svelte';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	export let title = '';

	const mapURL =
		'https://raw.githubusercontent.com/m0llyc00k/Summer2022/main/county-state-analysis.json';

	let counties = [];

	// get data
	onMount(async () => {
		await d3.json(mapURL).then((geojson) => {
			counties = geojson.features;
		});
	});
</script>

<article class="prose-headings:text-primary pt-5 content-well text-center">
	<header class="mb-0">
		<h1 class="sm:text-4xl font-bold mx-auto">{title}</h1>
	</header>
	<Map {counties} />
</article>
