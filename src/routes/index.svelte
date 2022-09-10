<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
</script>

<script>
	import Map from '$lib/components/charts/Map.svelte';

	let title = 'Mapping Vulnerability in the Opioid Crisis';
	let subtitle =
		'Using attribute clustering to determine the risk status of US counties based on opioid pill distribution, overdose death rates, and the availability of medication-assisted treatment (MAT).';

	const mapURL =
		'https://raw.githubusercontent.com/m0llyc00k/Summer2022/main/county-state-analysis.json';
</script>

<article class="content-well pt-4 text-center prose-headings:text-primary">
	<header class="mb-0">
		<h1 class="text-4 mx-auto font-bold sm:text-3xl">{title}</h1>
		<h2 class="sm:text-md mx-auto max-w-3xl pt-2 pb-0">{subtitle}</h2>
	</header>
	<Map />
</article>
