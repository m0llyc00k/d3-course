<!-- 
  @component Style tags driven from fontAwesome, typekit and google fonts
 -->
<script>
	import { google, fontAwesome, typekit } from '$lib/config.json';

	let googleTag;
	let fontPaths = [];

	google.fonts.weights.forEach((font) => {
		const name = font.name.replace(/\s+/g, '+');
		const fontWeights = [];
		font.weights.forEach((weight) => fontWeights.push(`0,${weight}`));
		font.italics.forEach((weight) => fontWeights.push(`1,${weight}`));
		fontPaths.push(`family=${name}:ital,wght@${fontWeights.join(';')}`);
	});

	googleTag = `
			<link rel="preconnect" href="https://fonts.gstatic.com">
			<link href="https://fonts.googleapis.com/css2?${fontPaths.join('&')}&display=swap" rel="stylesheet">
	`;
</script>

<svelte:head>
	{#if fontAwesome.active}
		<script src="https://kit.fontawesome.com/{fontAwesome.kitId}.js" crossorigin="anonymous">
		</script>
	{/if}

	{#if typekit.active}
		<link rel="stylesheet" href="https://use.typekit.net/{typekit.kitId}.css" />
	{/if}

	{#if google.fonts.active}
		{@html googleTag}
	{/if}

	<!-- TODO: analytics -->
</svelte:head>
