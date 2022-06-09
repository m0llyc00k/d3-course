<script>
	//References (in addition to svelte and d3 documentation):
	//https://dev.to/learners/maps-with-d3-and-svelte-8p3
	//https://svelte.recipes/components/world-map
	//https://bl.ocks.org/rveciana/9026255839233498dbe979ea69ad3af2
	//https://svelte.recipes/components/world-map

	import { geoAlbersUsa, geoPath, scaleOrdinal, ascending } from 'd3';
	import Tooltip from '$lib/components/interactivity/Tooltip.svelte';
	import Modal from '$lib/components/interactivity/Modal.svelte';
	import Select from 'svelte-select';

	export let counties = [];

	export const width = 1200,
		height = 550;

	const projection = geoAlbersUsa()
		.translate([width / 2, height / 2])
		.scale([1150]);

	const path = geoPath(projection);

	$: thisColorScale = scaleOrdinal()
		.domain([1, 5])
		.range(['#3b528b', '#fde725', '#440154', '#21908d', '#5dc963']);

	//create legend
	const legendColors = scaleOrdinal().range([
		'#3b528b',
		'#fde725',
		'#440154',
		'#21908d',
		'#5dc963'
	]);

	const legendLabels = [
		'Low MAT Rate, High Pill Rate, Moderate Death Rate',
		'High MAT Rate, Moderate Pill Rate, High Death Rate',
		'Unknown or Low Risk Status',
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

	$: selectCounties = counties
		.map((county) => {
			return {
				name: county.properties.NAMELSAD,
				state: county.properties.NAME_2,
				data: county.properties
			};
		})
		.sort((a, b) => ascending(a.name, b.name))
		.sort((a, b) => ascending(a.state, b.state));

	// let selectCounty = undefined;
	const getSelectionLabel = (option) => option.name;
	const getOptionLabel = (option) => option.name;
	const groupBy = (option) => option.state;

	function handleSelectDropdown(event) {
		isModalOpen = true;
		modalData = event.detail.data;
	}

	function handleClearDropdown() {
		modalData = undefined;
	}
</script>

<form class="max-w-sm m-auto pt-4 text-left">
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
<section class="text-center m-4">
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
		<p class="my-0">{tooltipData.NAMELSAD}, {tooltipData.STUSPS}</p>
	</Tooltip>
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
