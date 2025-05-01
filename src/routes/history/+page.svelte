<script>
  import { historyStore } from '$lib/stores/historyStore';
  import { wheelOptions } from '$lib/utils/spinLogic';
  import HistoryTitle from "$lib/assets/images/HistoryTitle.png";
  import { fly, fade } from 'svelte/transition';

  // Create a map for quick color lookup
  const categoryColorMap = new Map(wheelOptions.map(opt => [opt.display, opt.color || '#dddddd']));

  function getColorForCategory(categoryName) {
    return categoryColorMap.get(categoryName) || '#777'; // Fallback color
  }

  // Formatting function for timestamp
  function formatTimestamp(timestamp) {
    if (!timestamp || typeof timestamp !== 'number') {
      return 'Invalid Date';
    }
    const date = new Date(timestamp);
    // Example format: "Mon, Jul 29, 2024, 2:30 PM"
    const optionsDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
    return `${date.toLocaleDateString(undefined, optionsDate)}, ${date.toLocaleTimeString(undefined, optionsTime)}`;
  }

  // Handle clearing history
  function confirmClearHistory() {
    if (confirm("Are you sure you want to clear the entire spin history? This cannot be undone.")) {
      historyStore.clear();
    }
  }

  // Reactive variable for history entries
  $: historyEntries = $historyStore || [];

</script>

<div class="history-page themed-container" transition:fly|fade={{ y: 200, duration: 400 }}>
  <img src={HistoryTitle} alt="History" class="page-title">

  {#if historyEntries.length > 0}
    <div class="history-controls">
      <button class="clear-button" on:click={confirmClearHistory} title="Clear all history">
        Clear History
      </button>
    </div>

    <div class="history-list">
      {#each historyEntries as entry (entry.id)} 
        <div class="history-entry">
          <div class="entry-header">
            <span
              class="category-tag"
              style="background-color: {getColorForCategory(entry.category)}; border-color: {getColorForCategory(entry.category)};"
            >
              {entry.category}
            </span>
            <span class="timestamp">{formatTimestamp(entry.timestamp)}</span>
          </div>
          <p class="message">{entry.message}</p>
        </div>
      {:else}
        <p class="loading-text">No history entries found.</p>
      {/each}
    </div>
  {:else}
    <p class="empty-history-text">Looks like your spin history is empty. Go spin the wheel!</p>
  {/if}
</div>

<style>
  .themed-container {
    background-color: none;
    padding: 1rem 2rem 2rem 2rem; /* Top padding smaller */
    box-sizing: border-box;
    font-family: var(--font-body, 'Archivo Black', sans-serif);
    height: calc(100vh - 80px);
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .page-title {
    font-family: var(--font-display, 'Bangers', cursive);
    font-size: clamp(2.2rem, 7vw, 3.2rem); /* Slightly smaller */
    text-align: center;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem; /* Less space below */
    color: var(--jeep-yellow, #FFC107);
    text-shadow: 2px 2px 0px var(--jeep-red, #9D2C0E), 4px 4px 4px rgba(0,0,0,0.5);
    flex-shrink: 0;
  }

  .history-controls {
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: flex-end; /* Position button to the right */
    margin-bottom: 1rem;
  }

  .clear-button {
    background-color: var(--jeep-red, #A13012);
    color: var(--jeep-cream, #eee);
    border: 2px solid var(--dark-metal, #6f1f0a);
    padding: 5px 10px;
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .clear-button:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.4);
    transform: translateY(-1px);
  }
  .clear-button:active {
    transform: translateY(0px);
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
  }


  .history-list {
    width: 100%;
    max-width: 800px; /* Limit width of the list */
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Space between entries */
  }

  .history-entry {
    background-color: rgba(255, 255, 255, 0.05); /* Subtle background */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    flex-wrap: wrap; /* Allow wrapping on small screens */
    gap: 0.5rem; /* Space between tag and timestamp if they wrap */
  }

  .category-tag {
    font-size: 0.85rem;
    padding: 3px 8px;
    border-radius: 5px;
    color: var(--jeep-cream); 
    text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
    border-bottom: 3px solid; 
  }
  .category-tag[style*="background-color: rgb(255, 193, 7)"] /* Yellow */
  {
    color: #333;
    text-shadow: none;
  }

  .timestamp {
    font-size: 0.75rem;
    color: #ccc; /* Lighter color for timestamp */
    opacity: 0.8;
    white-space: nowrap; /* Prevent timestamp wrapping */
  }

  .message {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--jeep-cream, #FDFCDC);
    margin: 0;
    word-wrap: break-word; /* Allow long messages to wrap */
  }

  .empty-history-text, .loading-text {
    text-align: center;
    color: var(--jeep-cream);
    font-size: 1.2rem;
    padding: 3rem;
    margin: auto;
    opacity: 0.8;
  }
</style>