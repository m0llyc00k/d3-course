<script context="module">
	// https://kit.svelte.dev/docs#loading
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, fetch, session, stuff }) {
		return {
			props: { title: "The DataFace's Svelte Template" }
		};
	}
</script>

<script>
	import logo from '$lib/assets/logo.png';
	import Image from '$lib/components/media/Image.svelte';
	import Ai2html from '$lib/components/media/ai2html/ai2html.svelte';
	import Masonry from '$lib/components/layout/Masonry.svelte';
	import Carousel from '$lib/components/layout/Carousel.svelte';
	import Scrolly from '$lib/components/layout/Scrolly.svelte';
	import Modal from '$lib/components/interactivity/Modal.svelte';
	import Toggle from '$lib/components/interactivity/Toggle.svelte';
	import Tooltip from '$lib/components/interactivity/Tooltip.svelte';
	import Cartogram from '$lib/components/charts/Cartogram.svelte';
	import MapChart from '$lib/components/charts/Map.svelte';
	import Treemap from '$lib/components/charts/treemap/Treemap.svelte';
	import ZoomableTreemap from '$lib/components/charts/treemap/ZoomableTreemap.svelte';
	import zoomableTreemapData from '$lib/data/zoomableTreemap.json';
	import treemapData from '$lib/data/treemap.json';

	export let title = '';

	const charts = [
		{ component: Cartogram, props: {} },
		{ component: MapChart, props: {} },
		{
			component: ZoomableTreemap,
			props: {
				data: zoomableTreemapData[2],
				height: 400,
				rectCornerRadius: 4,
				rectClasses: 'stroke-1 stroke-background hover:opacity-80',
				label: (d) => d.name,
				value: (d) => d?.value,
				fill: '#fcd34d'
			}
		},
		{
			component: Treemap,
			props: {
				data: treemapData[2],
				height: 420,
				showLabel: false,
				rectCornerRadius: 4,
				rectClasses: 'stroke-1 stroke-background',
				path: (d) => d.name,
				value: (d) => d?.value,
				label: (d) => d.name.split('/').pop(0),
				group: (d) => d.name.split('/')[1],
				zDomain: ['Part A', 'Part B', 'Part D'],
				colors: ['#234C5E', '#00CCB3', '#fcd34d']
			}
		}
	];

	// variable to pass tooltip data
	let tooltip;
	let tooltipContainer;

	// checkmark toggle, two-way binding
	let toggleChecked = true;

	// number of items in masonry
	$: items = Array.from({ length: 5 }, (_, i) => ({
		id: i,
		height: Math.max(100, Math.round(Math.random() * 200))
	}));
</script>

<article class="prose prose-headings:text-primary pt-12 content-well text-center">
	<header class="mb-16">
		<Image classes="mx-auto" src={logo} alt="The DataFace Logo" width="75px" lazy />
		<h1 class="sm:text-6xl font-bold max-w-lg my-2 mx-auto">{title}</h1>
	</header>

	<section id="toggle">
		<h2 class="text-center">Easy-to-use toggles</h2>
		<Toggle
			id="test-toggle"
			classes="my-1.5"
			left="False"
			right="True"
			bind:checked={toggleChecked}
		/>
		<code
			class="my-1 p-1 border uppercase font-bold block rounded-sm"
			class:bg-green-50={toggleChecked}
			class:bg-red-50={!toggleChecked}
			class:border-green-700={toggleChecked}
			class:border-red-700={!toggleChecked}
			class:text-green-900={toggleChecked}
			class:text-red-900={!toggleChecked}
		>
			{toggleChecked}
		</code>
	</section>

	<section id="masonry">
		<div class="flex gap-2 justify-center mb-2">
			<button
				class="bg-red-50 border border-red-300 rounded-sm px-3 font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
				disabled={items.length === 1}
				on:click={() => {
					if (items.length > 1) items = items.slice(0, -1);
				}}>-</button
			>
			<button
				class="bg-green-50 border border-green-300 rounded-sm px-3 font-bold text-lg"
				on:click={() => {
					items = [
						...items,
						{
							id: items.length,
							height: Math.max(100, Math.round(Math.random() * 200))
						}
					];
				}}>+</button
			>
		</div>

		<Masonry class="justify-center my-4" {items} id="id" nCols={3} let:item>
			<div
				class="bg-secondary-light p-2 rounded-md font-bold text-xs leading-none flex justify-center items-center"
				style:height="{item.height}px"
			>
				{item.height}px
			</div>
		</Masonry>
	</section>

	<section id="tooltips">
		<h2 class="text-center">Tooltips</h2>
		<ul class="list-none grid grid-cols-1 sm:grid-cols-2">
			<li>
				<h3 class="my-0">Pure-CSS tooltips</h3>
				<mark
					class="my-1 bg-secondary-light border border-secondary rounded-full px-3 text-base leading-tight py-0.5"
					data-tooltip="Hello world!"
				>
					<i class="far fa-hand-pointer text-primary" />
					via a data-tooltip attribute
				</mark>
			</li>
			<li>
				<h3 class="my-0">Dyanamic tooltips</h3>
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
			</li>
		</ul>
	</section>

	<section id="modal">
		<h2 class="text-center">A11y-approved modals</h2>
		<Modal>
			<svelte:fragment slot="prompt">Open modal</svelte:fragment>
			<svelte:fragment slot="modal-content">
				<h1>hello world!</h1>
				<p>Click the X or anywhere outside of the modal to close.</p>
			</svelte:fragment>
		</Modal>
	</section>

	<section id="charts">
		<h2 class="text-center">Chart templates</h2>
		<p class="leading-none">
			Scroll for more<i class="pl-2 fas fa-arrow-right font-thin align-middle" />
		</p>
		<Carousel>
			{#each charts as { component, props }}
				<div>
					<svelte:component this={component} {...props} />
				</div>
			{/each}
		</Carousel>
	</section>

	<section id="ai2html">
		<figure>
			<figcaption>
				<h2 class="text-center">Built-in ai2html</h2>
				<p class="mb-1">Custom sizes can be created in the .ai file as artboards.</p>
			</figcaption>
			<Ai2html />
		</figure>
	</section>

	<section id="scrollytelly">
		<h2 class="text-center">Scrollytelly via svelte-scroller</h2>
		<Scrolly />
	</section>
</article>
