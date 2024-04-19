import { writable } from "svelte/store";

// As the Gateway API and Radix Dapp Toolkit each produce a value that you only wait for once these stores
// could alternatively be a promise. walletData can update continuously so it should alway be a store.
export const gatewayApi = writable(null);
export const rdt = writable(null);

export const walletData = writable(null);
