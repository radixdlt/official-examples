import { RadixDappToolkit, RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RdtProvider } from "./RdtProvider.jsx";

// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/dapp-metadata
// then use that account for your dAppId
const dAppId =
  "account_tdx_2_12y7yjk7h0k5cd45au6kthphe83pxrutencm9xh3vtu3p8kllcgxf33";
// Instantiate DappToolkit
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppId,
  networkId: RadixNetwork.Stokenet, // network ID 2 is for the stokenet test network, network ID 1 is for mainnet
  applicationName: "Hello Token dApp",
  applicationVersion: "1.0.0",
});
console.log("dApp Toolkit: ", rdt);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RdtProvider value={rdt}>
      <App />
    </RdtProvider>
  </React.StrictMode>,
);
