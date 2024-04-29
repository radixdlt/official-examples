import {
  DataRequestBuilder,
  RadixDappToolkit,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";

// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/configure-metadata
// then use that account for your dAppDefinitionAddress
const dAppDefinitionAddress = "";
// Instantiate a component at https://stokenet-console.radixdlt.com/transaction-manifest using the instantiate_hello.rtm manifest and your deployed package address to get the component address
const componentAddress = "";

// ************ Connect to the Radix network ************
// Create a dapp configuration object for the Radix Dapp Toolkit
const dappConfig = {
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Hello Token dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
};
// Instantiate DappToolkit to connect to the Radix wallet and network
const rdt = RadixDappToolkit(dappConfig);
// Connect a user account when wallet is connected
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));

// ************ Use free_token method ************
document.getElementById("free_token").onclick = async function () {
  // Get the user's connected account address
  const accountAddress = rdt.walletApi.getWalletData().accounts[0].address;

  // Create a manifest to call the free_token method
  const manifest = `
CALL_METHOD
    Address("${componentAddress}")
    "free_token"
;
CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
`;

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("free_token result: ", result.value);
};
