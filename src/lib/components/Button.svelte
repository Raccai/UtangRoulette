<script>
  export let disabled = false;
  export let type = 'button'; // Default type, may add more types in the future
</script>

<button
  {type}
  {disabled}
  class="spin-button"
  on:click
>
  <slot>Default Button Text</slot>
</button>

<style>
 .spin-button {
    display: block;
    width: 80%;
    max-width: 260px;
    padding: 15px 20px;
    margin: 1.5rem auto 0 auto;
    font-family: var(--font-display, 'Sigmar One', cursive);
    font-size: 1.8rem;
    letter-spacing: 2px;
    color: var(--jeep-cream, #FDFCDC);
    background-color: var(--jeep-red, #9D2C0E);
    border: 3px solid var(--jeep-orange, #E57C23);
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    text-transform: uppercase;
    text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -3px 5px rgba(0,0,0,0.2);
    transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
 }
 .spin-button:hover:not(:disabled) {
    background-color: #c73e1e; /* Darker red */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.35), inset 0 -2px 4px rgba(0,0,0,0.2);
    transform: translateY(-2px);
 }
 .spin-button:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3), inset 0 -1px 3px rgba(0,0,0,0.2);
 }
 .spin-button:disabled {
    background-color: #777;
    border-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3), inset 0 -1px 3px rgba(0,0,0,0.2);
 }
</style>