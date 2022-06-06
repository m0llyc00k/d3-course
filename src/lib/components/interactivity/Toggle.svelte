<!-- 
  @component A checkbox/switch input that wields a true/false anatomy to highlight active states. Update the toggle color in the data:image below via the fill attribute
 -->
<script>
	// specific ID for this toggle (a11y)
	export let id = '';

	// left string, when not checked
	export let left = 'False';

	// right string, when checked
	export let right = 'True';

	// use bind:checked + reactive var when using this component
	export let checked = true;

	// conditional disable
	export let disabled = false;

	// if toggle is shown in html2canvas screenshots
	export let ignore = true;

	// additional classes to add
	export let classes = '';
</script>

<div
	class="form-check form-switch inline-block {classes}"
	class:pointer-events-none={disabled}
	class:opacity-40={disabled}
	data-html2canvas-ignore={ignore}
>
	<label
		class="form-check-label text-sm text-gray-800 inline-flex items-center gap-x-2 cursor-pointer select-none"
		for="toggle-{id}"
	>
		<span class:text-gray-400={checked}>{left}</span>
		<input
			class="form-check-input appearance-none w-9 rounded-full h-5 align-top bg-no-repeat focus:outline-none cursor-pointer transition-[background-position] ease-out duration-300 bg-white border-black bg-auto bg-left checked:bg-auto checked:bg-right checked:bg-white checked:border-black focus:ring-primary focus:bg-white focus:border-black checked:focus:bg-white checked:focus:border-black checked:hover:bg-white checked:hover:border-black"
			type="checkbox"
			role="switch"
			id="toggle-{id}"
			{disabled}
			bind:checked
		/>
		<span class:text-gray-400={!checked}>{right}</span>
	</label>
</div>

<style lang="postcss">
	input[type='checkbox'] {
		background-image: url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%22-4%20-4%208%208%22%3E%3Ccircle%20r=%223%22%20stroke=%22%23FFFFFF%22%20fill=%22%23000000%22%20/%3E%3C/svg%3E');
	}
</style>
