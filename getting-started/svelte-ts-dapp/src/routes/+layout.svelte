<script lang="ts">
  import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
  import {
    DataRequestBuilder,
    RadixDappToolkit,
    RadixNetwork,
  } from "@radixdlt/radix-dapp-toolkit";
  import { onMount } from "svelte";
  import { gatewayApi, rdt, walletData } from "$lib/stores";
  import { dAppId } from "$lib/constants";
  import Nav from "./Nav.svelte";

  onMount(() => {
    // Initialize the Gateway API for network queries and the Radix Dapp Toolkit for connect button and wallet usage.
    const applicationVersion = "1.0.0";
    const applicationName = "Hello Token dApp";
    const networkId = RadixNetwork.Stokenet; // network ID 2 for the stokenet test network, 1 for mainnet

    // Instantiate Gateway API
    $gatewayApi = GatewayApiClient.initialize({
      networkId,
      applicationName,
      applicationVersion,
    });
    console.log("gatewayApi: ", $gatewayApi);

    // Instantiate DappToolkit
    $rdt = RadixDappToolkit({
      dAppDefinitionAddress: dAppId,
      networkId,
      applicationName,
      applicationVersion,
    });
    console.log("dApp Toolkit: ", $rdt);

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
