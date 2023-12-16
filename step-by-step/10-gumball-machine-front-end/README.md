# 10 Gumball Machine Front End dApp

In the previous example we looked at the basics of how to create a dApp with a
simple front end. In this one we'll take this further by applying the same
concepts to our Gumball Machine package.

> **If you aren't planning on using a front end, you can skip this example and
> move strait on to the next.**

We have a deployed Gumball Machine package to the test network in example 8, so
all this example will introduce is a front end for that package. (You may need
to go back to 8 if you don't already have a deployed and working Gumball
Machine) This example will be more complex than the last, introducing the
Gateway API to query network state, and using all our transaction manifests from
example 8. Just like the last example though, you'll want some familiarity with
JavaScript and front end web development before jumping in.

- [File Structure](#file-structure)
- [Gumball Machine Transactions](#gumball-machine-transactions)
- [RDT and The Gateway API](#rdt-and-the-gateway-api)
- [Running the Example](#running-the-example)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
    - [Scrypto](#scrypto)
      - [Build the scrypto package:](#build-the-scrypto-package)
      - [Deploy the package to Stokenet:](#deploy-the-package-to-stokenet)
    - [Creating a dApp Definition](#creating-a-dapp-definition)
    - [Front End Client](#front-end-client)
  - [Using the dApp](#using-the-dapp)

## File Structure

Our file structure will be similar to the last example, with the addition of a
`manifests` directory to hold our transaction manifests, now converted into
JavaScript functions so they can be called by `main.js`.

```
/
├── client/
│  ├── index.html
│  ├── main.js
│  ├── package.json
│  ├── style.css
│  ├── manifests
│  └── ...
└── scrypto-package/
   └── ...
```

## Gumball Machine Transactions

The transactions sent by the front end cover the `instantiate_gumball_machine`
function and all but one of the blueprint's methods (`get_price` isn't included
as we can get the price from the component state via the Gateway API instead).

Each transaction manifest is generated from one of the manifest functions in
`client/manifests/`. These functions take the same arguments as the
corresponding blueprint method plus necessary addresses. For example, the
`refill_gumball_machine` manifest function:

```javascript
export const refillManifest = (
  accountAddress,
  componentAddress,
  ownerBadgeAddress
) => `
CALL_METHOD
  Address("${accountAddress}")
  "create_proof_of_amount"
  Address("${ownerBadgeAddress}")
  Decimal("1")
;
CALL_METHOD
  Address("${componentAddress}")
  "refill_gumball_machine"
;
CALL_METHOD
  Address("${accountAddress}")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP")
;`
```

(You can also see that we've used our owner badge in this manifest, to pass the
required proof.)

The transactions are then sent to the wallet for signing and submission to the
network:

```javascript
// Send manifest to wallet for signing
const result = await rdt.walletApi.sendTransaction({
  transactionManifest: manifest,
  version: 1,
});
```

The effects of these transactions are tracked and displayed with the help of the
Gateway API

## RDT and The Gateway API

We saw how the Radix Developer Toolkit (RDT) can be used to interact with the
network via the Radix Wallet in the last example. It also provides access to the
Radix network through the Gateway API. The Gateway API is our main way of
interacting with the Radix network. It is used by the Radix Wallet and both the
Console and Dashboard that we've been using to deploy packages and instantiate
components. It gives us access to
[a wide array of different network interaction](https://radix-babylon-gateway-api.redoc.ly/#tag/SubAPIs),
but we'll use it to query the network for the state of the ledger, the status of
the network and of specific transactions. Specifically, we'll be using the
Gateway API for:

- Getting the status of various transactions after they've been submitted to the
  network via the wallet:

  ```javascript
  // Fetch the transaction status from the Gateway API
  const transactionStatus = await rdt.gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  ```

- Finding the addresses of the new component and resources after instantiation (
  as component instantiation is a part of the front end this time):

  ```javascript
  // Fetch the details of changes committed to ledger from Gateway API
  const committedDetails = await rdt.gatewayApi.transaction.getCommittedDetails(
    result.value.transactionIntentHash
  );
  console.log("Instantiate committed details:", committedDetails);

  // Set addresses from details committed to the ledger in the transaction
  componentAddress = committedDetails.transaction.affected_global_entities[2];
  ownerBadgeAddress = committedDetails.transaction.affected_global_entities[3];
  gumballResourceAddress =
    committedDetails.transaction.affected_global_entities[4];
  ```

- Querying the ledger state of our Gumball Machine component to track price,
  number of gumballs and earnings:

  ```javascript
  async function fetchAndShowGumballMachineState() {
    // Use Gateway API to fetch component details
    if (componentAddress) {
      const componentDetails =
        await rdt.gatewayApi.state.getEntityDetailsVaultAggregated(
          componentAddress
        );
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
  ```

  We then use these values to update the page:

  ```javascript
      // Show the values on the page
      document.getElementById("numOfGumballs").innerText = numOfGumballs;
      document.getElementById("price").innerText = price;
      document.getElementById("earnings").innerText = earnings + " XRD";
    }
  }
  ```

## Running the Example

Now we'll finally get to see the Gumball Machine working in the browser.

### Prerequisites

These are needed for all dapps with front ends.

1. The Radix Wallet
   [more info here](https://docs.radixdlt.com/docs/radix-wallet-overview)
2. The Radix Wallet Connector extension. Download from the
   [chrome store](https://chromewebstore.google.com/detail/radix-wallet-connector/bfeplaecgkoeckiidkgkmlllfbaeplgm)
   or [download from github](https://github.com/radixdlt/connector-extension/)

3. The Radix Wallet needs a Stokenet Account with funds. If you don't already
   have one:

   1. If you haven't already, open the Radix Wallet on your phone and run
      through first time set up.
   2. You will need to connect to the test network in Settings > App Settings >
      Gateways > Stokenet (testnet) Gateway.
   3. Create a new account.
   4. Get some test token for transaction fees by clicking on;
      - the account name
      - the three dots "...",
      - "Dev Preferences",
      - the "Get XRD Text Tokens" button.

4. The Wallet also needs to be in Developer Mode. You can enable this in
   Settings > App Settings > Developer Mode.

### Setup

There are separate setup steps for the scrypto package and the front end client.

#### Scrypto

This time instantiating the Gumball Machine component is built into the front
end, so once you have your package address and dapp definition we can move on.

**The package used in this example is the same as in example 8. If you have
already deployed it and have the package address you can skip to
[Creating a dApp Definition](#creating-a-dapp-definition).**

##### Build the scrypto package:

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/10-gumball-machine-front-end
    ```

2.  From inside the `scrypto` directory, build the code: `scrypto build`
3.  Two important files (`refillable_gumball_machine.rpd` and
    `refillable_gumball_machine.wasm`) will be generated in
    `scrypto/target/wasm32-unknown-unknown/release/`. You will need them for the
    next step.

##### Deploy the package to Stokenet:

1. Go to the
   [Stokenet Developer Console Website](https://stokenet-console.radixdlt.com/deploy-package)
2. Connect the Wallet Via the Connect Button
3. Navigate to Deploy Package
4. Upload both `refillable_gumball_machine.rpd` and
   `refillable_gumball_machine.wasm`
5. In the "Owner role" and "Owner role updatable" dropdowns select "None", as we
   do not have any package owner related functionality yet.
6. Click on "Send to the Radix Wallet"
7. Go to your wallet where it should be asking you to approve the transaction
8. On the wallet "Slide to Sign" the deployment transaction. You may have to
   "Customize" which account pays the transaction fee if your account has no
   funds.
9. Once the transaction completes, the deployed _package address_ should then be
   displayed back in the Stokenet Console. Make a note of it for the next step.

#### Creating a dApp Definition

1. Create a new account in the Radix Wallet. This is the account which we will
   convert to a dapp Definition account.
2. Head to the
   [Developer Console’s Manage dApp Definitions page](https://stokenet-console.radixdlt.com/dapp-metadata).
   This page provides a simple interface to set the metadata on an account to
   make it a dapp definition.
3. Connect your Radix Wallet to the Dashboard and select the account you just
   created to be a dapp definition.
4. In the dropdown menu next to "Select Account", make sure the account is the
   same account you created to be a dapp definition.
5. Check the box for "This Account is a dApp Definition".
6. Fill in the name and description. - _icon_url and Linked Websites would be
   essential for any production app, but we're keeping this example as simple as
   we can._
7. Click "Send Update Transaction to the Radix Wallet"
8. An approve transaction should appear in your Radix Wallet to confirm. You may
   have to "Customize" which account pays the transaction fee if your dapp
   definition account has no funds. Confirm the transaction.

#### Front End Client

1. To run the client, we first need to add our dapp definition to the start of
   `client/main.js`, e.g.

   ```javascript
   const dAppDefinitionAddress =
     "account_tdx_2_128mzv582sa7ang9hvkfz3xp07hjg8uegsyuv72nn6xcexj2t82nnuc";
   ```

2. Next we install the dependencies:

   ```sh
   cd client
   npm install
   ```

3. Then we start the client:

   ```sh
   npm run dev
   ```

4. In the console, vite will tell you where the client is running. It should be
   `http://localhost:5173/`. Open that in your browser.

### Using the dApp

1. Connect your Radix Wallet to the client by clicking the "Connect" button in
   the top right corner of Connect Account section. When you do you'll see your
   account name and address displayed underneath.

2. In the "Instantiate Gumball Machine" section, enter the package address you
   deployed earlier and click "Instantiate Component". You should see a
   transaction appear in your wallet. Approve it and wait for it to complete.
   When it does you'll see the component address, Gumball resource address and
   Owner badge address displayed

   _You can save the component and resource addresses to `client/main.js`, in
   the "Global states" section, to skip this step in the future. e.g._

   ```javascript
   // ********** Global states **********
   let account; // Users connected wallet account
   let componentAddress =
     "component_tdx_2_1crvgsaeru4arlam8crmfnkm246f8a2evlruqf4nk6leul88qgdfuxk";
   let ownerBadgeAddress =
     "resource_tdx_2_1tkmpclln4w0kd67yvx0jnl4uvyewhp6xfnzvstg4afem4m4zlcn5wn";
   let gumballResourceAddress =
     "resource_tdx_2_1t5s0p252umfc0e93d09mxnl49nfzkhfmyug5ftgxvy7lt32gf2a7la";
   ```

3. Once the Gumball Machine component has been instantiated you can use the
   methods in the Public and Owner Restricted sections. Try them out and see the
   results on the page. Each button will send a transaction manifest to your
   connected wallet to review and sign. Try changing connected accounts to see
   how the Owner Restricted methods behave differently for different accounts.
