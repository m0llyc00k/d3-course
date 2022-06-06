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
	import Modal from '$lib/components/interactivity/Modal.svelte';
	import Tooltip from '$lib/components/interactivity/Tooltip.svelte';

	export let title = '';

	// variable to pass tooltip data
	let tooltip;
	let tooltipContainer;
</script>

<article class="prose prose-headings:text-primary pt-12 content-well text-center">
	<header class="mb-16">
		<h1 class="sm:text-6xl font-bold max-w-lg my-2 mx-auto">{title}</h1>
	</header>

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
</article>
