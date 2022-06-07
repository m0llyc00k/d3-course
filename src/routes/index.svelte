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
	import Tooltip from '$lib/components/interactivity/Tooltip.svelte';
	import Map from '$lib/components/charts/Map.svelte';
	import List from '$lib/components/layout/List.svelte';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	export let title = '';

	// variable to pass tooltip data
	let tooltip;
	let tooltipContainer;

	const mapURL = 'https://raw.githubusercontent.com/m0llyc00k/Summer2022/main/counties.json';

	const width = 1200,
		height = 550;

	let counties = [];
	let namesExtent = [];
	$: colorScale = () => {};
	let list = [];
	let thisColor;

	// get data
	onMount(async () => {
		await d3.json(mapURL).then((geojson) => {
			counties = geojson.features;
			console.log(counties);

			//could not access this outside of onMount function despite trying to 'export' it.
			namesExtent = d3.extent(counties, (d) => d.properties.CL);
			colorScale = d3
				.scaleOrdinal()
				.domain([1, 5])
				.range(['#3b528b', '#fde725', '#440154', '#21908d', '#5dc963']);

			//testing the colorscale function
			thisColor = colorScale(counties[50].properties.CL);

			console.log('extent:' + namesExtent + ' / ' + 'color:' + thisColor);
		});
	});

	//populate 'list' with clicked data
	function onToggleState(county) {
		const countyIndex = list.indexOf(county);
		if (countyIndex === -1) {
			list = [county];
		} else {
			list = [];
		}
	}
</script>

<article class="prose-headings:text-primary pt-5 content-well text-center">
	<header class="mb-0">
		<h1 class="sm:text-4xl font-bold mx-auto">{title}</h1>
	</header>
	<section class="text-center mx-auto">
		<svg {width} {height} class="mx-auto">
			<Map {counties} callback={onToggleState} {list} />
		</svg>
		<List {list} />
	</section>
	<!-- <section id="tooltips">
		<mark
			class="my-1 bg-secondary-light border border-secondary rounded-full px-3 text-base leading-tight inline-block py-0.5"
			bind:this={tooltipContainer}
			on:mouseover={() =>
				(tooltip = {
					data: 'Hello world!'
				})}
			on:focus={() =>
				(tooltip = {
					data: 'Hello world!'
				})}
			on:mouseout={() => (tooltip = false)}
			on:blur={() => (tooltip = false)}
		>
			<i class="far fa-hand-pointer text-primary" />
			via a Tooltip.svelte component
			<Tooltip bind:tooltip parentContainer={tooltipContainer}>
				<p class="my-0">{tooltip.data}</p>
			</Tooltip>
		</mark>
	</section> -->
</article>
