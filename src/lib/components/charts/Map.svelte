<script>
	// TODO: give data props to pass to tie in values to paths
	// TODO: generalize design + classes to pass
	import { geoPath, geoAlbersUsa } from 'd3';
	import { feature } from 'topojson-client';
	import { raise } from 'layercake';
	import topojson from '$lib/data/cartography/states.topojson.json';

	let containerWidth = 300;
	const heightWidthProportion = 0.585;
	const viewboxDims = [960, 960 * heightWidthProportion];

	const geojson = feature(topojson, topojson.objects.collection);
	const projectionFn = geoAlbersUsa().fitSize(viewboxDims, geojson);
	const geoPathFn = geoPath(projectionFn);
</script>

<div
	class="w-full"
	style:height="{containerWidth * heightWidthProportion}px"
	bind:clientWidth={containerWidth}
>
	<svg
		class="w-full h-full mx-auto overflow-visible viz-container"
		viewbox="0 0 {viewboxDims[0]} {viewboxDims[1]}"
	>
		<g>
			{#each geojson.features as feature}
				<path
					class="fill-secondary stroke-1 stroke-background hover:stroke-primary"
					d={geoPathFn(feature)}
					on:mouseover={(e) => raise(e.target)}
					on:focus={(e) => raise(e.target)}
				>
					<title>{feature.properties.name}</title>
				</path>
			{/each}
		</g>
	</svg>
</div>
