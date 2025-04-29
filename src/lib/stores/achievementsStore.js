// src/lib/stores/achievementStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// --- Image Imports (or define paths directly) ---
// Using dynamic imports might be possible but can be complex.
// Direct imports are simpler if the list isn't huge.
// Adjust paths as needed!
import firstSpinIcon from '$lib/assets/images/awards/FirstSpin.png';
import dramaKingQueenIcon from '$lib/assets/images/awards/DramaKingQueen.png';
import holyRollerIcon from '$lib/assets/images/awards/HolyRoller.png';
import galitGalitIcon from '$lib/assets/images/awards/GalitGalit.png';
import tiktokStarIcon from '$lib/assets/images/awards/TiktokStar.png';
import sarcasticSupremoIcon from '$lib/assets/images/awards/SarcasticSupremo.png';
import paasaLevel100Icon from '$lib/assets/images/awards/PaasaLevel100.png';
import bayaniNgUtangIcon from '$lib/assets/images/awards/BayaniNgUtang.png';
import lockedIcon from '$lib/assets/images/awards/LockedBadge.png';


// --- Initial State with Achievement Objects ---
const initialState = {
  firstSpin:        { unlocked: false, name: "First Spin", image: firstSpinIcon, description: "Spin the wheel for the first time!" },
  dramaKingQueen:   { unlocked: false, name: "Drama King/Queen", image: dramaKingQueenIcon, description: "Land on 'OA Parinig' 5 times." },
  holyRoller:       { unlocked: false, name: "Holy Roller", image: holyRollerIcon, description: "Experience a 'Biblical Plague'." },
  galitGalit:       { unlocked: false, name: "Galit Galit Muna", image: galitGalitIcon, description: "Land on 'Straight Galit' 3 times." },
  tiktokStar:       { unlocked: false, name: "TikTok Star", image: tiktokStarIcon, description: "Land on 'Tiktoker Style'." },
  sarcasticSupremo: { unlocked: false, name: "Sarcastic Supremo", image: sarcasticSupremoIcon, description: "Land on 'Sarcastic AF'." },
  paasaLevel100:    { unlocked: false, name: "Paasa Level 100", image: paasaLevel100Icon, description: "Land on 'Mabait Reminder' 10 times?" }, // Example condition
  bayaniNgUtang:    { unlocked: false, name: "Bayani Ng Utang", image: bayaniNgUtangIcon, description: "Complete 10 'transactions'?" }, // Example condition
  // spinCount is separate, not an achievement object
};

// Separate initial state for spin count
const initialSpinCount = 0;

// --- Persistent Store Logic ---
const storageKey = 'utangRouletteAchievements_v2'; // Use a new key for the new structure
const spinCountKey = 'utangRouletteSpinCount_v2';

// Load achievements
let storedAchievements = { ...initialState }; // Start with default structure
if (browser) {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Merge carefully: keep initial structure, update unlocked status from storage
            for (const key in initialState) {
                if (parsed.hasOwnProperty(key) && typeof parsed[key] === 'object' && typeof parsed[key].unlocked === 'boolean') {
                    storedAchievements[key] = { ...initialState[key], unlocked: parsed[key].unlocked };
                } else if (parsed.hasOwnProperty(key) && typeof parsed[key] === 'boolean') {
                     // Handle migration from old boolean structure (optional)
                     console.warn(`Migrating old achievement format for ${key}`);
                     storedAchievements[key] = { ...initialState[key], unlocked: parsed[key] };
                }
            }
        } catch (e) { console.error("Failed to parse achievements from localStorage", e); storedAchievements = initialState; }
    }
}

// Load spin count separately
let storedSpinCount = initialSpinCount;
if (browser) {
    const stored = localStorage.getItem(spinCountKey);
    if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) {
            storedSpinCount = parsed;
        }
    }
}


// Create writable stores
const achievements = writable(storedAchievements);
const spinCountStore = writable(storedSpinCount); // Separate store for spin count


// Subscribe to store changes and update localStorage
if (browser) {
    // Save only the unlocked status for achievements to keep storage lean
    achievements.subscribe((value) => {
        const achievementsToSave = {};
        for (const key in value) {
            achievementsToSave[key] = { unlocked: value[key].unlocked };
        }
        localStorage.setItem(storageKey, JSON.stringify(achievementsToSave));
        // console.log("Achievements saved to localStorage");
    });
    spinCountStore.subscribe((value) => {
         localStorage.setItem(spinCountKey, String(value));
         // console.log("Spin count saved to localStorage");
    });
}


// --- Store Actions ---
export function unlockAchievement(key) {
    if (!browser) return false;
    let unlockedNow = false;
    achievements.update(currentData => {
        if (currentData.hasOwnProperty(key) && !currentData[key].unlocked) {
            console.log(`Unlocking achievement: ${key}`);
            unlockedNow = true;
            return {
                ...currentData,
                [key]: { ...currentData[key], unlocked: true } // Update nested property
            };
        }
        return currentData;
    });
    return unlockedNow;
}

export function incrementSpinCount() {
    if (!browser) return false;
    let unlockedFirstSpin = false;
    spinCountStore.update(currentCount => currentCount + 1);

    // Read achievements store to check conditions AFTER updating count
    // Note: This read might happen *before* the achievements store reflects
    // the potential unlock below if not careful with timing.
    // It's better to check within the 'achievements.update' if possible,
    // or use derived stores for complex checks.
    let currentAchievements;
    const unsubscribe = achievements.subscribe(value => { currentAchievements = value; }); // Get current value
    unsubscribe(); // Immediately unsubscribe

    const currentSpinCount = parseInt(localStorage.getItem(spinCountKey) || '0', 10); // Read latest saved count

    if (currentSpinCount >= 1 && currentAchievements && !currentAchievements.firstSpin.unlocked) {
       if (unlockAchievement('firstSpin')) { // Call unlockAchievement, it handles update
           unlockedFirstSpin = true;
       }
    }
    // Add more spin count achievement checks here... using unlockAchievement('...')

    return unlockedFirstSpin;
}

// Export stores and helpers
export const achievementStore = achievements; // Export the main store
export const spinCount = spinCountStore; // Export spin count separately

// Helper function (no change needed)
export function formatAchievementKey(key) {
  if (!key) return '';
  let formatted = key.replace(/([A-Z])/g, ' $1');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Add a helper to get achievement data by key (optional)
export function getAchievementData(key, achievementsData) {
    return achievementsData?.[key] || null;
}

// Default locked icon export (used in the page)
export { lockedIcon };