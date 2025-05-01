import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const MAX_HISTORY_ITEMS = 50; // Limit the number of items stored
const storageKey = 'utangRouletteHistory';

// Initial State
let initialHistory = [];
if (browser) {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Ensure it's an array and has the expected structure (basic check)
            if (Array.isArray(parsed) && (parsed.length === 0 || (parsed[0].category && parsed[0].message && parsed[0].timestamp))) {
                initialHistory = parsed;
            } else {
                console.warn("Invalid history format found in localStorage. Resetting.");
                localStorage.removeItem(storageKey); // Clear invalid data
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
            localStorage.removeItem(storageKey); // Clear invalid data
        }
    }
}

// --- Store Definition ---
const { subscribe, set, update } = writable(initialHistory);

// --- Store Subscription for Persistence ---
if (browser) {
    subscribe((value) => {
        // Only save valid arrays
        if (Array.isArray(value)) {
            localStorage.setItem(storageKey, JSON.stringify(value));
            // console.log("History saved to localStorage:", value.length, "items");
        }
    });
}

// --- Store Actions ---
function addHistoryEntry(category, message) {
    if (!browser) return; // Don't run on server

    const newEntry = {
        category,
        message,
        timestamp: Date.now(),
        id: crypto.randomUUID() // Add a unique ID for keyed each blocks
    };

    update(currentHistory => {
        // Add to the beginning (newest first)
        const updatedHistory = [newEntry, ...currentHistory];

        // Limit the history size
        if (updatedHistory.length > MAX_HISTORY_ITEMS) {
            return updatedHistory.slice(0, MAX_HISTORY_ITEMS);
        }
        return updatedHistory;
    });
     console.log("Added to history:", newEntry);
}

function clearHistory() {
    if (!browser) return;
    set([]); // Reset store to empty array (will trigger save via subscribe)
    console.log("History cleared.");
}

// --- Export Store and Actions ---
export const historyStore = {
    subscribe,
    addEntry: addHistoryEntry,
    clear: clearHistory,
    set, // Expose set if needed, but actions are preferred
};