<!-- 
  @component A basic scrollytelly template that accepts two slots for a background and foreground, built off a scrollytelly helper from Rich Harris & Svelte (https://github.com/sveltejs/svelte-scroller)
	@slot background - The fixed background node - typically a graphic
	@slot foreground - copy or other content that scrolls as steps
 -->
<script>
	import Scroller from '@sveltejs/svelte-scroller';
	let index;
	let progress;
</script>

<Scroller top={0} bottom={1} threshold={0.5} bind:index bind:progress>
	<svelte:fragment slot="background">
		<div
			id="scroller-background"
			class="w-100 h-screen flex flex-col justify-center items-center px-4 transition-colors duration-1000 ease-linear"
			class:bg-red-300={!index}
			class:bg-green-300={index === 1}
			class:bg-blue-300={index === 2}
		>
			<h2 class="text-primary text-4xl font-bold uppercase">
				Step {index}
			</h2>
			<div class="w-full block mt-4 bg-gray-100 border border-primary">
				<span
					class="block w-full bg-primary h-4 max-w-full"
					style:width="{(progress || 0) * 100}%"
				/>
			</div>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="foreground">
		{#each Array.from({ length: 3 }) as _, i}
			<section
				class="flex flex-wrap flex-row items-center h-[80vh] last-of-type:h-screen mx-auto opacity-40 transition ease-in duration-300 step"
				class:opacity-100={i === index}
			>
				<div class="bg-white border border-primary w-100 shadow-lg rounded-sm w-full px-4 py-3">
					<p class="my-2 text-base text-left w-full">
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus ea provident delectus
						molestias accusantium. Quibusdam quos neque veritatis, magnam sit blanditiis vitae id
						iusto, dolor, sunt cumque incidunt. Neque, eum?
					</p>
				</div>
			</section>
		{/each}
	</svelte:fragment>
</Scroller>
