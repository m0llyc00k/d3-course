<!-- 
  @component A tooltip wrapper sensitive to the cursor placement. Can either be fixed to a node by passing the parentContainer as a node or to the window if parentContainer does not exist.
	@slot - the inner content of the tooltip
 -->
<script>
	export let margin = 10;
	export let tooltipMap = false;
	export let parentContainer = false; // pass a node if you want to bind tooltip to the node's dimensions

	let left = 0;

	let pageWidth = 300;
	let tipWidth = 0; // width of the tooltip
	let cursor = { x: 0, y: 0 }; // cursor pos

	const mousemove = (e) => {
		// find where the cursor is
		cursor = { x: e.clientX, y: e.clientY };
	};

	// fixed positioning calculation
	$: reflectionX = parentContainer
		? parentContainer.offsetLeft + parentContainer.offsetWidth / 2
		: pageWidth / 2;
	$: left = cursor.x < reflectionX ? cursor.x + margin : cursor.x - margin - tipWidth;
	$: top = cursor.y + margin;
</script>

<svelte:window on:mousemove={mousemove} bind:innerWidth={pageWidth} />
{#if tooltipMap}
	<div
		class="font-regular pointer-events-none fixed z-40 w-auto max-w-[200px] rounded-sm border border-primary bg-white px-2 py-1 text-left text-base text-primary shadow-md"
		style="left:{left}px;top:{top}px;"
		bind:offsetWidth={tipWidth}
	>
		<slot />
		<p class="text-xs">click for details</p>
	</div>
{/if}
