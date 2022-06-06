<!-- 
  @component The head of a given page, including meta, scripts and style tags
 -->
<script>
	import { page } from '$app/stores';

	// Page URL
	$: url = `${$page.url}`;

	let pageTitle = '';
	let metaTitle = '';
	let description = '';
	let image = $page.url.origin + '/images/social-share.png';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="title" content={metaTitle} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={metaTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
</svelte:head>
