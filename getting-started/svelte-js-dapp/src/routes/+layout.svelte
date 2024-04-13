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
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5rem;
    padding: 5rem 0;
  }
</style>
