<script>
	// SvelteKit Imports
	import { page } from '$app/stores';
	import { onMount } from 'svelte'; // Needed for client-side initial load logic
	import { get } from 'svelte/store'; // To read store value once

	// Svelte Imports
	import { fly } from 'svelte/transition'; // Import desired transition
	import { goto } from '$app/navigation';

	// Store Imports
	import { isLoading } from '$lib/stores/loadingStore'; // Import loading store

	// Component Imports (adjust paths if necessary)
	import Navbar from '$lib/components/Navbar.svelte';
	import Background from '$lib/components/Background.svelte'; // Your JeepneyBackground component
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'; // Your LoadingScreen component

	// Import global CSS - Make sure this contains your :root variables and font imports
	import '../app.css';

	// Get the children snippet passed by SvelteKit's router (Svelte 5)
	let { children } = $props();

	// Reactive value for the current path (guarded against initial undefined)
	// Used ONLY for the #key block to trigger transitions
	let currentPath = $derived($page.url?.pathname ?? '');

	// --- Manage INITIAL loading state (Client-Side Only) ---
	onMount(() => {
		goto("/home");

        // Check the *current* value of the store synchronously when the component mounts in the browser
        if (get(isLoading)) { // Only proceed if it's currently true (initial load state)
            console.log("[Layout onMount] Initial loading detected. Setting timer to hide...");
            // Set isLoading to false only ONCE after the component mounts on the client
            const timer = setTimeout(() => {
                console.log("[Layout onMount] Hiding initial loading screen.");
                isLoading.set(false);
            }, 1500); // Adjust delay (e.g., 1500ms = 1.5s) for perceived load time / splash feel

            // Cleanup function for the timer if component unmounts before timeout fires
            return () => clearTimeout(timer);
        } else {
             console.log("[Layout onMount] Initial loading screen was already hidden.");
        }
	});

    // Optional: Log isLoading changes for debugging during development
    // $: console.log('isLoading store value:', $isLoading);

</script>

<!-- Outer container needed for stacking context / fixed elements -->
<div class="layout-wrapper">
	<!-- Loading Screen: Conditionally rendered based on the store -->
    <!-- It covers everything when $isLoading is true -->
	{#if $isLoading}
		<LoadingScreen />
	{/if}

    <!-- Background Component: Renders underneath loading screen -->
	<Background />

	<!-- Main App Container: Holds page content and fixed navbar -->
	<div class="app-container">
        <!-- Main area for page content -->
        <main>
					<!-- Render the actual page content snippet inside -->
					{@render children()}
        </main>

        <!-- Fixed Bottom Navbar -->
		<Navbar />
	</div>
</div>

<style>
   :global(body) {
        margin: 0;
        background-color: var(--bg-dark-blue, #1A3A4F); /* Match container BG */
        font-family: var(--font-body, 'Archivo Black', sans-serif); /* Apply base font */
    }

   /* --- Outer Wrapper --- */
   .layout-wrapper {
        position: relative; /* Needed for fixed overlay (LoadingScreen) */
        min-height: 100vh;
   }

   /* --- Main App Container (Below Loading Screen) --- */
   .app-container {
       display: flex;
       flex-direction: column;
       min-height: 100vh;
       position: relative; /* Or static if layout-wrapper handles overlay */
       overflow: hidden; /* Prevent scrollbars caused by transitions */
   }

   /* --- Main Content Area --- */
   main {
       flex-grow: 1;
       padding-bottom: 80px;
       box-sizing: border-box; 
       position: relative; 
       display: flex;
       flex-direction: column;
       /* Remove overflow: hidden from main; let wrapper handle it */
   }
</style>