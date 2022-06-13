<!-- 
  @component An a11y-safe modal that wields body-scroll-lock and focus-trap to create a sandboxed modal (that could also be used as a side nav panel)
	@slot prompt - The inner content of a button element, most simply a string
	@slot modal-content - The inner content of the modal, inside of the outer backdrop and wrapper
 -->
<script>
	import { cubicOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { beforeNavigate } from '$app/navigation';
	import clickOutside from '$lib/actions/clickOutside';
	import { createFocusTrap } from 'focus-trap';
	import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
	import { object_without_properties } from 'svelte/internal';

	let trap;
	let modalEl;
	export let isModalOpen = false;
	export let legendStatusData = [];
	export let counties = [];
	export let border = 'black';

	console.log(legendStatusData);
	console.log(counties);

	// close menu before navigating
	beforeNavigate(() => (isModalOpen = false));
	$: if (isModalOpen && modalEl) {
		trap = createFocusTrap(modalEl);
		trap.activate();
		disableBodyScroll(modalEl, { reserveScrollBarGap: true });
	} else {
		if (trap) trap.deactivate();
		clearAllBodyScrollLocks();
	}
</script>

{#if isModalOpen}
	<div
		class="fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center z-50 backdrop-blur-sm"
		bind:this={modalEl}
	>
		<div
			class="absolute w-full h-full left-0 top-0 bg-black-light opacity-20 z-0"
			aria-hidden="true"
		/>
		<div use:clickOutside on:outclick={() => (isModalOpen = false)}>
			<article
				class="min-w-1/2 bg-background border-4 border-{border} relative z-50 flex flex-wrap flex-col justify-center items-start max-w-2xl"
				in:scale={{ duration: 300, easing: cubicOut }}
			>
				<div class="flex w-full justify-end mb-2">
					<button
						class="p-2 leading-none my-0 text-primary rounded-bl-md overflow-hidden hover:bg-primary hover:text-background"
						on:click={() => (isModalOpen = false)}
					>
						<i class="fas fa-times" />
					</button>
				</div>
				<section class="px-8 pb-6 my-2">
					<slot name="modal-content" />
				</section>
			</article>
		</div>
	</div>
{/if}
