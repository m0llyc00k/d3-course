<!-- inspired by https://github.com/janosh/svelte-bricks -->
<script>
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';

	/** @type {Number} [nCols={2}] - number of columns */
	export let nCols = 2; // Could find programatically via Math.min(items.length, Math.floor(width / (minColWidth + gap)) || 1);

	/** @type {Number} [bind:width={masonryWidth}] - masonry container's client width */
	export let width = 0;

	/** @type {Number} [bind:height={masonryHeight}] - masonry container's client height */
	export let height = 0;

	/** @type {Array} [items={[]}] - items to feed the layout */
	export let items = [];

	/** @type {String} [style=`background:red;border:1px solid thistle;`] - inline style tags fed to parent container */
	export let style = '';

	/** @type {Number} [duration={200}] - duration of transition + flip. If false or 0, animations will not play */
	export let duration = 200;

	/** @type {String} [columnClass='bg-red scale-125'] - classes to pass to each column container */
	export let columnClass = ``;

	let className = ``;
	/** @type {String} [class='bg-red scale-125'] - classes to pass to the parent container */
	export { className as class };

	/** @type {String|Function} [id={(item) => item.id}] - string or function to find unique identifier for keyed each blocks. Default to item itself if it is a string or number */
	export let id = (item) => {
		if (['string', 'number'].includes(typeof item)) return item;
		return item.id;
	};

	$: getId = (item) => (typeof id === `function` ? id(item) : item[id]);

	$: columns = items.reduce(
		(cols, item, i) => {
			cols[i % cols.length].push([item, i]);
			return cols;
		},
		Array.from({ length: nCols }, () => [])
	);
</script>

<div
	class="masonry flex w-full box-border {className}"
	{style}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	{#each columns as col}
		<div class="col grid h-max w-full {columnClass}">
			{#if duration}
				{#each col as [item, i] (getId(item))}
					<div
						in:fly|local={{ duration, y: -5 }}
						out:fly|local={{ duration, y: -5 }}
						animate:flip={{ duration }}
					>
						<slot {i} {item} />
					</div>
				{/each}
			{:else}
				{#each col as [item, i] (getId(item))}
					<div>
						<slot {i} {item} />
					</div>
				{/each}
			{/if}
		</div>
	{/each}
</div>

<style>
	.masonry,
	.col {
		gap: var(--gap, 12px);
	}
	.masonry {
		overflow-wrap: anywhere;
	}
	.col {
		max-width: var(--max-col-width, 100%);
	}
</style>
