<script>
  import { fade } from 'svelte/transition';
</script>

<div class="loading-overlay" transition:fade={{ duration: 300 }}>
  <div class="spinner"></div>
  <p>Loading Utang Roulette...</p>
</div>

<style>
  .loading-overlay {
      position: fixed;
      inset: 0;
      background-color: var(--bg-dark-blue, #1A3A4F); 
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999; /* Highest z-index */
      color: var(--jeep-cream, #FDFCDC);
  }

  /* Simple CSS Spinner */
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

  .spinner {
      border: 6px solid rgba(255, 193, 7, 0.3); /* Lighter yellow border */
      border-top: 6px solid var(--jeep-yellow, #FFC107); /* Solid yellow top */
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
      margin-bottom: 1.5rem;
  }

  .loading-overlay p {
      font-family: var(--font-body, 'Archivo Black');
      font-size: 1rem;
      opacity: 0.8;
  }
</style>