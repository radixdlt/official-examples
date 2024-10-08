import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { RadixDappToolkit, RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GatewayApiProvider } from "./context/GatewayApiProvider.jsx";
import { RdtProvider } from "./context/RdtProvider.jsx";
import { AccountProvider } from "./AccountContext.jsx";
import { dAppDefinitionAddress } from "./constants.js";

// Instantiate Radix Dapp Toolkit for connect button and wallet usage.
const rdt = RadixDappToolkit({
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Hello Token dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
});
console.log("dApp Toolkit: ", rdt);
// Instantiate Gateway API for network queries
const gatewayApi = GatewayApiClient.initialize(rdt.gatewayApi.clientConfig);
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
  </React.StrictMode>,
);
