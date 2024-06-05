import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { RadixDappToolkit, RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { GatewayApiProvider } from "./context/GatewayApiProvider.js";
import { RdtProvider } from "./context/RdtProvider.js";
import { AccountProvider } from "./AccountContext.js";
import { dAppDefinitionAddress } from "./constants.js";

// Initialize the Gateway API for network queries and the Radix Dapp Toolkit for connect button and wallet usage.
const dappConfig = {
  // networkId is 2 for the Stokenet test network, 1 for Mainnet
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Hello Token dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
};
// Instantiate Radix Dapp Toolkit
const rdt = RadixDappToolkit(dappConfig);
console.log("dApp Toolkit: ", rdt);
// Instantiate Gateway API
const gatewayApi = GatewayApiClient.initialize(dappConfig);
console.log("gatewayApi: ", gatewayApi);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RdtProvider value={rdt}>
      <GatewayApiProvider value={gatewayApi}>
        <AccountProvider>
          <App />
        </AccountProvider>
      </GatewayApiProvider>
    </RdtProvider>
  </React.StrictMode>
);
