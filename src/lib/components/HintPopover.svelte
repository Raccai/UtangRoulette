<script>
  import { fly, fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let show = false;
  export let targetElement = null;
  export let placement = 'bottom';
  export let content = 'This is a hint!';
  export let step = 1;
  export let totalSteps = 1;
  export let nextButtonText = 'Next';
  export let finishButtonText = 'Got it!';

  const dispatch = createEventDispatcher();

  let popoverElement;
  let popoverStyle = '';
  let arrowStyle = ''; // Separate style for the arrow

  function calculatePosition() {
    if (!targetElement || !popoverElement) {
        console.warn("Popover: Missing target or popover element for positioning.");
        popoverStyle = 'opacity: 0; pointer-events: none;'; // Hide if no target
        return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const popoverRect = popoverElement.getBoundingClientRect(); // Measure the popover itself
    const margin = 10; // Space between target and popover
    const arrowSize = 8; // Half the base width/height of the arrow's border

    let top = 0;
    let left = 0;
    let arrowTop = 'auto';
    let arrowLeft = 'auto';
    let arrowTransform = '';

    switch (placement) {
      case 'top':
        top = targetRect.top - popoverRect.height - margin;
        left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
        arrowLeft = '50%'; // Center arrow horizontally
        arrowTransform = 'translateX(-50%)';
        // Arrow positioned at the bottom of the popover
        arrowTop = `${popoverRect.height - 1}px`; // Place arrow base just inside bottom edge
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (popoverRect.height / 2);
        left = targetRect.left - popoverRect.width - margin;
        arrowTop = '50%'; // Center arrow vertically
        arrowTransform = 'translateY(-50%)';
        // Arrow positioned on the right side of the popover
        arrowLeft = `${popoverRect.width - 1}px`;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (popoverRect.height / 2);
        left = targetRect.right + margin;
        arrowTop = '50%';
        arrowTransform = 'translateY(-50%)';
        // Arrow positioned on the left side of the popover
        arrowLeft = `${-arrowSize * 2 + 1}px`; // Position outside left edge
        break;
      case 'bottom':
      default:
        top = targetRect.bottom + margin;
        left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
        arrowLeft = '50%';
        arrowTransform = 'translateX(-50%)';
        // Arrow positioned at the top of the popover
        arrowTop = `${-arrowSize * 2 + 1}px`;
        break;
    }

    // --- Boundary and Arrow Adjustment ---
    const viewportPadding = 10; // Minimum space from viewport edges

    // Adjust left position first to keep it on screen
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - popoverRect.width - viewportPadding));

    // Adjust top position
    top = Math.max(viewportPadding, Math.min(top, window.innerHeight - popoverRect.height - viewportPadding));

    // --- Adjust Arrow Position AFTER popover position is fixed ---
    // If placement is top/bottom, adjust arrow's horizontal position to point towards target center
    if (placement === 'top' || placement === 'bottom') {
        const targetCenterX = targetRect.left + targetRect.width / 2;
        // Calculate where the target center is relative to the popover's left edge
        const arrowTargetLeft = targetCenterX - left;
        // Clamp arrow position to stay within the popover bounds (minus arrow size)
        arrowLeft = `${Math.max(arrowSize, Math.min(arrowTargetLeft, popoverRect.width - arrowSize))}px`;
        // Keep translateX(-50%) to center the arrow itself over this point
        arrowTransform = 'translateX(-50%)';
    }
    // Similar logic if placement is left/right (adjust vertical arrow position)
    else if (placement === 'left' || placement === 'right') {
         const targetCenterY = targetRect.top + targetRect.height / 2;
         const arrowTargetTop = targetCenterY - top;
         arrowTop = `${Math.max(arrowSize, Math.min(arrowTargetTop, popoverRect.height - arrowSize))}px`;
         arrowTransform = 'translateY(-50%)';
    }


    // --- Set Styles ---
    popoverStyle = `top: ${top}px; left: ${left}px; opacity: 1;`; // Ensure opacity is set
    arrowStyle = `top: ${arrowTop}; left: ${arrowLeft}; transform: ${arrowTransform};`;
  }

  // Recalculate on show or target change (after DOM update)
  $: if (show && targetElement && popoverElement) {
     // Using rAF ensures measurements are taken after layout
     requestAnimationFrame(calculatePosition);
  }
  // Also recalculate if placement changes while shown
  $: if (show && placement && targetElement && popoverElement) {
     requestAnimationFrame(calculatePosition);
  }

  function handleNext() { dispatch('next'); }
  function handleFinish() { dispatch('finish'); }

