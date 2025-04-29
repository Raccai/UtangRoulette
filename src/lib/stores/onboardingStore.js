import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storageKey = 'utangRouletteHintsShown';

// --- Initial State ---
// Check localStorage ONLY if in the browser
let initialState = false; // Assume hints haven't been shown
if (browser) {
    const stored = localStorage.getItem(storageKey);
    initialState = stored === 'true'; // Convert stored string 'true' to boolean
}

// --- Store Definition ---
const { subscribe, set } = writable(initialState);

// --- Store Actions ---
function markHintsAsShown() {
    if (!browser) return;
    set(true); // Update store state
    localStorage.setItem(storageKey, 'true'); // Persist
    console.log("Onboarding hints marked as shown.");
}

// --- Export Store and Actions ---
export const hintsShown = {
    subscribe
    // Don't expose set directly, use the action
};
export const markHintsShown = markHintsAsShown;