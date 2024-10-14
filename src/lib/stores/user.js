import { writable } from 'svelte/store';

export const user = writable({
  balance: 1000 // Start with 1000 coins
});