</script>

{#if show && targetElement}
  <div
    class="hint-popover placement-{placement}"
    bind:this={popoverElement}
    style={popoverStyle}
    transition:fade={{ duration: 200 }} 
    role="tooltip"
  >
    <!-- Apply style to the arrow -->
    <div class="hint-arrow" style={arrowStyle}></div>
    <div class="hint-content">{@html content}</div>
    <div class="hint-footer">
      {#if totalSteps > 1}
        <span class="step-counter">{step} / {totalSteps}</span>
      {/if}
      {#if step < totalSteps}
        <button class="hint-button next" on:click={handleNext}>{nextButtonText}</button>
      {:else}
         <button class="hint-button finish" on:click={handleFinish}>{finishButtonText}</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .hint-popover {
    position: fixed;
    background-color: var(--bg-dark-blue, #1A3A4F); /* Use theme color */
    color: var(--jeep-cream, #FDFCDC);
    padding: 0.8rem 1rem; /* Adjust padding */
    border-radius: 8px;
    border: 2px solid var(--jeep-yellow, #FFC107); /* Thicker border */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* Stronger shadow */
    z-index: 1001;
    max-width: 260px; /* Slightly smaller max width */
    font-size: 0.9rem;
    line-height: 1.45; /* Adjust line height */
    font-family: var(--font-body, 'Archivo Black');
    /* Start with opacity 0 for transition */
    opacity: 0;
    /* Ensure transitions don't interfere with positioning calc */
    /* transition: opacity 0.2s ease-out; */
    will-change: top, left, opacity;
  }

  .hint-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    /* Transition opacity with parent */
    /* transition: opacity 0.2s ease-out; */
  }

  /* Arrow shapes */
  .placement-bottom .hint-arrow {
    /* Positioned dynamically, styles set shape */
    border-width: 0 8px 8px 8px;
    border-color: transparent transparent var(--jeep-yellow, #FFC107) transparent;
    /* filter: drop-shadow(0px 2px 1px rgba(0,0,0,0.3)); */ /* Optional shadow */
  }
  .placement-top .hint-arrow {
    border-width: 8px 8px 0 8px;
    border-color: var(--jeep-yellow, #FFC107) transparent transparent transparent;
  }
   .placement-right .hint-arrow {
    border-width: 8px 8px 8px 0;
    border-color: transparent var(--jeep-yellow, #FFC107) transparent transparent;
  }
   .placement-left .hint-arrow {
    border-width: 8px 0 8px 8px;
    border-color: transparent transparent transparent var(--jeep-yellow, #FFC107);
  }

  .hint-content {
    margin-bottom: 0.75rem;
    font-weight: normal; /* Use normal weight for body */
  }
   .hint-content strong {
       color: var(--jeep-yellow, #FFC107);
       font-weight: bold;
   }

  .hint-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    border-top: 1px solid rgba(255, 193, 7, 0.3); /* Yellowish border */
    padding-top: 0.75rem;
  }

  .step-counter {
    font-size: 0.8rem;
    opacity: 0.7;
    color: var(--jeep-yellow, #FFC107);
  }

  .hint-button {
    background: var(--jeep-yellow, #FFC107);
    color: var(--bg-dark-blue, #1A3A4F);
    border: none;
    padding: 5px 12px;
    border-radius: 5px;
    font-weight: bold;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
    font-size: 0.85rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .hint-button.finish {
      background: var(--jeep-green, #386641);
      color: var(--jeep-cream, #FDFCDC);
  }
  .hint-button:hover { opacity: 0.9; }
  .hint-button:active { transform: scale(0.95); }

</style>