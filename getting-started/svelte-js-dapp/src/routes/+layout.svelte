<script>
  import {
    DataRequestBuilder,
    RadixDappToolkit,
    RadixNetwork,
  } from "@radixdlt/radix-dapp-toolkit";
  import { onMount } from "svelte";
  import { rdt, walletData } from "$lib/stores";
  import { dAppId } from "$lib/constants";
  import Nav from "./Nav.svelte";

  onMount(() => {
    // Initialize Radix Dapp Toolkit for connect button, wallet and gateway api usage
    $rdt = RadixDappToolkit({
      dAppDefinitionAddress: dAppId,
      networkId: RadixNetwork.Stokenet, // network ID 2 is for the stokenet test network, network ID 1 is for mainnet
      applicationName: "Hello Token dApp",
      applicationVersion: "1.0.0",
    });
    console.log("dApp Toolkit: ", rdt);

    // Fetch the user's account address(es) from the wallet
    $rdt?.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1));

    // Subscribe to updates to the user's shared wallet data and store it in the walletData store
    $rdt?.walletApi.walletData$.subscribe((data) => {
      $walletData = data;
    });
  });
</script>

<Nav />

<main>
  <slot />
</main>

<style>
  :global(:root) {
    --grey-1: #0d0f16;
    --grey-2: #12151f;
    --grey-3: #19203c;
    --grey-4: #565962;
    --grey-5: #74777d;
    --grey-6: #ffffff;
    --radix-blue: #052cc0;
    --radix-pink: #ff43ca;
    --gradient-account-1: linear-gradient(
      277deg,
      #01e2a0 -0.6%,
      #052cc0 102.8%
    );
    --gradient-account-2: linear-gradient(
      276deg,
      #ff43ca -14.55%,
      #052cc0 102.71%
    );

    font-family: "IBM Plex Sans", sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: var(--grey-6);
    background-color: var(--grey-2);

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
</style>
