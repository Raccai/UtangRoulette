<script>
  import { onMount, onDestroy, tick } from 'svelte';

  // Props from parent
  export let items = []; // Array of { name: string, color: string }
  export let result = null; // Winning item { name: string, color: string } passed AFTER spin ends
  export let spinDuration = 4500;

  // Internal state
  let reelElement;
  let windowElement;
  let isVisuallySpinning = false;
  let spinTimeoutId = null;
  let itemHeight = 0; // Calculated internally
  let windowHeight = 0; // Calculated internally
  let centeringOffset = 0; // Calculated internally
  let isReady = false; // Flag for when dimensions are ready

  // Reactive data derived from props
  $: displayItems = items.length > 0 ? Array.from({ length: 100 }, () => items).flat() : [];

  onMount(() => {
    // Calculate dimensions on mount
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        calculateDimensions();
        if (isReady) {
          setInitialPosition();
        }
      });
    }, 50); // Short delay

    return () => {
      clearTimeout(timeoutId);
      if (spinTimeoutId) clearTimeout(spinTimeoutId);
    };
  });

  function calculateDimensions() {
    if (!windowElement || !reelElement || items.length === 0) return;
    windowHeight = windowElement.offsetHeight;
    const firstItem = reelElement.querySelector('.slot-item');
    if (firstItem) {
      const styles = getComputedStyle(firstItem);
      const marginTop = parseFloat(styles.marginTop) || 0;
      const marginBottom = parseFloat(styles.marginBottom) || 0;
      itemHeight = firstItem.offsetHeight + marginTop + marginBottom;
      centeringOffset = (windowHeight / 2) - (itemHeight / 2);
      if (itemHeight > 0) {
        isReady = true;
        console.log('[SlotReel Mounted & Ready]', { itemHeight, windowHeight, centeringOffset });
      } else {
        console.error("[SlotReel] Calculated itemHeight is zero!");
        isReady = false;
      }
    } else {
      console.error("[SlotReel] Cannot find .slot-item on mount.");
      isReady = false;
    }
  }

  function setInitialPosition() {
    if (!isReady || !reelElement || items.length === 0) return;

    const middleRepetitionIndex = Math.floor(15 / 2);
    const initialIndex = items.length * middleRepetitionIndex;
    const initialTranslateY = -((initialIndex * itemHeight) - centeringOffset);

    reelElement.style.transition = 'none';
    reelElement.style.transform = `translateY(${initialTranslateY}px)`;
    console.log(`[SlotReel] Initial position set to Y: ${initialTranslateY.toFixed(0)}`);
  }

  // Exported function for parent to call
  export async function spinTo(targetResult) {
    // Use isReady flag which depends on dimension calculation
    if (isVisuallySpinning || !isReady || !targetResult || !reelElement) {
      console.warn("SlotReel cannot spin", { isVisuallySpinning, isReady, targetResult });
      return Promise.reject("Reel not ready or already spinning"); // Return promise status
    }

    isVisuallySpinning = true;
    if (spinTimeoutId) clearTimeout(spinTimeoutId);

    // --- Find winner and calculate positions ---
    const winningIndexOriginal = items.findIndex(item => item.name === targetResult.name);
    if (winningIndexOriginal === -1) { /* ... error handling ... */ isVisuallySpinning = false; return Promise.reject("Winner not found"); }
    
    const targetRepetitionIndex = Math.floor(15 / 2) + 2;
    const targetIndexInDisplay = (items.length * targetRepetitionIndex) + winningIndexOriginal;
    const finalTranslateY = -((targetIndexInDisplay * itemHeight) - centeringOffset);
    const fullSpinRounds = 8 + Math.floor(Math.random() * 4);
    const distancePerRound = items.length * itemHeight;
    const totalSpinDistance = fullSpinRounds * distancePerRound;
    const animationTranslateY = finalTranslateY - totalSpinDistance;

    console.log(`[SlotReel] Spinning To: ${targetResult.name}, Final Y: ${finalTranslateY.toFixed(0)}, Anim Y: ${animationTranslateY.toFixed(0)}`);

    // --- Apply Animation ---
    return new Promise((resolve) => { // Return a promise that resolves when spin finishes
      // Set transition FIRST
      const spinTimingFunc = 'cubic-bezier(0.2, 0.3, 0.1, 1.0)';
      reelElement.style.transition = `transform ${spinDuration / 1000}s ${spinTimingFunc}`;

      // Apply transform in next frame to ensure transition is registered
      requestAnimationFrame(() => {
        reelElement.style.transform = `translateY(${animationTranslateY}px)`;
      });

      // --- Handle End ---
      spinTimeoutId = setTimeout(() => {
        if (!reelElement) return resolve(); // Component destroyed

        console.log('[SlotReel] Spin ended, snapping.');
        reelElement.style.transition = 'none';
        reelElement.style.transform = `translateY(${finalTranslateY}px)`;
        reelElement.offsetHeight; // Force reflow

        requestAnimationFrame(async () => {
          if (reelElement) { // Ensure element still exists
            reelElement.style.transition = `transform ${spinDuration / 1000}s ${spinTimingFunc}`;
          }
          await tick(); // Wait for potential winning class update triggered by parent

          isVisuallySpinning = false;
          spinTimeoutId = null;

          resolve(); // Resolve the promise indicating spin completion
        });
      }, spinDuration);
    });
  }

  // Watch for external result changes to apply winning class
  // (Parent sets 'result' prop after spinTo promise resolves)
  $: if (result && !isVisuallySpinning) {
    console.log("[SlotReel] Applying winning class for:", result.name);
  }

  onDestroy(() => {
    if (spinTimeoutId) clearTimeout(spinTimeoutId);
  });
