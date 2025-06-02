<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link
	href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap"
	rel="stylesheet"
/>

<!-- <ModeWatcher /> -->

<div class="box-border flex h-screen w-screen flex-col">
	<Navbar session={$page.data.session} />
	<slot />
	<Footer />

	<Toaster />
</div>
