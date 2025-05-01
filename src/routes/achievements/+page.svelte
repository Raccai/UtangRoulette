<script>
  // Import store helpers and the locked icon image
  import { achievementStore, spinCount, lockedIcon, formatAchievementKey } from "$lib/stores/achievementsStore";

  // Import the title image
  import AchievementsTitle from "../../lib/assets/images/AchievementsTitle.png";
  import { fade, fly } from 'svelte/transition';

  // --- Reactive variable for achievement data ---
  // Ensure $achievementStore is accessed reactively
  // Filter out internal keys like spinCount
  // Provide default {} to avoid errors if store is initially null/undefined
  $: achievementData = $achievementStore || {};
  $: achievementEntries = Object.entries(achievementData).filter(([key]) => key !== 'spinCount');

</script>

<div class="achievements-page themed-container" transition:fly|fade={{ y: 200, duration: 400 }} >
  <!-- Use the imported Title Image -->
  <img src={AchievementsTitle} alt="Achievements Title" class="page-title-image">

  <!-- Check if the store has loaded and has data -->
  {#if $achievementStore === undefined || $achievementStore === null}
    <p class="loading-text">Loading Store...</p>
  {:else if achievementEntries.length > 0}
    <div class="achievements-grid-container">
      <div class="achievements-grid">
        {#each achievementEntries as [key, data], i (key)}
          <div
            class="badge animate-in"
            class:unlocked={data.unlocked}
            class:locked={!data.unlocked}
            title={data.unlocked ? `${data.name}: ${data.description}` : 'Locked Achievement'}
            style="--animation-delay: {i * 0.06}s;"
          >
            {#if data.unlocked}
              <div class="unlocked-shine"></div>
            {/if}
            <div class="badge-content">
              <div class="badge-image-container">
                <img
                  src={data.unlocked ? data.image : lockedIcon}
                  alt={data.unlocked ? data.name : 'Locked'}
                  class="badge-image"
                  loading="lazy"
                />
              </div>
              <div class="badge-text-container">
                <span class="badge-text">
                  {#if data.unlocked}{data.name}{:else}???{/if}
                </span>
                {#if data.unlocked}
                  <span class="badge-description">{data.description}</span>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Message when store is loaded but no achievements (except spinCount) exist -->
    <p class="loading-text">Spin the wheel to unlock achievements!</p>
  {/if}

  <!-- Display spin count, check if $spinCount is defined -->
  {#if $spinCount !== undefined && $spinCount !== null}
    <p class="spin-counter">Total Spins Recorded: {$spinCount}</p>
  {/if}
</div>

<style>
  /* Assumes :root vars and fonts are loaded globally */
  @keyframes subtle-stars {
    0% { background-position: 0 0; }
    100% { background-position: 100px 200px; }
  }

  .themed-container {
    /* background-color: none; */ /* Removed as requested */
    position: absolute;
    padding: 2rem;
    box-sizing: border-box;
    font-family: var(--font-body, 'Archivo Black', sans-serif);
    height: calc(100vh - 80px); 
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    /* Animated star pattern */
    background-image:
      radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), /* Slightly less visible */
      radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px, 80px 80px;
    background-position: 0 0, 40px 40px;
    animation: subtle-stars 70s linear infinite; /* Even slower */
  }

  /* --- Title Image Styling --- */
  .page-title-image {
    display: block; /* Remove extra space below image */
    width: 100%; /* Take container width */
    max-width: 380px; /* Limit max size */
    height: auto; /* Maintain aspect ratio */
    margin-bottom: 2.5rem; /* Space below title */
    object-fit: contain; /* Ensure image fits without stretching */
    filter: drop-shadow(3px 3px 3px rgba(0,0,0,0.5)); /* Subtle shadow */
  }

  .achievements-grid-container {
    width: 100%;
    max-width: 950px;
    margin: 0 auto;
    padding: 1rem;
    border-radius: 15px;
    flex-grow: 1;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  /* --- Badge Entry Animation --- */
  @keyframes badge-entry-anim {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .badge {
    background-color: var(--metal-gray, #777);
    color: #ccc;
    border: 3px solid var(--dark-metal, #444);
    border-radius: 10px;
    padding: 0;
    font-family: var(--font-body, 'Archivo Black', sans-serif);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 180px;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.4), 0 2px 3px rgba(0,0,0,0.3);
    transition: transform 0.3s ease-out, background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
    cursor: default;
    text-align: center;
    position: relative;
    overflow: hidden;
    opacity: 0; /* Start hidden */
    animation: badge-entry-anim 0.6s ease-out forwards;
    animation-delay: var(--animation-delay, 0s);
  }

  /* Enhanced Hover */
  .badge:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: inset 0 0 6px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.45);
  }

  /* Inner content wrapper */
  .badge-content {
    padding: 0.75rem; 
    width: 100%; 
    height: 100%; 
    display: flex;
    flex-direction: column; 
    align-items: center; 
    justify-content: flex-start;
    position: relative; 
    z-index: 2; 
    box-sizing: border-box;
  }

  .badge-image-container {
    width: 70px; 
    height: 70px; 
    margin-bottom: 0.75rem; 
    border-radius: 10px;
    overflow: hidden; 
    border: 3px solid rgba(0,0,0,0.3); 
    background-color: rgba(0,0,0,0.2);
    flex-shrink: 0; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    position: relative; 
    z-index: 1;
  }
  .badge-image { 
    display: block; 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    filter: grayscale(1); 
    opacity: 0.6; 
    transition: filter 0.3s ease, opacity 0.3s ease; 
  }

  .badge.unlocked .badge-image-container {
    border: none; 
    background-color: transparent; 
  }
  .badge.unlocked .badge-image { 
    filter: grayscale(0); 
    opacity: 1; 
  }

  .badge-text-container { 
    display: flex; 
    flex-direction: column; 
    align-items: center; }
  .badge-text { 
    display: block; 
    font-weight: bold; 
    font-size: 1rem; 
    line-height: 1.2; 
    margin-bottom: 0.25rem; 
  }
  .badge-description { 
    font-size: 0.75rem; 
    line-height: 1.3; 
    opacity: 0.8; 
    max-width: 95%; 
    color: inherit; 
  }

  .badge.unlocked { 
    background-color: var(--jeep-green, #386641); 
    color: var(--jeep-cream, #FDFCDC); 
    border-color: var(--jeep-yellow, #FFC107); 
  }
  .badge.locked .badge-text { 
    color: #aaa; 
  }

  /*Assign different background colors */
  .badge.unlocked:nth-of-type(6n + 1) { background-color: var(--jeep-red, #9D2C0E); }
  .badge.unlocked:nth-of-type(6n + 2) { background-color: var(--jeep-yellow, #FFC107); color: #333; }
  .badge.unlocked:nth-of-type(6n + 3) { background-color: var(--jeep-teal, #4D7C8A); }
  .badge.unlocked:nth-of-type(6n + 4) { background-color: var(--jeep-green, #386641); }
  .badge.unlocked:nth-of-type(6n + 5) { background-color: var(--jeep-blue-light, #61A8C6); }
  .badge.unlocked:nth-of-type(6n + 0) { background-color: var(--jeep-orange, #E57C23); }


  .badge.unlocked:hover {
    box-shadow: inset 0 0 8px rgba(255,255,255,0.3), 0 6px 12px rgba(0,0,0,0.35), 0 0 12px var(--jeep-yellow);
    transform: translateY(-4px) scale(1.03);
  }

  /* --- Animated Shine Effect --- */
  @keyframes subtle-shine-anim {
    0% {
      /* Start completely off the left side */
      transform: translateX(-200%) skewX(-20deg);
      opacity: 0.6; /* Start slightly faded */
    }
    /* Add a midpoint for brightness */
    50% {
      opacity: 0.9;
    }
    100% {
      /* End completely off the right side */
      /* Needs to be at least 100% (badge width) + 100% (shine width) */
      /* Using 210% gives extra buffer */
      transform: translateX(1010%) skewX(-20deg);
      opacity: 0.6; /* Fade slightly at end */
    }
  }

  .unlocked-shine {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50px; /* Wider beam */
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.18) 50%, /* Fainter shine */
      rgba(255, 255, 255, 0) 100%
    );
    /* Removed initial opacity, control in keyframes */
    z-index: 1;
    pointer-events: none;
    animation: subtle-shine-anim 4.5s ease-in-out infinite;
    animation-delay: calc(var(--animation-delay, 0s) + 1s);
  }

  .spin-counter {
    text-align: center;
    margin-top: auto; 
    padding-top: 2rem; 
    padding-bottom: 1rem;
    color: var(--jeep-cream); 
    opacity: 0.8; 
    font-size: 0.9rem; 
    flex-shrink: 0;
  }

  .loading-text {
    text-align: center; 
    color: var(--jeep-cream); 
    font-size: 1.2rem;
    padding: 2rem; 
    margin: auto;
  }

  /* --- Reduced Motion --- */
  @media (prefers-reduced-motion: reduce) {
    .badge, .themed-container, .unlocked-shine {
      animation: none !important;
      transition: none !important;
    }

    .badge:hover { 
      transform: none; 
    }

    .badge.unlocked:hover { 
      transform: none; 
      box-shadow: inset 0 0 6px rgba(0,0,0,0.4), 0 2px 3px rgba(0,0,0,0.3); 
    }
  }
</style>