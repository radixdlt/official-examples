import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { RadixDappToolkit, RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GatewayApiProvider } from "./context/GatewayApiProvider.jsx";
import { RdtProvider } from "./context/RdtProvider.jsx";
import { AccountProvider } from "./AccountContext.jsx";

// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/configure-metadata
// then use that account for your dAppDefinitionAddress
const dAppDefinitionAddress =
  "account_tdx_2_12y7ue9sslrkpywpgqyu3nj8cut0uu5arpr7qyalz7y9j7j5q4ayhv6";

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

ReactDOM.createRoot(document.getElementById("root")).render(
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
