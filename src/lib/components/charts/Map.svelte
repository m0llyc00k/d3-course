<script>
	//References (in addition to svelte and d3 documentation):
	//https://dev.to/learners/maps-with-d3-and-svelte-8p3
	//https://svelte.recipes/components/world-map
	//https://bl.ocks.org/rveciana/9026255839233498dbe979ea69ad3af2
	//https://svelte.recipes/components/world-map

	import * as d3 from 'd3';
	import Tooltip from '$lib/components/interactivity/Tooltip.svelte';
	import Modal from '$lib/components/interactivity/Modal.svelte';
	export let counties = [];

	export const width = 1200,
		height = 550;

	$: projection = d3
		.geoAlbersUsa()
		.translate([width / 2, height / 2])
		.scale([1150]);

	$: path = d3.geoPath(projection);

	$: thisColorScale = d3
		.scaleOrdinal()
		.domain([1, 5])
		.range(['#3b528b', '#fde725', '#440154', '#21908d', '#5dc963']);

	//create legend
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
	let tooltip;
	let tooltipData;
	let modalData;
	let isModalOpen;

	const mouseover = (thisCounty) => {
		tooltip = true;
		tooltipData = thisCounty;
		// console.log(tooltipData);
	};

	const clicked = (thisCounty) => {
		isModalOpen = true;
		modalData = thisCounty;
		// console.log(tooltipData);
	};
</script>

<section class="text-center mx-auto">
	<svg {width} {height} class="mx-auto">
		<g>
			{#each counties as county}
				<path
					class="focus:fill-cyan-300 hover:fill-cyan-100 stroke-black cursor-pointer stroke-1"
					d={path(county)}
					on:mouseover={mouseover(county.properties)}
					on:focus={mouseover(county.properties)}
					on:mouseout={() => (tooltip = false)}
					on:blur={() => (tooltip = false)}
					on:click={clicked(county.properties)}
					fill={thisColorScale(county.properties.CL)}
				/>
			{/each}
		</g>

		<g class="legend">
			{#each legendText as label, index}
				<text class="opacity-100 bg-gray-600 text-xs" x={60} y={index * 25 + 440}>{label}</text>
			{/each}
		</g>
		<g>
			{#each legendText as label, index}
				<rect
					class="stroke-black"
					x={20}
					y={index * 24 + 427}
					fill={legendColors(label)}
					width="30"
					height="21"
				/>
			{/each}
		</g>
	</svg>
	<Tooltip {tooltip}>
		<p class="my-0">{tooltipData.NAMELSAD}</p>
	</Tooltip>
	<Modal {isModalOpen}>
		<svelte:fragment slot="modal-content">
			<h1 class="font-bold">{modalData.NAMELSAD}</h1>
			<h2>MAT Providers [2022]: <span class="font-bold">{modalData.MAT}</span></h2>
			<h2>Pills per 100 People [2012]: <span class="font-bold">{modalData.PILLS}</span></h2>
			<h2>
				Deaths per 100,000 People [2010-2020]: <span class="font-bold">{modalData.DEATHSPER}</span>
			</h2>
		</svelte:fragment>
	</Modal>
</section>
