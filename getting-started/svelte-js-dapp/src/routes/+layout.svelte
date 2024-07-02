<script>
  import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
  import {
    DataRequestBuilder,
    RadixDappToolkit,
    RadixNetwork,
  } from "@radixdlt/radix-dapp-toolkit";
  import { onMount } from "svelte";
  import { gatewayApi, rdt, walletData } from "$lib/stores";
  import { dAppDefinitionAddress } from "$lib/constants";
  import Nav from "./Nav.svelte";

  onMount(() => {
    // Initialize the Radix Dapp Toolkit for connect button and wallet usage.
    $rdt = RadixDappToolkit({
      networkId: RadixNetwork.Stokenet,
      applicationVersion: "1.0.0",
      applicationName: "Hello Token dApp",
      applicationDappDefinitionAddress: dAppDefinitionAddress,
    });
    console.log("dApp Toolkit: ", $rdt);

    // Initialize the Gateway API for network queries
    $gatewayApi = GatewayApiClient.initialize($rdt.gatewayApi.clientConfig);

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
    padding: 5rem 1rem;
  }
</style>
