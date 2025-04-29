<script>
  import { onDestroy } from 'svelte';

  export let message = 'Notification';
  export let duration = 2500; // ms
  export let show = false; // Controlled by parent

  let timeoutId = null;
  let fadingOut = false;

  $: if (show && duration > 0) {
    if (timeoutId) clearTimeout(timeoutId);
    fadingOut = false; // Reset fading state
    timeoutId = setTimeout(() => {
      fadingOut = true;
      // Wait for fadeout animation to finish (match with fadeout duration)
      setTimeout(() => {
        show = false;
      }, 500); // match fadeout time (0.5s)
    }, duration);
  } else if (!show && timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  onDestroy(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
</script>

{#if show}
  <div
    class="toast-notification {fadingOut ? 'fade-out' : 'fade-in'}"
  >
    {message}
  </div>
{/if}

<style>
  @keyframes fadein-toast {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeout-toast {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-30px); opacity: 0; }
  }

  .toast-notification {
    position: fixed;
    top: 20px;
    max-width: 300px;
    width: 90%;
    background-color: rgba(30, 60, 80);
    color: var(--jeep-cream, #FDFCDC);
    padding: 12px 18px;
    border-radius: 8px;
    border: 2px solid var(--jeep-yellow, #FFC107);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .fade-in {
    animation: fadein-toast 0.5s forwards;
  }

  .fade-out {
    animation: fadeout-toast 0.5s forwards;
  }
</style>