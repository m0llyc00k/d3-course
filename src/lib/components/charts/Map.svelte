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
	import TooltipMap from '$lib/components/interactivity/TooltipMap.svelte';
	import Modal from '$lib/components/interactivity/Modal.svelte';
	import Select from 'svelte-select';

	export let counties = [];

	export const width = 1200,
		height = 550;

	let containerWidth = 1200;

	const projection = geoAlbersUsa()
		.translate([containerWidth / 2, height / 2])
		.scale([1150]);

	const path = geoPath(projection);

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
<div id="legend" class="flex gap-x-1 justify-center p-3">
	{#each legendStatusData as label}
		<div class="flex flex-col items-center">
			<p class="text-xs text-left pb-2">{label.status}</p>
			<div
				class="w-[70px] h-[20px] bg-{label.color} border-black border"
				data-tooltip={label.value}
			/>
		</div>
	{/each}
</div>
<section class="text-center m-4">
	<svg {width} {height} class="mx-auto">
		<g>
			{#each counties as county}
				<path
					class="focus:fill-cyan-300 hover:fill-cyan-100 stroke-black cursor-pointer fill-{legendStatusData.find(
						(d) => d.CL === county.properties.CL
					).color}"
					d={path(county)}
					on:mouseover={mouseover(county.properties)}
					on:focus={mouseover(county.properties)}
					on:mouseout={() => (tooltipMap = false)}
					on:blur={() => (tooltipMap = false)}
					on:click={clicked(county.properties)}
				/>
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
