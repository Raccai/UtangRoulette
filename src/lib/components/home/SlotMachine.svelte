<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { spinTheWheel, wheelOptions } from '../../utils/spinLogic';
  import { achievementStore, unlockAchievement, incrementSpinCount, formatAchievementKey } from '$lib/stores/achievementsStore';
  import UtangRouletteTitle from "../../assets/images/UtangRouletteTitle.png";
  import { historyStore } from '$lib/stores/historyStore';
  import { hintsShown, markHintsShown } from '$lib/stores/onboardingStore';
  
  // Import the components
  import HintPopover from '../HintPopover.svelte';
  import Button from '../Button.svelte';
  import Toast from '../Toast.svelte';
  import JeepToggle from './JeepToggle.svelte';
  import SlotReel from './SlotReel.svelte';
  import ResultCard from './ResultCard.svelte';

  // --- State managed by the orchestrator ---
  let isSpinning = false;
  let spinResultData = null;
  let winningItemForReel = null;
  let currentMode = 'mayUtang';
  let showResultCard = false; // Controls visibility AND title shrink
  let showToast = false;
  let toastMessage = '';
  let slotReelComponent;

  // --- Reactive Data Setup ---
  $: categoriesData = wheelOptions ? wheelOptions.map(opt => ({ name: opt.display, color: opt.color || '#dddddd' })) : [];

  // --- Hint State ---
  let showHints = false; // Overall flag to show the sequence
  let currentHintStep = 0;
  let hintTargetElement = null; // Reference to the element being hinted
  const hintSequence = [ // Define the hint steps
    { selector: '.nav-button[aria-label="Home / Spin"]', content: 'Spin the <strong>Utang Roulette</strong> here!', placement: 'top' },
    { selector: '.nav-button[aria-label="History"]', content: 'Check your past spins in <strong>History</strong>.', placement: 'top' },
    { selector: '.nav-button[aria-label="Achievements"]', content: 'View your unlocked <strong>Awards</strong> here.', placement: 'top' },
    // Add more hints if needed
  ];

  $: currentHint = showHints ? hintSequence[currentHintStep] : null;
  $: totalHintSteps = hintSequence.length;

  // --- Check on mount if hints should be shown ---
  let hintsAlreadyShown = false;
  hintsShown.subscribe(value => { hintsAlreadyShown = value; });

  onMount(() => {
    if (!hintsAlreadyShown) {
        // Initial delay before starting the check loop
        setTimeout(() => {
            console.log("Starting hint check loop...");
            startHints();
        }, 500); // Initial delay
    }
    // ... rest of onMount ...
  });

  // --- Hint Control Functions ---
  function startHints() {
    console.log("startHints called");
    currentHintStep = 0;
    showHints = true;
    // Start the process of finding the target
    findHintTargetWithRetry(currentHintStep);
  }

  function nextHint() {
    if (currentHintStep < totalHintSteps - 1) {
        currentHintStep++;
        hintTargetElement = null; // Reset target
        findHintTargetWithRetry(currentHintStep); // Find next target
    } else {
        finishHints();
    }
  }

  function finishHints() {
      console.log("Finishing hint sequence.");
      showHints = false;
      hintTargetElement = null;
      markHintsShown(); // Mark as shown in store/localStorage
  }

  // --- NEW: Function to find target with retries ---
  const MAX_RETRIES = 10;
  const RETRY_DELAY = 100; // ms between retries

  async function findHintTargetWithRetry(stepIndex, retryCount = 0) {
      if (!showHints || stepIndex !== currentHintStep) return; // Stop if hints hidden or step changed

      const hint = hintSequence[stepIndex];
      if (!hint || !hint.selector) {
          console.error("Invalid hint definition for step", stepIndex);
          finishHints(); // Cannot proceed
          return;
      }

      console.log(`Finding target (Attempt ${retryCount + 1}): ${hint.selector}`);
      await tick(); // Wait for potential DOM updates

      const target = document.querySelector(hint.selector);

      if (target) {
          console.log("Target found:", target);
          hintTargetElement = target;
          // Optional: Ensure popover recalculates position AFTER element is set
          await tick();
      } else if (retryCount < MAX_RETRIES) {
          console.log("Target not found, retrying...");
          setTimeout(() => findHintTargetWithRetry(stepIndex, retryCount + 1), RETRY_DELAY);
      } else {
          console.warn(`Hint target not found after ${MAX_RETRIES + 1} attempts: ${hint.selector}. Skipping step.`);
          hintTargetElement = null; // Ensure it's null
          // Skip to next or finish
          if (currentHintStep < totalHintSteps - 1) {
              nextHint();
          } else {
              finishHints();
          }
      }
  }

  // --- Event Handlers ---
  function handleToggle() {
    if (isSpinning) return;
    currentMode = (currentMode === 'mayUtang') ? 'nagbibigayNgUtang' : 'mayUtang';
  }

  async function handleMainSpin() {
    if (isSpinning || !slotReelComponent) return;

    isSpinning = true;
    spinResultData = null;
    winningItemForReel = null;
    showResultCard = false; // Hide result card & reset shift/title size

    const unlockedSpinAchievement = incrementSpinCount();
    if (unlockedSpinAchievement) { /* ... show toast ... */
        setTimeout(() => { toastMessage = `🏆 Achievement Unlocked: First Spin!`; showToast = true; }, 300);
    }

    const result = spinTheWheel(currentMode);
    const winner = categoriesData.find(cat => cat.name === result.category);
    if (!winner) { /* ... error handling ... */ isSpinning = false; return; }

    try {
        await slotReelComponent.spinTo(winner); // Wait for reel animation

        // *** ADD TO HISTORY ***
        historyStore.addEntry(result.category, result.message);

        // --- Runs AFTER SlotReel animation finishes ---
        spinResultData = result;
        winningItemForReel = winner;
        await tick();

        // Check achievements
        const winnerKey = wheelOptions.find(opt => opt.display === result.category)?.key;
        let justUnlockedKey = null;
        if (winnerKey) {
            // Example checks (replace with your actual logic)
            if (winnerKey === 'oaParinig' && unlockAchievement('dramaKingQueen')) justUnlockedKey = 'dramaKingQueen';
            else if (winnerKey === 'biblicalPlague' && unlockAchievement('holyRoller')) justUnlockedKey = 'holyRoller';
            else if (winnerKey === 'straightGalit' && unlockAchievement('galitGalit')) justUnlockedKey = 'galitGalit';
            else if (winnerKey === 'tiktokerStyle' && unlockAchievement('tiktokStar')) justUnlockedKey = 'tiktokStar';
            else if (winnerKey === 'sarcasticAf' && unlockAchievement('sarcasticSupremo')) justUnlockedKey = 'sarcasticSupremo';
        }
        if (justUnlockedKey) { /* ... show toast ... */
            toastMessage = `🏆 Achievement Unlocked: ${formatAchievementKey(justUnlockedKey)}!`; showToast = true;
        }

        showResultCard = true; // Trigger layout shift, title shrink, and result visibility
        isSpinning = false; // Re-enable buttons/toggle AFTER all state updates

    } catch (error) { /* ... error handling ... */ isSpinning = false; toastMessage = 'Spin Error!'; showToast = true; }
  }

  async function handleCopyToClipboard(event) {
    const messageToCopy = event.detail;
    if (!messageToCopy || !navigator.clipboard) { toastMessage = 'Error: Could not copy!'; showToast = true; return; }
    try {
        await navigator.clipboard.writeText(messageToCopy);
        toastMessage = 'Copied to clipboard!'; showToast = true;
    } catch (err) { console.error('Failed to copy:', err); toastMessage = 'Error: Copy failed!'; showToast = true; }
  }
