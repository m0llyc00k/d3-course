<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				errMessage: `${status}: ${error.message}`
			}
		};
	}
</script>

<script>
	export let errMessage = '';
	console.log(errMessage);
</script>

<section class="h-[50vh] mb-8 flex w-full justify-center items-center text-center">
	<article>
		<h1 class="text-6xl font-bold">Page Not Found</h1>
		<p class="my-0">
			The page or file you were looking for could not be found. Please let us know!
		</p>
	</article>
</section>
