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

	const heightWidthProportion = 0.585;
	const viewboxDims = [600, 500 * heightWidthProportion];

	const geojson = feature(topojson, topojson.objects.collection);
	const counties = geojson.features;
	const projectionFn = geoAlbersUsa().fitSize(viewboxDims, geojson);
	const path = geoPath(projectionFn);

	//create legend
	const legendStatusData = [
		{
			CL: 2,
			value: 'Insufficient Data',
			color: 'map-purple',
			status: 'unknown'
		},
		{
			CL: 5,
			value: 'High MAT Rate, Moderate Pill Rate, High Death Rate',
			color: 'map-yellow',
			status: 'low'
		},
		{
			CL: 4,
			value: 'High MAT Rate, High Pill Rate, High Death Rate',
			color: 'map-green',
			status: 'moderate'
		},
		{
			CL: 1,
			value: 'Low MAT Rate, High Pill Rate, Moderate Death Rate',
			color: 'map-blue',
			status: 'high'
		},
		{
			CL: 3,
			value: 'Low MAT Rate, High Pill Rate, High Death Rate',
			color: 'map-teal',
			status: 'highest'
		}
	];

	$: selectCounties = counties
		.map((county) => {
			return {
				name: county.properties.NAMELSAD,
				state: county.properties.NAME_2,
				statusCL: county.properties.CL,
				data: county.properties
			};
		})
		.sort((a, b) => ascending(a.name, b.name))
		.sort((a, b) => ascending(a.state, b.state));

	let tooltipMap;
	let tooltipData;
	let modalData;
	let isModalOpen;

	const mouseover = (thisCounty, e) => {
		tooltipMap = true;
		tooltipData = thisCounty;
	};

	const clicked = (thisCounty, e) => {
		isModalOpen = true;
		modalData = thisCounty;
		// console.log(tooltipData);
	};

	// let selectCounty = undefined;
	const getSelectionLabel = (option) => option.name;
	const getOptionLabel = (option) => option.name;
	const groupBy = (option) => option.state;

	const handleSelectDropdown = (event) => {
		isModalOpen = true;
		modalData = event.detail.data;
	};

	const handleClearDropdown = () => {
		modalData = undefined;
	};
</script>

<form class="max-w-sm m-auto p-5 text-left">
	<Select
		class="text-left"
		{getOptionLabel}
		{getSelectionLabel}
		items={selectCounties}
		{groupBy}
		placeholder="Select a County to See Details"
		on:select={handleSelectDropdown}
		on:clear={handleClearDropdown}
	/>
</form>
<div id="legend" class="grid grid-cols-5 gap-x-1 justify-center p-3">
	{#each legendStatusData as label}
		<div class="flex flex-col items-center flex-1">
			<p class="text-xs text-left capitalize">{label.status}</p>
			<div
				class="w-full h-[20px] bg-{label.color} border-black border"
				data-tooltip={label.value}
			/>
		</div>
	{/each}
</div>
<section class="text-center m-4">
	<svg
		class="w-full h-full mx-auto overflow-visible viz-container"
		viewbox="0 0 {viewboxDims[0]} {viewboxDims[1]}"
	>
		<g>
			{#each geojson.features as feature}
				<path
					class="focus:fill-cyan-300 hover:fill-cyan-100 stroke-black stroke-[0.4px] cursor-pointer fill-{legendStatusData.find(
						(d) => d.CL === feature.properties.CL
					).color}"
					d={path(feature)}
					on:mouseover={() => mouseover(feature.properties)}
					on:focus={() => mouseover(feature.properties)}
					on:mouseout={() => (tooltipMap = false)}
					on:blur={() => (tooltipMap = false)}
					on:click={() => clicked(feature.properties)}
				>
					<title>{feature.properties.name}</title>
				</path>
			{/each}
		</g>
	</svg>

	<TooltipMap {tooltipMap}>
		<p class="my-0">{tooltipData.NAMELSAD}, {tooltipData.STUSPS}</p>
	</TooltipMap>

	<Modal bind:isModalOpen>
		<svelte:fragment slot="modal-content">
			<h1 class="font-bold">{modalData.NAMELSAD}, {modalData.STUSPS}</h1>
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
