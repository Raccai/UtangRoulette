// src/routes/+layout.js

// This load function runs on initial server load AND subsequent client-side navigations
// BEFORE the layout/page components render.
// It should NOT control the initial loading screen visibility, as that's a one-time client event.

export const load = async ({ fetch, url }) => {
  console.log(`[+layout.js] load function running for path: ${url.pathname}`);

  // --- Example: Fetch data needed by the layout on *every* page ---
  // Replace this with actual data fetching if layout needs it
  // (e.g., user session, global settings). 
  return {
  };
}