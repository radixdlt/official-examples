import type {
  RadixDappToolkit,
  WalletDataState,
} from "@radixdlt/radix-dapp-toolkit";
import { writable } from "svelte/store";

// ********* Radix Dapp Toolkit store *********
// As the Radix Dapp Toolkit produces a value that you only wait for once this rdt store could alternatively be a promise.
export const rdt = writable<null | RadixDappToolkit>(null);

export const walletData = writable<null | WalletDataState>(null);
