import {
  DataRequestBuilder,
  RadixDappToolkit,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";

// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/dapp-metadata
// then use that account for your dAppDefinitionAddress
const dAppDefinitionAddress = "";
// Instantiate a component at https://stokenet-console.radixdlt.com/transaction-manifest using the instantiate_hello.rtm manifest and your deployed package address to get the component address
const componentAddress = "";

// ************ Connect to the Radix network ************
// Instantiate RadixDappToolkit to connect to the Radix network and wallet
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppDefinitionAddress,
  networkId: RadixNetwork.Stokenet,
  applicationName: "Hello",
  applicationVersion: "1.0.0",
});
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
    "try_deposit_batch_or_refund"
    Expression("ENTIRE_WORKTOP")
    None
;`;

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("free_token result: ", result.value);
};
