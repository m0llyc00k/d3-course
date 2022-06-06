<div
	class="carousel relative w-full flex gap-6 items-center snap-x snap-mandatory overflow-x-auto pb-4"
>
	<slot>
		<div>Hello world!</div>
	</slot>
</div>

<style lang="postcss">
	.carousel::-webkit-scrollbar {
		@apply h-2;
	}
	.carousel::-webkit-scrollbar-thumb {
		@apply bg-secondary rounded-xl;
	}
	.carousel::-webkit-scrollbar-track {
		@apply bg-secondary-light mx-2 rounded-xl sm:mx-6;
	}
	.carousel > :global(*) {
		@apply w-full snap-center shrink-0 first:pl-8 last:pr-8;
	}
</style>
