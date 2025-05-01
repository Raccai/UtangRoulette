<script>
  import { goto } from "$app/navigation";
  import { page } from '$app/stores'; 
  import { onMount, createEventDispatcher } from "svelte";

  import History from "../assets/images/History.png";
  import Roulette from "../assets/images/Roulette.png"; 
  import Achievements from "../assets/images/Medal.png";

  const dispatch = createEventDispatcher();

  function goToHome() {
    goto("/home");
  }

  function goToHistory() {
    goto("/history");
  }

  function goToAchievements() {
    goto("/achievements");
  }

  $: currentPath = $page.url.pathname;

  onMount(() => {
      // Dispatch event when navbar considers itself ready
      // Using setTimeout ensures it happens after initial render
      setTimeout(() => {
           console.log("Navbar dispatching ready event");
           dispatch('ready');
      }, 0);
  });
</script>

<nav>
  <button
    class="nav-button"
    class:active={currentPath === '/home'}  
    on:click={goToHome}
    aria-label="Home / Spin"
  >
    <img src={Roulette} alt="Home Roulette Page" class="nav-icon home-icon">
    <span>SPIN</span> 
  </button>

  <button
    class="nav-button"
    class:active={currentPath === '/history'}
    on:click={goToHistory}
    aria-label="History"
  >
    <img src={History} alt="History Page" class="nav-icon history-icon">
    <span>HISTORY</span> 
  </button>

  <button
    class="nav-button"
    class:active={currentPath === '/achievements'}
    on:click={goToAchievements}
    aria-label="Achievements"
  >
    <img src={Achievements} alt="Achievements Page" class="nav-icon achievements-icon">
    <span>AWARDS</span> 
  </button>
</nav>

<style>
  nav {
    display: grid; /* Use grid for equal spacing */
    grid-template-columns: repeat(3, 1fr); /* 4 equal columns */
    align-items: stretch; /* Make buttons fill height */
    height: 80px; /* Increased height to match reference */
    width: 100vw;
    background: var(--jeep-red, #A13012);
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 4px solid #1c1c1c; /* Thinner top border */
    z-index: 999;
  }

  .nav-button {
    background: none;
    border: none;
    padding: 4px 0; /* Adjust padding */
    margin: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column; /* Stack icon and text */
    justify-content: center;
    align-items: center;
    height: 100%;
    transition: background-color 0.2s ease, border-top 0.2s ease;
    position: relative; /* For potential pseudo-elements */
    border-top: 4px solid transparent; /* Placeholder for active border */
    color: var(--jeep-cream, #FDFCDC); /* Base color for text */
    font-family: var(--font-display, 'Archivo Black'); /* Match body font */
    font-size: 0.7rem; /* Smaller text */
    gap: 2px; /* Space between icon and text */
  }

  /* Active state style */
  .nav-button.active {
    background-color: rgba(0, 0, 0, 0.15); /* Subtle dark overlay */
    border-top: 4px solid var(--jeep-yellow, #FFC107); /* Yellow top border when active */
  }
  .nav-button:hover:not(.active) {
    background-color: rgba(255, 255, 255, 0.08); /* Slight hover effect */
  }
  .nav-button:active {
    transform: translateY(1px); /* Simple press effect */
  }

  .nav-icon {
    display: block;
    height: 35px; /* Fixed height for icons */
    width: auto; /* Let width adjust */
    object-fit: contain;
    margin-bottom: 2px; /* Space below icon */
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.4));
  }

  .history-icon {
    height: 32px;
  }
   .achievements-icon {
    height: 38px;
  }

  /* Style for the text label */
  .nav-button span {
    text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
    line-height: 1;
  }

</style>