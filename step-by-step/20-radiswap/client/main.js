import {
  RadixDappToolkit,
  DataRequestBuilder,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
import {
  getAddLiquidityManifest,
  getRemoveLiquidityManifest,
  getSwapManifest,
} from "./manifests";

// ********** Global states **********
const dAppDefinitionAddress =
  "account_tdx_2_129js3exttlk8fauagqlh8v7m4880rkp9dmjmt5z5swemeu8sqwrryz"; // Radiswap dApp definition address on Stokenet
const componentAddress =
  "component_tdx_2_1cqmul9y5as3766nxuwwg2m6wgtkl43yj69c6axsvp5xaf9vla8zja7"; // Radiswap component address on Stokenet
let account; // Users connected wallet account
const poolResource1 = {}; // First resource in the pool
const poolResource2 = {}; // Second resource in the pool

// ************ Connect to the Radix network ************
// Instantiate DappToolkit to connect to the Radix network and wallet
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppDefinitionAddress,
  networkId: RadixNetwork.Stokenet,
  applicationName: "Radiswap",
  applicationVersion: "1.0.0",
});

// ************ Get pool details from the network ************
// Get the pool address from the component details
const componentDetails =
  await rdt.gatewayApi.state.getEntityDetailsVaultAggregated(componentAddress);
console.log("Component details: ", componentDetails);
const poolAddress = componentDetails?.details.state.fields[0].value;

// Get the pool metadata
const poolMetadata = await rdt.gatewayApi.state.getAllEntityMetadata(
  poolAddress
);
console.log("Pool metadata: ", poolMetadata);
// identify the pool unit address from metadata
const poolUnitAddress = poolMetadata?.find((pm) => pm.key === "pool_unit")
  ?.value.typed.value;
// identify the pool resource addresses from metadata
[poolResource1.address, poolResource2.address] = poolMetadata?.find(
  (pm) => pm.key === "pool_resources"
)?.value.typed.values;

// Get the first pool resource symbol from metadata
poolResource1.metadata = await rdt.gatewayApi.state.getAllEntityMetadata(
  poolResource1.address
);
poolResource1.symbol = poolResource1.metadata?.find(
  (rm) => rm.key === "symbol"
)?.value.typed.value;

// Get the second pool resource symbol from metadata
poolResource2.metadata = await rdt.gatewayApi.state.getAllEntityMetadata(
  poolResource2.address
);
poolResource2.symbol = poolResource2.metadata?.find(
  (rm) => rm.key === "symbol"
)?.value.typed.value;

getPoolLiquidity(); // Update displayed pool liquidity - Defined in Pool Section

// ************ Connect to wallet ************
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
// Subscribe to updates to the user's shared wallet data, then display the account name and address.
rdt.walletApi.walletData$.subscribe((walletData) => {
  console.log("connected wallet data: ", walletData);
  // Set the account variable to the first and only connected account from the wallet
  account = walletData.accounts[0];
  console.log("Account: ", account);

  getPoolUnitBalance(); // Update displayed pool unit balance - Defined in Pool Section
});

// ************ Swap Section ************
const swapAmountInput = document.getElementById("swapAmount");
const swapTokenInput = document.getElementById("swapToken");
const swapTokenOption1 = document.getElementById("swapTokenOption1");
const swapTokenOption2 = document.getElementById("swapTokenOption2");
const swapButton = document.getElementById("swapBtn");

// Update token options with tokens from the on ledger pool component
swapTokenOption1.innerText = `${poolResource1.symbol} → ${poolResource2.symbol}`;
swapTokenOption1.value = poolResource1.address;

swapTokenOption2.innerText = `${poolResource2.symbol} → ${poolResource1.symbol}`;
swapTokenOption2.value = poolResource2.address;

// On swap button click sent transaction to wallet to swap tokens
swapButton.onclick = async function () {
  const manifest = getSwapManifest({
    accountAddress: account.address,
    resourceAddress: swapTokenInput.value,
    amount: swapAmountInput.value,
    componentAddress,
  });

  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;

  getPoolLiquidity(); // Update displayed pool liquidity - Defined in Pool Section
};

// ************ Pool Section ************
const poolBalanceText = document.getElementById("poolBalance");
const poolUnitsText = document.getElementById("poolUnits");

// Fetch pool liquidity from network and update display
async function getPoolLiquidity() {
  // Fetch pool details from network
  const poolState = await rdt.gatewayApi.state.getEntityDetailsVaultAggregated(
    poolAddress
  );

  // Update pool resource balances from pool state
  poolResource1.balance =
    poolState?.fungible_resources.items[0].vaults.items[0].amount;
  poolResource2.balance =
    poolState?.fungible_resources.items[1].vaults.items[0].amount;
  // Update displayed pool liquidity
  poolBalanceText.innerText = `${poolResource1.balance} ${poolResource1.symbol} + ${poolResource2.balance} ${poolResource2.symbol}`;
}

// Fetch pool unit balance from network and update display
async function getPoolUnitBalance() {
  if (!account) return;
  // Fetch account state from network
  const accountState =
    await rdt.gatewayApi.state.getEntityDetailsVaultAggregated(account.address);

  // Get the pool unit balance from the account state
  const poolUnitBalance =
    accountState.fungible_resources.items.find(
      (fr) => fr.resource_address === poolUnitAddress
    )?.vaults.items[0].amount ?? 0;
  // Update displayed pool unit balance
  poolUnitsText.innerText = `${poolUnitBalance} PU`;
}

// Add Liquidity
const deposit1Input = document.getElementById("deposit1");
const deposit1TokenText = document.getElementById("deposit1Token");
const deposit2Input = document.getElementById("deposit2");
const deposit2TokenText = document.getElementById("deposit2Token");
const depositButton = document.getElementById("depositBtn");

// Update input token symbols from pool component values
deposit1TokenText.innerText = poolResource1.symbol;
deposit2TokenText.innerText = poolResource2.symbol;

// On deposit button click sent transaction to wallet to add liquidity to the pool, swapping resources for PU tokens
depositButton.onclick = async function () {
  const amount1 = deposit1Input.value;
  const amount2 = deposit2Input.value;

  const manifest = getAddLiquidityManifest({
    accountAddress: account.address,
    amount1,
    amount2,
    poolResourceAddress1: poolResource1.address,
    poolResourceAddress2: poolResource2.address,
    componentAddress,
  });

  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;

  getPoolLiquidity(); // Update displayed pool liquidity - Defined in Pool Section
  getPoolUnitBalance(); // Update displayed pool unit balance - Defined in Pool Section
};

// Remove Liquidity
const withdrawInput = document.getElementById("withdraw");
const withdrawTokenText = document.getElementById("withdrawToken");
const withdrawButton = document.getElementById("withdrawBtn");

// Update withdraw token symbols from pool component values
withdrawTokenText.innerText = `PU → ${poolResource1.symbol} + ${poolResource2.symbol}`;

// On withdraw button click sent transaction to wallet to remove liquidity from the pool, swapping PU tokens back for resources in the pool
withdrawButton.onclick = async function () {
  const amount = withdrawInput.value;

  const manifest = getRemoveLiquidityManifest({
    accountAddress: account.address,
    amount,
    poolUnitAddress,
    componentAddress,
  });

  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;

  getPoolLiquidity();
  getPoolUnitBalance();
};
