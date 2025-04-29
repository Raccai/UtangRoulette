<script>
  import { createEventDispatcher } from 'svelte';
  import CopyIcon from "../../assets/images/Copy.svelte";

  export let result = null; // { category: string, message: string }
  export let visible = false; // Controls animation

  const dispatch = createEventDispatcher();

  function handleCopy() {
      // Only dispatch event, let parent handle actual copying and toast
      if (result?.message) {
          dispatch('copy', result.message); // Send message text with event
      }
  }
</script>

{#if result}
  <div class="result-display" class:visible>
    <div class="result-content">
      <div class="header">
        <h2>{result.category}</h2>
        <button class="copy-button" on:click={handleCopy} title="Copy message">
          <span>
            <CopyIcon />
          </span>
          Copy
        </button>
      </div>
      {#if result.message}
        <p>{result.message}</p>
      {/if}
    </div>
  </div>
{/if}

<style>
    /* Paste the existing result display styles here */
    /* --- RESULT DISPLAY GLOW --- */
    @keyframes resultGlow { /* ... */ }
    .result-display { margin-top: 0; /* remove margin, parent handles spacing */ text-align: center; padding: 0; background-color: transparent; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 3px 6px rgba(0,0,0,0.2); opacity: 0; transform: scale(0.9) translateY(20px); transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; z-index: 10; }
    .result-display.visible { opacity: 1; transform: scale(1) translateY(0); animation: resultGlow 1.2s 0.2s ease-out forwards; }
    .result-content { background-color: var(--jeep-cream, #FDFCDC); color: var(--bg-dark-blue, #1A3A4F); border-radius: 8px; border: 3px solid var(--jeep-orange, #E57C23); padding: 0.2rem 0.2rem; position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
    .result-display h2 { font-family: var(--font-display, 'Bangers'); letter-spacing: 1px; color: var(--jeep-red, #9D2C0E); }
    .result-display p { margin: 0 0 1rem 0; font-size: 1.1rem; line-height: 1.5; max-width: 95%; }

    .header {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin: 0.6rem 0;
    }

    /* --- Copy Button Styles --- */
    .copy-button { display: inline-flex; align-items: center; gap: 0.5rem;  padding: 6px 12px; font-size: 0.9rem; font-weight: bold; font-family: var(--font-body, 'Archivo Black'); color: var(--bg-dark-blue, #1A3A4F); background-color: var(--jeep-yellow, #FFC107); border: 2px solid var(--jeep-orange, #E57C23); border-radius: 6px; cursor: pointer; transition: background-color 0.2s, transform 0.1s; box-shadow: 0 2px 3px rgba(0,0,0,0.2); }
    .copy-button:hover { background-color: var(--jeep-orange, #E57C23); color: white; border-color: var(--jeep-red, #9D2C0E); }
    .copy-button:active { transform: scale(0.95); }
</style>