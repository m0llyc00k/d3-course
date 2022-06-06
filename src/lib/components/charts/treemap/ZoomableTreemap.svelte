<!-- 
	@component
	Zoomable treemap generator based on https://observablehq.com/@d3/treemap. Currently only takes hierarchial data.
 -->
<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { descending, scaleLinear, treemapSliceDice, hierarchy, treemap } from 'd3';
	import { children } from 'svelte/internal';

	export let data = [];
	export let height = 300;
	export let value = (d) => d.value;
	export let label = (d) => d.id;
	export let tile = treemapSliceDice;
	export let paddingOuter = 0;
	export let paddingInner = 0;
	export let fill = '#234C5E';
	export let strokeLineJoin = 'round';
	export let rectCornerRadius = 5;
	export let rectClasses = '';
	export let showLabel = true;

	// If id and parentId options are specified, or the path option, use d3.stratify to convert tabular data to a hierarchy; otherwise we assume that the data is specified as an object {children} with nested objects (a.k.a. the 'flare.json' format), and use d3.hierarchy.
	const root = hierarchy(data)
		.sum((d) => value(d))
		.sort((a, b) => descending(value(a), value(b)));

	// calculate treemap on root
	treemap().tile(tile).paddingInner(paddingInner).paddingOuter(paddingOuter).round(false)(root);

	let width = 500;
	let selected = root;

	const breadcrumbs = (node) => {
		const crumbs = [];
		while (node) {
			crumbs.unshift(label(node.data));
			node = node.parent;
		}
		return crumbs.join('/');
	};

	const select = (node) => {
		while (node.parent && node.parent !== selected) node = node.parent;
		if (node && node.children) selected = node;
	};

	const extents = tweened(undefined, {
		easing: cubicOut,
		duration: 300
	});

	$: $extents = {
		x0: selected.x0,
		x1: selected.x1,
		y0: selected.y0,
		y1: selected.y1
	};

	$: xScale = scaleLinear().domain([$extents.x0, $extents.x1]).range([0, width]);

	$: yScale = scaleLinear().domain([$extents.y0, $extents.y1]).range([0, height]);

	// select children nodes but also keep the sibling nodes of the selected layer to keep object permanence.
	$: nodes = [
		selected.children,
		selected === root ? [] : selected.parent ? selected.parent.children : root.children
	]
		.flat()
		.filter((node) => node !== selected);
</script>

<button
	class="text-left w-full cursor-pointer group disabled:cursor-not-allowed"
	disabled={selected === root}
	on:click={() => (selected = selected.parent)}
>
	<i
		class="fas fa-arrow-left text-xs font-thin align-middle transition-all duration-300 ease-out translate-x-0.5 group-hover:-translate-x-0"
		class:opacity-0={selected === root}
		class:w-0={selected === root}
		class:w-3={selected !== root}
	/>
	<span class="align-middle">{breadcrumbs(selected)}</span>
</button>

<div class="w-full" style:height="{height}px" bind:clientWidth={width}>
	<svg class="w-full h-full overflow-hidden">
		{#each nodes as node, i (node)}
			{@const x = xScale(node.x0)}
			{@const y = yScale(node.y0)}
			{@const w = xScale(node.x1) - xScale(node.x0)}
			{@const h = yScale(node.y1) - yScale(node.y0)}

			<g class="overflow-clip" transform="translate({x},{y})">
				<rect
					width={w}
					height={h}
					{fill}
					stroke-linejoin={strokeLineJoin}
					rx={rectCornerRadius}
					ry={rectCornerRadius}
					class={rectClasses}
					class:cursor-not-allowed={!node.children}
					class:cursor-pointer={node.children}
					on:click={() => select(node)}
				/>
				<title>{label(node.data)}</title>
				{#if showLabel}
					<text class="fill-primary text-xs" y="14px" x="8px">{label(node.data)}</text>
				{/if}
			</g>
		{/each}
	</svg>
</div>
