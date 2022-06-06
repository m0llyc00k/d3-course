<!-- 
	@component
	Static treemap generator based on https://observablehq.com/@d3/treemap
 -->
<script>
	import {
		descending,
		InternSet,
		scaleLinear,
		scaleOrdinal,
		stratify,
		treemapSliceDice,
		hierarchy,
		treemap
	} from 'd3';

	export let data = [];
	export let height = 300;
	export let path = null;
	export let id = Array.isArray(data) ? (d) => d.id : null;
	export let parentId = Array.isArray(data) ? (d) => d.parentId : null;
	export let value = (d) => d.value;
	export let label = (d) => d.name;
	export let group = null;
	export let zDomain = null;
	export let colors = ['#234C5E', '#00CCB3', '#fcd34d', '#fef3c7'];
	export let fill = '#234C5E';
	export let tile = treemapSliceDice;
	export let paddingOuter = 0;
	export let paddingInner = 0;
	export let strokeLineJoin = 'round';
	export let showLabel = true;
	export let rectCornerRadius = 0;
	export let rectClasses = '';

	// If id and parentId options are specified, or the path option, use d3.stratify to convert tabular data to a hierarchy; otherwise we assume that the data is specified as an object {children} with nested objects (a.k.a. the 'flare.json' format), and use d3.hierarchy.
	const root =
		path != null
			? stratify().path(path)(data)
			: id != null || parentId != null
			? stratify().id(id).parentId(parentId)(data)
			: hierarchy(data)
					.sum((d) => value(d))
					.sort((a, b) => descending(value(a), value(b)));

	// Compute the values of internal nodes by aggregating from the leaves.
	value == null ? root.count() : root.sum((d) => Math.max(0, value(d)));

	const leaves = root.leaves();

	const G = group == null ? null : leaves.map((d) => group(d.data, d));
	if (zDomain === undefined) zDomain = G;
	zDomain = new InternSet(zDomain);
	const color = group == null ? null : scaleOrdinal(zDomain, colors);

	// calculate treemap on root
	treemap().tile(tile).paddingInner(paddingInner).paddingOuter(paddingOuter).round(false)(root);

	let width = 500;

	$: xScale = scaleLinear().domain([0, 1]).range([0, width]);

	$: yScale = scaleLinear().domain([0, 1]).range([0, height]);
</script>

<div class="w-full" style:height="{height}px" bind:clientWidth={width}>
	<svg class="w-full h-full overflow-hidden">
		{#each leaves as node, i (node)}
			{@const x = xScale(node.x0)}
			{@const y = yScale(node.y0)}
			{@const w = xScale(node.x1) - xScale(node.x0)}
			{@const h = yScale(node.y1) - yScale(node.y0)}
			<g transform="translate({x},{y})">
				<rect
					width={w}
					height={h}
					fill={color ? color(G[i]) : fill}
					stroke-linejoin={strokeLineJoin}
					class={rectClasses}
					rx={rectCornerRadius}
					ry={rectCornerRadius}
				/>
				<title>{label(node.data)}</title>
				{#if showLabel}
					<text class="fill-primary text-xs" y="14px" x="8px">{label(node.data)}</text>
				{/if}
			</g>
		{/each}
	</svg>
</div>
