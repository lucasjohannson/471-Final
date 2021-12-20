import { writable } from "svelte/store";

export const viewName = writable("login");
export const userName = writable("");
export const userFirstName = writable("");
export const userLastName = writable("");
export const password = writable("");
export const userAllergies = writable([]);
export const groceryCart = writable([]);
export const userAddress = writable("");