</script>

<!-- HTML Structure (pass result for winning class) -->
<div class="slot-machine-visual">
  <div class="indicator"></div>
  <div class="lights-container">
    {#each {length: 10} as _, i} <div class="light-bulb" style="--delay: {i * 0.1}s"></div> {/each}
  </div>
  <div bind:this={windowElement} class="slot-window">
    <div bind:this={reelElement} class="reel">
      {#if displayItems.length > 0}
        {#each displayItems as item, i (item.name + '-' + i)}
          <div
            class="slot-item"
            style="background-color: {item.color};"
            class:winning={!isVisuallySpinning && result && item.name === result.name}
          >
            <span>{item.name}</span>
          </div>
        {/each}
      {:else}
        <div class="slot-item" style="background-color: #cccccc;">Loading...</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .slot-machine-visual {
    width: 300px;
    max-width: 90%;
    position: relative;
    border: 4px solid var(--jeep-yellow, #FFC107);
    border-radius: 15px;
    background-color: #2a4a5f;
    padding: 25px 15px 15px 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0,0,0,0.2);
  }

  .lights-container {
    position: absolute;
    top: 6px;
    left: 10px;
    right: 10px;
    height: 10px;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }

  @keyframes blink {
    0%, 100% {
      background-color: var(--jeep-yellow, #FFC107);
      box-shadow: 0 0 5px var(--jeep-yellow, #FFC107);
      opacity: 1;
    }
    50% {
      background-color: var(--jeep-orange, #E57C23);
      box-shadow: 0 0 8px var(--jeep-orange, #E57C23);
      opacity: 0.8;
    }
  }

  .light-bulb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--jeep-yellow, #FFC107);
    box-shadow: 0 0 5px var(--jeep-yellow, #FFC107);
    animation: blink 1.5s infinite alternate;
    animation-delay: var(--delay, 0s);
  }

  .light-bulb:nth-child(even) {
    background-color: var(--jeep-orange, #E57C23);
    box-shadow: 0 0 5px var(--jeep-orange, #E57C23);
  }

  .indicator {
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-top: 16px solid var(--jeep-red, #9D2C0E);
    z-index: 10;
    filter: drop-shadow(0px 3px 2px rgba(0,0,0,0.4));
  }

  .slot-window {
    height: 65px;
    border: 3px inset rgba(0,0,0,0.3);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    background-color: var(--jeep-cream, #FDFCDC);
  }

  .reel {
    display: flex;
    flex-direction: column;
    /* Transition applied inline via JS */
  }

  .slot-item {
    height: 60px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.3rem;
    color: var(--jeep-cream, #FDFCDC);
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 5px;
    border-radius: 5px;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                box-shadow 0.3s ease-out;
    font-family: var(--font-display, 'Archivo Black', sans-serif); 
    letter-spacing: 2px;
  }

  /* Specific text colors for contrast */
  .slot-item[style*="background-color: rgb(255, 193, 7)"] span, /* Yellow */
  .slot-item[style*="background-color: rgb(253, 252, 220)"] span /* Cream */
  {
    color: #333;
    text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.3);
  }

  .slot-item.winning {
    transform: scale(1.1);
    box-shadow: inset 0 0 8px rgba(255,255,255,0.6), 0 0 25px 8px var(--jeep-yellow, #FFC107);
    z-index: 5;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
</style>