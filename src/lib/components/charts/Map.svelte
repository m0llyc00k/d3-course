<script>
	//References (in addition to svelte and d3 documentation):
	//https://dev.to/learners/maps-with-d3-and-svelte-8p3
	//https://svelte.recipes/components/world-map
	//https://bl.ocks.org/rveciana/9026255839233498dbe979ea69ad3af2
	//https://svelte.recipes/components/world-map

	import * as d3 from 'd3';
	import Tooltip from '$lib/components/interactivity/Tooltip.svelte';
	export let counties = [];
	export let callback;
	// export let list = [];
	//   export let legendLabels = [];
	// let visibleState = '';

	export const width = 1200,
		height = 550;

	$: projection = d3
		.geoAlbersUsa()
		.translate([width / 2, height / 2])
		.scale([1150]);

	$: path = d3.geoPath(projection);
	//I had issues accessing 'colorScale' from onMount in App.svelte, so I created it manually here.
	$: thisColorScale = d3
		.scaleOrdinal()
		.domain([1, 5])
		.range(['#3b528b', '#fde725', '#440154', '#21908d', '#5dc963']);

	//create legend
	//const legendColors = ["blue", "yellow", "purple", "teal", "green"];
	const legendColors = d3
		.scaleOrdinal()
		.range(['#3b528b', '#fde725', '#440154', '#21908d', '#5dc963']);

	const legendLabels = [
		'Low MAT Rate, High Pill Rate, Moderate Death Rate',
		'High MAT Rate, Moderate Pill Rate, High Death Rate',
		'Unknown Risk Status',
		'Low MAT Rate, High Pill Rate, High Death Rate',
		'High MAT Rate, High Pill Rate, High Death Rate'
	];

	var legendText = legendLabels.map((d) => d);
	let tooltipContainer;
	let tooltip;
	let tooltipData;
	const mouseover = (county) => {
		tooltip = true;
		tooltipData = county;
	};
</script>

//draw map
<g>
	{#each counties as county}
		<path
			class="focus:fill-cyan-200 stroke-black cursor-pointer stroke-1"
			d={path(county)}
			on:mouseover={mouseover(county.properties)}
			on:focus={mouseover(county.properties)}
			on:mouseout={() => (tooltip = false)}
			on:blur={() => (tooltip = false)}
			on:click={() =>
				callback(
					county.properties.NAMELSAD +
						' || ' +
						' Deaths per 100,000 [2010-2020]: ' +
						county.properties.DEATHSPER +
						' || Pills per 100 [2012]: ' +
						county.properties.PILLS +
						' || MAT Providers [2022]: ' +
						county.properties.MAT
				)}
			fill={thisColorScale(county.properties.CL)}
		/>
	{/each}
</g>
<Tooltip {tooltip}>
	<p class="my-0">{tooltip}</p>
</Tooltip>

<!-- on:mouseenter={() => (visibleState = county.properties.GEOID)}
on:mouseleave={() => (visibleState = '')} -->

<!-- //show county names on hover
<g class="labels">
	{#each counties as county}
		<text
			class:visible={visibleState === county.properties.GEOID}
			x={path.centroid(county)[0]}
			y={path.centroid(county)[1]}
		>
			{county.properties.NAMELSAD}
		</text>
	{/each}
</g> -->

//create legend with text labels and rects
<g class="legend">
	{#each legendText as label, i}
		<text class="opacity-100 bg-gray-800 text-xs" x={60} y={i * 25 + 440}>{label}</text>
	{/each}
</g>
<g>
	{#each legendText as label, i}
		<rect
			class="legend-rect"
			x={20}
			y={i * 24 + 427}
			fill={legendColors(label)}
			width="30"
			height="21"
		/>
	{/each}
</g>