</script>

<div class="slot-machine-container">

  <!-- Overlay to prevent interaction during hints -->
  {#if showHints}
    <div class="hint-overlay" on:click|self={nextHint}></div>
  {/if}

  <Toast bind:show={showToast} message={toastMessage} duration={2500} />

  <!-- Hint Popover Component -->
  <HintPopover
    bind:show={showHints} 
    targetElement={hintTargetElement} 
    placement={currentHint?.placement || 'bottom'}
    content={currentHint?.content || ''}
    step={currentHintStep + 1}
    totalSteps={totalHintSteps}
    on:next={nextHint}
    on:finish={finishHints}
  />

  <!-- Upper content wrapper for layout shift -->
  <!-- ** Conditionally apply shrink-title class ** -->
  <div class="upper-content" class:shift-up={showResultCard} class:shrink-title={showResultCard}>
    <div class="title-cont">
      <img src={UtangRouletteTitle} alt="Utang Roulette" />
    </div>

    <SlotReel
      bind:this={slotReelComponent}
      items={categoriesData}
      result={winningItemForReel}
      spinDuration={4500}
    />

    <Button class="spin-button" disabled={isSpinning} on:click={handleMainSpin}>
      {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
    </Button>

    <JeepToggle bind:mode={currentMode} disabled={isSpinning} on:toggle={handleToggle} />

  </div> <!-- End upper-content -->

  <ResultCard
    result={spinResultData}
    visible={showResultCard}
    on:copy={handleCopyToClipboard}
  />

</div>

<style>
  /* --- Orchestrator Layout Styles --- */
  .slot-machine-container {
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; padding: 1rem; padding-top: 0; margin-top: -2.4rem;     
    background-color: none;
    min-height: 100vh; 
    box-sizing: border-box; overflow: hidden;
  }

  .upper-content {
    display: flex; flex-direction: column; align-items: center;
    width: 100%;
    /* Apply transition to transform for the shift */
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    margin-bottom: 1rem; position: relative; z-index: 5;
  }

  .upper-content.shift-up {
    transform: translateY(-75px); /* Adjust as needed */
    margin-bottom: -65px; /* Adjust as needed */
  }

  /* --- Title Image Styling --- */
  .title-cont {
      width: 100%;
      max-width: 350px; /* Adjust max width of title image */
      margin-bottom: 1rem; /* Space below title */
  }

  .title-cont img {
      display: block;
      width: 100%;
      height: auto;
      /* ** Add transition for the scale ** */
      transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Match shift timing */
      transform-origin: center bottom; /* Scale towards bottom center */
      transform: scale(1); /* Initial scale */
  }

  /* ** Style for when title should shrink ** */
  .upper-content.shrink-title .title-cont img {
       transform: scale(0.5); /* Adjust scale factor (e.g., 75%) */
  }

  /* --- Hint Overlay --- */
  .hint-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark overlay */
      z-index: 1000; /* Above content, below popover */
      cursor: pointer; /* Indicate clickability */
       /* Add a subtle fade-in */
      opacity: 0;
      animation: fade-in-overlay 0.3s ease-out forwards;
  }

  @keyframes fade-in-overlay {
      to { opacity: 1; }
  }

  /* --- Keyframes needed globally or in parent --- */
  @keyframes resultGlow {
      0% { box-shadow: 0 3px 6px rgba(0,0,0,0.2), 0 0 0px 0px rgba(255, 193, 7, 0); }
      50% { box-shadow: 0 3px 6px rgba(0,0,0,0.2), 0 0 25px 10px rgba(255, 193, 7, 0.7); }
      100% { box-shadow: 0 3px 6px rgba(0,0,0,0.2), 0 0 15px 5px rgba(255, 193, 7, 0.4); }
  }
</style>