<script>
	import Meta from '$lib/components/meta/Meta.svelte';
	import Styles from '$lib/components/meta/Styles.svelte';
	import '$lib/styles/app.postcss';
</script>

<Meta />
<Styles />

<main>
	<slot />
</main>
