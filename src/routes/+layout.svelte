<script>
	// SvelteKit Imports
	import { page } from '$app/stores';
	import { onMount } from 'svelte'; 
	import { get } from 'svelte/store'; 
	import { fly } from 'svelte/transition'; 
	import { goto } from '$app/navigation';
    import { SplashScreen } from '@capacitor/splash-screen';

	// Store Imports
	import { isLoading } from '$lib/stores/loadingStore'; 

	// Component Imports 
	import Navbar from '$lib/components/Navbar.svelte';
	import Background from '$lib/components/Background.svelte';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';

	import '../app.css';

	let { children } = $props();
	let currentPath = $derived($page.url?.pathname ?? '');

	onMount(() => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
        
        goto("/home");

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
</script>

<div class="layout-wrapper">
	{#if $isLoading}
		<LoadingScreen />
	{/if}

	<Background />

	<!-- Main App Container: Holds page content and fixed navbar -->
	<div class="app-container">
        <main>
			{@render children()}
        </main>

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
        position: relative; 
        min-height: 100vh;
    }

    /* --- Main App Container (Below Loading Screen) --- */
    .app-container {
       display: flex;
       flex-direction: column;
       min-height: 100vh;
       position: relative; 
       overflow: hidden; 
    }

    /* --- Main Content Area --- */
    main {
       flex-grow: 1;
       padding-bottom: 80px;
       box-sizing: border-box; 
       position: relative; 
       display: flex;
       flex-direction: column;
    }
</style>