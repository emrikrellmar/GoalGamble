import { writable } from 'svelte/store';

export const authStore = writable({
    user: null,
    loading: true
});

/**
 * Updates the auth store with user data
 * @param {Object|null} user - The user object from Supabase or null if signed out
 */
export function updateAuthStore(user) {
    authStore.set({
        user,
        loading: false
    });
}