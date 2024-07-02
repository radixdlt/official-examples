import {
  RadixDappToolkit,
  DataRequestBuilder,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { instantiateManifest } from "./manifests/instantiate_gumball_machine";
import { buyGumballManifest } from "./manifests/buy_gumball";
import { setPriceManifest } from "./manifests/set_price";
import { withdrawManifest } from "./manifests/withdraw_earnings";
import { refillManifest } from "./manifests/refill_gumball_machine";

// ************ Connect to the Radix network ************
// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/configure-metadata
// then use that account for your dAppDefinitionAddress
const dAppDefinitionAddress =
  "account_tdx_2_128mzv582sa7ang9hvkfz3xp07hjg8uegsyuv72nn6xcexj2t82nnuc";

// Instantiate Radix Dapp Toolkit to connect to the Radix wallet
const rdt = RadixDappToolkit({
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Hello Token dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
});

// Instantiate Gateway API client to query the Radix network
const gatewayApi = GatewayApiClient.initialize(rdt.gatewayApi.clientConfig);

// ********** Global states **********
let account; // Users connected wallet account
let componentAddress; // GumballMachine component address on Stokenet
let ownerBadgeAddress; // Gumball Machine Owner Badge resource address
let gumballResourceAddress; // GUM token resource address

const xrdAddress =
  "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc"; //Stokenet XRD resource address

// ************ Connect to wallet and display details ************
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
// Subscribe to updates to the user's shared wallet data, then display the account name and address.
rdt.walletApi.walletData$.subscribe((walletData) => {
  console.log("connected wallet data: ", walletData);
  // Set the account variable to the first and only connected account from the wallet
  account = walletData.accounts[0];
  // Display the account name and address on the page
  document.getElementById("accountName").innerText =
    account?.label ?? "None connected";
  document.getElementById("accountAddress").innerText =
    account?.address ?? "None connected";
});

// ************ Instantiate component and fetch component and resource addresses ************
document.getElementById("instantiateComponent").onclick = async function () {
  const packageAddress = document.getElementById("packageAddress").value;
  const gumballPrice = document.getElementById("gumballPrice").value;
  const manifest = instantiateManifest(
    packageAddress,
    gumballPrice,
    account.address
  );
  console.log("Instantiate Manifest: ", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("Instantiate Result: ", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Instantiate transaction status:", transactionStatus);

  // Fetch the details of changes committed to ledger from Gateway API
  const committedDetails = await gatewayApi.transaction.getCommittedDetails(
    result.value.transactionIntentHash
  );
  console.log("Instantiate committed details:", committedDetails);

  // Set addresses from details committed to the ledger in the transaction
  componentAddress = committedDetails.transaction.affected_global_entities[2];
  ownerBadgeAddress = committedDetails.transaction.affected_global_entities[3];
  gumballResourceAddress =
    committedDetails.transaction.affected_global_entities[4];

  // Show the addresses on the page
  showAddresses();
  // Update the gumball amount and earnings displayed on the page
  fetchAndShowGumballMachineState();
};

function showAddresses() {
  document.getElementById("componentAddress").innerText =
    componentAddress ?? "None";
  document.getElementById("ownerBadgeAddress").innerText =
    ownerBadgeAddress ?? "None";
  document.getElementById("gumballResourceAddress").innerText =
    gumballResourceAddress ?? "None";
}

// ************ Fetch and update displayed component state ************
async function fetchAndShowGumballMachineState() {
  // Use Gateway API to fetch component details
  if (componentAddress) {
    const componentDetails =
      await gatewayApi.state.getEntityDetailsVaultAggregated(componentAddress);
    console.log("Component Details:", componentDetails);

    // Get the price, number of gumballs, and earnings from the component state
    const price = componentDetails.details.state.fields.find(
      (field) => field.field_name === "price"
    )?.value;
    const numOfGumballs = componentDetails.fungible_resources.items.find(
      (item) => item.resource_address === gumballResourceAddress
    )?.vaults.items[0].amount;
    const earnings = componentDetails.fungible_resources.items.find(
      (item) => item.resource_address === xrdAddress
    )?.vaults.items[0].amount;

    // Show the values on the page
    document.getElementById("numOfGumballs").innerText = numOfGumballs;
    document.getElementById("price").innerText = price;
    document.getElementById("earnings").innerText = earnings + " XRD";
  }
}

// ************ Buy Gumball ************
document.getElementById("buyGumball").onclick = async function () {
  const xrdAmount = document.getElementById("price").innerText;
  const manifest = buyGumballManifest(
    xrdAmount,
    xrdAddress,
    account.address,
    componentAddress
  );
  console.log("buy_gumball manifest:", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("Buy Gumball result:", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Buy Gumball transaction status:", transactionStatus);

  // Fetch and update the gumball amount and earnings values displayed
  fetchAndShowGumballMachineState();
};

// ************ Set Price ************
document.getElementById("setPrice").onclick = async function () {
  const newPrice = document.getElementById("newPrice").value;
  const manifest = setPriceManifest(
    newPrice,
    account.address,
    componentAddress,
    ownerBadgeAddress
  );
  console.log("Set Price manifest:", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("Set Price result:", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Set Price transaction status:", transactionStatus);

  // Fetch and update the price displayed on the page
  fetchAndShowGumballMachineState();
};

// ************ Refill Gumball Machine ************
document.getElementById("refill").onclick = async function () {
  const manifest = refillManifest(
    account.address,
    componentAddress,
    ownerBadgeAddress
  );
  console.log("Refill manifest:", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("Refill result: ", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Refill transaction status:", transactionStatus);

  // Fetch and update the gumball amount displayed on the page
  fetchAndShowGumballMachineState();
};

// ************ Withdraw Earnings ************
document.getElementById("withdrawEarnings").onclick = async function () {
  const manifest = withdrawManifest(
    account.address,
    componentAddress,
    ownerBadgeAddress
  );
  console.log("Withdraw Earnings manifest:", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("Withdraw Earnings result:", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Withdraw Earnings transaction status:", transactionStatus);

  // Fetch and update the earnings displayed on the page
  fetchAndShowGumballMachineState();
};

// Update and display addresses and component state on page load. This is
// useful if global states have been set in the code above from a previous
// instantiation of the component.
showAddresses();
fetchAndShowGumballMachineState();
