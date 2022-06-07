<!-- 
  @component A tooltip wrapper sensitive to the cursor placement. Can either be fixed to a node by passing the parentContainer as a node or to the window if parentContainer does not exist.
	@slot - the inner content of the tooltip
 -->
<script>
	export let margin = 10;
	export let tooltip = false;
	export let parentContainer = false; // pass a node if you want to bind tooltip to the node's dimensions

	let left = 0;
	let pageWidth = 300;
	let tipWidth = 0; // width of the tooltip
	let cursor = { x: 0, y: 0 }; // cursor pos

	const mousemove = (e) => {
		// ignore if no tooltip instance is active
		if (!tooltip) return;
		// find where the cursor is
		cursor = { x: e.pageX, y: e.pageY };
	};

	// fixed positioning calculation
	$: reflectionX = parentContainer
		? parentContainer.offsetLeft + parentContainer.offsetWidth / 2
		: pageWidth;
	$: left = cursor.x < reflectionX ? cursor.x + margin : cursor.x - margin - tipWidth;
	$: top = cursor.y + margin;
</script>

<svelte:window on:mousemove={mousemove} bind:innerWidth={pageWidth} />
{#if tooltip}
	<div
		class="bg-white text-primary fixed border border-primary rounded-sm shadow-md text-left px-2 py-1 z-40 pointer-events-none text-base font-regular max-w-[200px] w-auto"
		style="left:{left}px;top:{top}px;"
		bind:offsetWidth={tipWidth}
	>
		<slot />
		<p class="text-xs">click for details</p>
	</div>
{/if}
