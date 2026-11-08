// Contest demo mode: some screens return fixed demo data instead of calling the backend.
// Defaults to on to keep the presented behavior; set EXPO_PUBLIC_DEMO_MODE=false to use the real API.
export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE !== 'false';
