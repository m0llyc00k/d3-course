<script>
	//References (in addition to svelte and d3 documentation):
	//https://dev.to/learners/maps-with-d3-and-svelte-8p3
	//https://svelte.recipes/components/world-map
	//https://bl.ocks.org/rveciana/9026255839233498dbe979ea69ad3af2
	//https://svelte.recipes/components/world-map
	//Tasks
	//connect dropdown to county paths (county shape highlighted when clicked on dropdown)
	//add color/ vulnerability status to modal to understand details (reinforce legend)
	//click off dropdown to reset (right now, only works when 'x')
	import { geoAlbersUsa, geoPath, ascending } from 'd3';
	// import * as d3 from 'd3';
	import TooltipMap from '$lib/components/interactivity/TooltipMap.svelte';
	import Modal from '$lib/components/interactivity/Modal.svelte';
	import Select from 'svelte-select';
	import { feature } from 'topojson-client';
	// import { raise } from 'layercake';
	import topojson from '$lib/data/cartography/counties.topojson.json';
	const heightWidthProportion = 0.76;
	const viewboxDims = [600, 500 * heightWidthProportion];
	const geojson = feature(topojson, topojson.objects.collection);
	const counties = geojson.features;
	const projectionFn = geoAlbersUsa().fitSize(viewboxDims, geojson);
	const path = geoPath(projectionFn);
	//create legend
	const legend = {
		1: {
			value: 'Low MAT Rate, High Pill Rate, Moderate Death Rate',
			color: 'map-blue',
			status: 'high',
			order: 3
		},
		3: {
			value: 'Low MAT Rate, High Pill Rate, High Death Rate',
			color: 'map-teal',
			status: 'highest',
			order: 4
		},
		4: {
			value: 'High MAT Rate, High Pill Rate, High Death Rate',
			color: 'map-green',
			status: 'moderate',
			order: 2
		},
		5: {
			value: 'High MAT Rate, Moderate Pill Rate, High Death Rate',
			color: 'map-yellow',
			status: 'low',
			order: 1
		},
		2: {
			value: 'Insufficient Data',
			color: 'map-purple',
			status: 'unknown',
			order: 5
		}
	};
	const selectCounties = counties
		.map((county) => {
			return {
				name: county.properties.NAMELSAD,
				state: county.properties.NAME_2,
				statusCL: county.properties.CL,
				data: county.properties
			};
		})
		.sort((a, b) => ascending(a.state, b.state) || ascending(a.name, b.name));
	let tooltipMap;
	let tooltipData;
	let modalData;
	let isModalOpen;
	const mouseover = (thisCounty) => {
		tooltipMap = true;
		tooltipData = thisCounty;
	};
	const clicked = (thisCounty) => {
		isModalOpen = true;
		modalData = thisCounty;
		// console.log(tooltipData);
	};
	// let selectCounty = undefined;
	$: console.log(selectCounties);
</script>

<form class="m-auto max-w-sm p-5 text-left">
	<Select
		containerClasses="text-left"
		optionIdentifier="name"
		labelIdentifier="name"
		items={selectCounties}
		groupBy={(opt) => opt.state}
		placeholder="Select a County to See Details"
		on:select={(event) => {
			isModalOpen = true;
			console.log(event.detail.data);
			modalData = { ...event.detail.data, color: legend[event.detail.data.CL].color };
		}}
		on:clear={() => {
			modalData = undefined;
		}}
	/>
</form>
<div id="legend" class="grid grid-cols-5 justify-center gap-x-1 p-3">
	{#each Object.entries(legend).sort( (a, b) => ascending(a[1].order, b[1].order) ) as [label, { value, status, color }]}
		<div class="flex flex-1 flex-col items-center">
			<p class="text-left text-xs capitalize">{status}</p>
			<div class="h-[20px] w-full bg-{color} border border-black" data-tooltip={value} />
		</div>
	{/each}
</div>
<section class="m-4 text-center">
	<svg
		class="viz-container mx-auto h-full w-full overflow-visible"
		viewbox="0 0 {viewboxDims[0]} {viewboxDims[1]}"
	>
		<g>
			{#each geojson.features as feature}
				{@const color = legend[feature.properties.CL].color}
				<path
					class="cursor-pointer stroke-black stroke-[0.4px] hover:fill-cyan-100 focus:fill-cyan-300 fill-{color}"
					d={path(feature)}
					on:mouseover={() => mouseover({ ...feature.properties, color })}
					on:focus={() => mouseover({ ...feature.properties, color })}
					on:mouseout={() => (tooltipMap = false)}
					on:blur={() => (tooltipMap = false)}
					on:click={() => clicked({ ...feature.properties, color })}
				>
					<title>{feature.properties.name}</title>
				</path>
			{/each}
		</g>
	</svg>

	<TooltipMap {tooltipMap}>
		<p class="my-0">{tooltipData.NAMELSAD}, {tooltipData.STUSPS}</p>
	</TooltipMap>

	<Modal border={modalData?.color} bind:isModalOpen>
		<svelte:fragment slot="modal-content">
			<h1 class="font-bold text-white">
				{modalData.NAMELSAD}, {modalData.STUSPS}
			</h1>
			<hr class="py-2" />
			<div class="text-left">
				<h2>
					MAT Providers [2022]: <span class="font-bold">{modalData.MAT}</span>
				</h2>
				<h2>
					Pills per 100 People [2012]: <span class="font-bold"
						>{modalData.PILLS != null ? modalData.PILLS : 'No Data Available'}</span
					>
				</h2>
				<h2>
					Deaths per 100,000 People [2010-2020]: <span class="font-bold"
						>{modalData.DEATHSPER != null ? modalData.DEATHSPER : 'No Data Available'}</span
					>
				</h2>
			</div>
		</svelte:fragment>
	</Modal>
</section>