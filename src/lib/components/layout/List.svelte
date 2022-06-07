<script>
	export let list = [];
</script>

<div class="columns-1 pt-12">
	{#each list as county}
		<div class="text-lg">{county}</div>
	{/each}
</div>
