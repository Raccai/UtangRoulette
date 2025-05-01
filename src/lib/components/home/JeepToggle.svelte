<script>
  import { createEventDispatcher } from 'svelte';

  export let mode = 'mayUtang'; // Bound value ('mayUtang' or 'nagbibigayNgUtang')
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function handleTrackClick() {
    if (disabled) return;
    // Notify parent about the change attempt, let parent handle state change
    dispatch('toggle');
  }

  // Handle clicks on labels too, ensure state updates
  function setMode(newMode) {
    if (!disabled) {
      mode = newMode; // Update local prop which should be bound by parent
    }
  }
</script>

<div class="jeep-toggle" class:disabled>
  <button
    type="button"
    class="jeep-toggle-label"
    class:active={mode === 'mayUtang'}
    on:click={() => setMode('mayUtang')}
    disabled={disabled}
    aria-pressed={mode === 'mayUtang'}
  >
    May Utang
  </button>

  <div
    class="toggle-track"
    on:click={handleTrackClick}
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrackClick();
      }
    }}
    role="button"
    tabindex={disabled ? -1 : 0}
    aria-label="Toggle Mode"
  >
    <div class="toggle-selector" class:active={mode === 'nagbibigayNgUtang'}></div>
  </div>

  <button
    type="button"
    class="jeep-toggle-label"
    class:active={mode === 'nagbibigayNgUtang'}
    on:click={() => setMode('nagbibigayNgUtang')}
    disabled={disabled}
    aria-pressed={mode === 'nagbibigayNgUtang'}
  >
    Ako Naman!
  </button>

  <!-- Optional: keep inputs if needed for accessibility or form state -->
  <input type="radio" name="modeToggleJeep" value="mayUtang" bind:group={mode} hidden>
  <input type="radio" name="modeToggleJeep" value="nagbibigayNgUtang" bind:group={mode} hidden>
</div>

<style>
    /* --- JEEPNEY TOGGLE STYLES --- */
    .jeep-toggle { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      margin-top: 1.5rem; 
      gap: 0.5rem; 
      user-select: none; 
    }
    .jeep-toggle-label { 
      color: var(--jeep-cream, #FDFCDC); 
      font-size: 0.85rem; 
      font-weight: bold; 
      opacity: 0.6; 
      transition: opacity 0.3s, color 0.3s; 
      cursor: pointer; 
      padding: 5px; 
      position: relative; 
    }
    .jeep-toggle-label.active { 
      opacity: 1.0; 
      color: var(--jeep-yellow, #FFC107); 
    }
    .toggle-track { 
      width: 80px; 
      height: 30px; 
      background-color: var(--metal-gray, #9a9a9a); 
      border-radius: 15px; 
      border: 1px solid var(--dark-metal, #444); 
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.4); 
      position: relative; 
      cursor: pointer; 
      display: flex; 
      align-items: center; 
      transition: background-color 0.2s; 
    }
    .toggle-track:hover:not(.disabled-track) { 
      background-color: #a9a9a9; 
    } 
    .toggle-track::before, .toggle-track::after { 
      content: ''; 
      position: absolute; 
      width: 6px; 
      height: 6px; 
      background-color: var(--dark-metal, #444); 
      border-radius: 50%; 
      top: 50%; 
      transform: translateY(-50%); 
      box-shadow: inset 0 1px 1px rgba(0,0,0,0.5); 
    }
    .toggle-track::before { 
      left: 5px; 
      z-index: 0; 
    }
    .toggle-track::after { 
      right: 5px; 
      z-index: 0; 
    }
    .toggle-selector { 
      position: absolute; 
      width: 36px; 
      height: 22px; 
      background-color: var(--jeep-red, #9D2C0E); 
      border-radius: 11px; 
      border: 1px solid #6f1f0a; 
      top: 50%; 
      transform: translateY(-50%); 
      left: 4px; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.5); 
      transition: left 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); 
      pointer-events: none; 
      z-index: 1; 
    }
    .toggle-selector.active { 
      left: calc(100% - 36px - 4px); 
    }

    /* Disabled styles */
    .jeep-toggle.disabled .jeep-toggle-label { 
      cursor: not-allowed; 
      opacity: 0.5 !important; 
      color: #aaa !important; 
    }
    .jeep-toggle.disabled .toggle-track { 
      opacity: 0.5; 
      cursor: not-allowed; 
      background-color: #777 !important; 
    }
    .jeep-toggle.disabled .toggle-selector { 
      background-color: #555 !important; 
      border-color: #333; 
    }

    /* Add disabled class for simpler CSS targeting */
    /* .disabled-track {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: #777 !important;
    } */
</style>