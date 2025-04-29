<script>
  import SlotMachine from "$lib/components/home/SlotMachine.svelte";
  import { fly, fade } from "svelte/transition";
</script>

<div transition:fly|fade={{ y: 200, duration: 400 }}>
  <SlotMachine />
</div>

<style>
div {
    position: absolute; /* Ensures the element overlaps the previous one */
    width: 100%;        /* Full width for smooth transitions */
    height: 100%;       /* Full height for smooth transitions */
  }
</style>