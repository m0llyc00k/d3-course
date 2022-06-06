<script>
	// TODO: give data props to pass to tie in values to tile
	// TODO: generalize design + classes to pass
	import states from '$lib/data/cartography/states.json';
	const stateIdxMap = new Map(states.map((state) => [state.idx, state]));

	let size = 25;
</script>

<div class="grid grid-cols-11 grid-rows-[repeat(8,_minmax(0,_1fr))] gap-0.5">
	<!-- 11 * 8 small multiple cartogram -->
	{#each Array.from({ length: 11 * 8 }) as _, i}
		{@const state = stateIdxMap.get(i) || false}
		<!-- first tile that isn't filled -->
		{#if i === 1}
			<div bind:clientWidth={size} style:height="{size}px" aria-hidden="true" />
		{:else if state}
			<div
				class="relative overflow-hidden flex justify-center items-center pointer-events-auto bg-secondary rounded-sm"
				style:height="{size}px"
			>
				<span class="text-sm font-sans p-0 m-0 text-center text-primary">
					{state.postal}
				</span>
				<slot name="tile" />
			</div>
		{:else}
			<div class="pointer-events-none" style:height="{size}px" aria-hidden="true" />
		{/if}
	{/each}
</div>
