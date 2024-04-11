import { RadixDappToolkit, RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RdtProvider } from "./RdtProvider.jsx";

const dAppId = import.meta.env.VITE_API_DAPP_ID;

const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppId,
  networkId: RadixNetwork.Stokenet, // network ID 2 is for the stokenet test network, network ID 1 is for mainnet
  applicationName: "Yield AMM dApp",
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
