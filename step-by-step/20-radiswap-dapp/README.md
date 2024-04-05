# 20. Radiswap

The Radiswap dApp is the last example in the step-by-step learning journey. It
takes the concepts learned in the previous sections and combines them into a
single, more complex demonstration. The Radiswap dApp is a decentralized
exchange (DEX) that allows users to swap tokens. The version that exists in this
repository is a simplified version of a DEX, but it still demonstrates the core
concepts.

### Contents

- [The Radiswap Scrypto Package](#the-radiswap-scrypto-package)
  - [Two Resource Pools](#two-resource-pools)
  - [The Swap Method](#the-swap-method)
  - [Radiswap Component Instantiation](#radiswap-component-instantiation)
  - [Event Emission](#event-emission)
- [The Radiswap Front End](#the-radiswap-front-end)
- [Using the Radiswap Scrypto Package in resim](#using-the-radiswap-scrypto-package-in-resim)
  - [Setup](#setup)
  - [Usage](#usage)
- [Using the Radiswap Front End on Stokenet](#using-the-radiswap-front-end-on-stokenet)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup-1)
    - [Scrypto](#scrypto)
      - [Build the scrypto package:](#build-the-scrypto-package)
      - [Deploy the package to Stokenet:](#deploy-the-package-to-stokenet)
      - [Creating a Radiswap Component](#creating-a-radiswap-component)
        - [Create Resources](#create-resources)
        - [Instantiate Radiswap Component](#instantiate-radiswap-component)
    - [Creating a dApp Definition](#creating-a-dapp-definition)
    - [Front End Client](#front-end-client)
  - [Using the dApp](#using-the-dapp)

## The Radiswap Scrypto Package

### Two Resource Pools

The Radiswap package is a customised wrapper around the standard TwoResourcePool
native blueprint with the addition of a swap function. There are a range of
[native pool blueprints](https://docs.radixdlt.com/docs/pool-component)
available in the Radix Engine, and the TwoResourcePool is one of the most
commonly used. It does what you would expect and holds two resources allowing
users to deposit and withdraw from the pool in exchange for Pool Unit resources
(often called LP tokens). This is a useful part of the functionality of many
dApps and these functions are accessed with the `add_liquidity` and
`remove_liquidity` methods. In our case the Radiswap blueprint extends the pool
blueprint's methods by also allowing users to swap between the two resources in
the pool.

### The Swap Method

The `swap` method accepts an input amount of one resource and returns an output
amount of the other resource.

```rs
pub fn swap(&mut self, input_bucket: Bucket) -> Bucket {
```

The exchange rate is determined by comparing the size of the resource pools with
a formula used in many automated market makers (AMMs), a constant product
formula that looks like this:

```
output_amount = input_amount * (output_reserves / (input_reserves + input_amount))
```

The
[checked math](https://docs.radixdlt.com/docs/code-hardening#pay-special-attention-to-decimal-operations)
version of this becomes:

```rs
let output_amount = input_amount
                .checked_mul(output_reserves)
                .unwrap()
                .checked_div(input_reserves.checked_add(input_amount).unwrap())
                .unwrap();
```

If you aren't familiar with the formula, you can find out more about it and how
it's used by looking up AMMs.

### Radiswap Component Instantiation

To instantiate a Radiswap component we need to provide 3 arguments:

- `owner_role` - what rule defines the component owner
- `resource_address1` - the first resource in the pool
- `resource_address2` - the second resource in the pool

The first of these is new to us. It's simply the full owner role declaration
that we've been declaring in blueprints before, usually either as
`OwnerRole::None` or using the `rule!` macro and some resource address, e.g.

```rust
OwnerRole::Fixed(rule!(require(
                owner_badge.resource_address()
            )))
```

Now that we've made it an argument we'll need to provide the full role in a
transaction manifest when we instantiate the component. To do that we'll use
some new
[Manifest Value Syntax](https://docs.radixdlt.com/v1/docs/manifest-value-syntax),
instead of the `rule!` shorthand, that works for Scrypto but doesn't in
manifests. This will give us a function call that looks something like this:

```
CALL_FUNCTION
    Address("<PACKAGE_ADDRESS>")
    "Radiswap"
    "new"
    Enum<OwnerRole::Fixed>(
        Enum<AccessRule::Protected>(
            Enum<AccessRuleNode::ProofRule>(
                Enum<ProofRule::Require>(
                    Enum<ResourceOrNonFungible::Resource>(
                        Address("<OWNER_BADGE_ADDRESS>")
                    )
                )
            )
        )
    )
    Address("<RESOURCE_ADDRESS_1>")
    Address("<RESOURCE_ADDRESS_2>")
;
```

Though for the rare case of no owner we could just put:

```
CALL_FUNCTION
    Address("<PACKAGE_ADDRESS>")
    "Radiswap"
    "new"
Enum<OwnerRole::None>()
    Address("<RESOURCE_ADDRESS_1>")
    Address("<RESOURCE_ADDRESS_2>")
```

### Event Emission

[Events in Scrypto](https://docs.radixdlt.com/docs/scrypto-events) are a way to
communicate to off chain clients. They are emitted by the component and can be
listened for to begin secondary actions with the
[Gateway](https://docs.radixdlt.com/docs/network-apis#gateway-api) or
[Core](https://docs.radixdlt.com/docs/network-apis#core-api) APIs. There are
many events that already exist in the core components. You may have noticed
these in transaction receipts on resim. In the Radiswap component we also emit
_custom_ events when different methods are called. For example a `SwapEvent`,
which contains the amount of each resource swapped:

```rs
#[derive(ScryptoSbor, ScryptoEvent)]
pub struct SwapEvent {
    pub input: (ResourceAddress, Decimal),
    pub output: (ResourceAddress, Decimal),
}
```

Is emitted whenever the `swap` method is called:

```rs
pub fn swap(&mut self, input_bucket: Bucket) -> Bucket {
  // --snip--
  Runtime::emit_event(SwapEvent {
      input: (input_bucket.resource_address(), input_bucket.amount()),
      output: (output_resource_address, output_amount),
  });
```

For these events to be emitted successfully, they all need to be declared in a
`#[events(...)]` attribute at the start of the blueprint:

```rs
#[blueprint]
#[events(InstantiationEvent, AddLiquidityEvent, RemoveLiquidityEvent, SwapEvent)]
mod radiswap {
```

As no part of a transaction will succeed if any of it fails, events will not be
emitted if the transaction does not complete successfully.

## The Radiswap Front End

The Radiswap front end is a single web page that allows anyone with a Radix
Wallet to interact with Radiswap component on ledger. Its HTML defines several
buttons and text inputs and runs the `client/main.js` script, where interactions
with the Radix network and wallet take place.

These types of front end interactions were previously described in more detail
in both the
[Run Your First Front End Dapp](https://docs.radixdlt.com/docs/learning-to-run-your-first-front-end-dapp)
and
[Run the Gumball Machine Front End dApp](https://docs.radixdlt.com/docs/learning-to-run-the-gumball-machine-front-end-dapp)
sections of the documentation. They are summarised again here.

In `client/main.js` we use the `radix-dapp-toolkit` to interact with the Radix
network.

```javascript
import {
  RadixDappToolkit,
  // --snip--
} from "@radixdlt/radix-dapp-toolkit";
```

A connection to the Radix Network and Wallet is established using the Radix dApp
Toolkit, and a
[Dapp Definition](https://docs.radixdlt.com/docs/en/dapp-definition-setup):

```javascript
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppDefinitionAddress,
  networkId: RadixNetwork.Stokenet,
  applicationName: "Radiswap",
  applicationVersion: "1.0.0",
});
```

With this and the Radiswap component address, the front end can then get
information about the components state via the gateway API, e.g.

```javascript
const componentDetails =
  await rdt.gatewayApi.state.getEntityDetailsVaultAggregated(componentAddress);
```

As well as connect to and request details from a Radix Wallet:

```javascript
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
```

With a connection to the wallet established, the dapp can then use the
transition manifests generation functions in the `client/manifests` directory to
interact with the Radiswap component. For example, to swap resources in the
pool:

```javascript
import {
  // --snip--
  getSwapManifest,
} from "./manifests";

// --snip--

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
```

This covers most of the types of front end functionality, but the commented code
is waiting to be explored, if you're looking for more detail.

## Using the Radiswap Scrypto Package in resim

In `resim` we can use our Radiswap package to see how the Radiswap component
behaves locally. The following steps will guide you through the process.

### Setup

1.  First Clone the repository if you have not done so, and then change
    directory to this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/20-radiswap/scrypto-package
    ```

2.  Then (optionally) reset the simulator and create a new account.

    ```
    resim reset

    resim new-account

    resim show <ACCOUNT_ADDRESS>
    ```

3.  Next export the Account component address. This allows the manifest files to
    used it, without having to modify them.

    ```sh
    export account=<ACCOUNT_ADDRESS>
    ```

4.  Publish the blueprint and export the New Package address:

    ```sh
    resim publish .
    ```

    ```sh
    export package=<PACKAGE_ADDRESS>
    ```

5.  Use the `create_resources.rtm` manifest to create two resources to use in
    the Radiswap component and a Radiswap Owner Badge:

    ```sh
    resim run manifests/create_resources.rtm
    ```

6.  Show the new resources in your account to identify them, then export their
    addresses:

    ```sh
    resim show $account
    ```

    ```sh
    export resource_a=<TOKEN_A_ADDRESS>
    export resource_b=<TOKEN_B_ADDRESS>
    export radiswap_badge=<RADISWAP_OWNER_BADGE_ADDRESS_INCLUDING_:#1#>
    ```

    _**Note:** The Radiswap Owner Badge address will be the same as the resource
    address with local ID (`:#1#`) appended to the end. This is the non fungible
    global ID. It specifies this token individual rather than any other token of
    the same type._

7.  Next instantiate the Radiswap component with the `instantiate_radiswap.rtm`
    manifest and export the component address:

    ```sh
    resim run manifests/instantiate_radiswap.rtm
    ```

    ```sh
    export component=<RADISWAP_COMPONENT_ADDRESS>
    ```

_**Note:** The Radiswap component address will be listed in the `New Entities:`
section of the output and starts with `component` not `pool`._

### Usage

Now that we have a Radiswap component we can interact with it. The easiest way
to do this is to use manifests in the `scrypto-package/manifests/` directory.
The first one we will use is `add_liquidity.rtm` to add resources to the pool
and receive some Pool Units. You may want to adjust the amounts in the manifest
before running it. Whether you do or not, run it with the following command:

```sh
resim run manifests/add_liquidity.rtm
```

After we've added resources to the pool, you can use the `swap.rtm` manifest to
swap between the two resources or the `remove_liquidity.rtm` manifest to convert
Pool Units for resources in the pool. Again, you may want to adjust the amounts
in the manifests.

## Using the Radiswap Front End on Stokenet

To see the Radiswap dApp in action we need to deploy the Radiswap package to
Stokenet and create a dapp definition for the front end client. Then we can run
the client and interact with the dApp.

### Prerequisites

These are needed for all dapps with front ends.

1. The Radix Wallet
   [more info here](https://docs.radixdlt.com/docs/radix-wallet-overview)
2. The Radix Wallet Connector extension. Download from the
   [chrome store](https://chromewebstore.google.com/detail/radix-wallet-connector/bfeplaecgkoeckiidkgkmlllfbaeplgm)
   or [download from github](https://github.com/radixdlt/connector-extension/)

3. The Radix Wallet needs a Stokenet Account with funds. If you don't already
   have one:

   1. If you haven't, open the Radix Wallet on your phone and run through first
      time set up.
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

We'll need to build the scrypto package, deploy it to Stokenet, and then
instantiate the Radiswap component.

##### Build the scrypto package:

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/20-radiswap/scrypto-package
    ```

2.  From inside the `scrypto-package` directory, build the code: `scrypto build`
3.  Two important files (`radiswap.rpd` and `radiswap.wasm`) will be generated
    in `scrypto-package/target/wasm32-unknown-unknown/release/`. You will need
    them for the next step.

##### Deploy the package to Stokenet:

1. Go to the
   [Stokenet Developer Console Website](https://stokenet-console.radixdlt.com/deploy-package)
2. Connect the Wallet via the Connect Button
3. Navigate to Deploy Package
4. Upload both `radiswap.rpd` and `radiswap.wasm`
5. In the "Owner role" and "Owner role updatable" dropdowns select "None", as we
   do not have any package owner related functionality.
6. Click on "Send to the Radix Wallet"
7. Go to your wallet where it should be asking you to approve the transaction
8. On the wallet "Slide to Sign" the deployment transaction. You may have to
   "Customize" which account pays the transaction fee if your account has no
   funds.
9. Once the transaction completes, the deployed _package address_ should then be
   displayed back in the Stokenet Console. Make a note of it for the next step.

##### Creating a Radiswap Component

To create a Radiswap component we need an owner badge and two resource
addresses. We can create new resources for this purpose, then instantiate the
Radiswap component once we have them with a second transaction.

###### Create Resources

1. Go to the
   [Stokenet Developer Console, Send a Raw Transaction page](https://stokenet-console.radixdlt.com/transaction-manifest).
2. Copy the contents of the `manifests/create_resources.rtm` file from the
   `scrypto-package` directory into the box, but delete the top `CALL_METHOD`
   section, containing the `"lock_fee"` instruction.
3. Connect the Wallet via the **Connect** button, copy your account address from
   the button and paste it into the final section of the manifest, replacing
   `${account}` but keeping the `"` around it.
4. Press **Send to the Radix Wallet**. Then approve the transaction in the Radix
   Wallet.
5. When the transaction is complete, a link to the transaction summary will show
   in the Dashboard. Click the link and the new resources will be displayed in
   the page where you can click on each and copy their addresses. These will be
   needed for the next step.

###### Instantiate Radiswap Component

1. Go to the
   [Stokenet Developer Console, Send a Raw Transaction page](https://stokenet-console.radixdlt.com/transaction-manifest).
2. Copy the contents of the `manifests/instantiate_radiswap.rtm` file from the
   `scrypto-package` directory into the text box, but delete the top
   `CALL_METHOD` section, containing the `"lock_fee"` instruction.
3. Replace `${package}`, `${resource_a}`, `${resource_b}`, `${radiswap_badge}`
   and `${account}` in the manifest with the package address, the two resource
   addresses, Radiswap Owner Badge global address (including the `:#1#` on the
   end) and your account address. _**Note:** Make sure to keep the `"` around
   the addresses._
4. Press **Send to the Radix Wallet**. Then approve the transaction in the
   Wallet.
5. When the transaction is complete, the Developer Console will display a link
   to the transaction summary page. Click on it and then "Details" to see the
   transactions "Created Entities". The entity address that starts with
   `component_` is the Radiswap component address. Make a note of it for the
   first [Front End Client](#front-end-client) step.

#### Creating a dApp Definition

1. Create a new account in the Radix Wallet. This is the account which we will
   convert to a dapp Definition account.
2. Head to the
   [Developer Console’s Configure Metadata page](https://stokenet-console.radixdlt.com/configure-metadata).
   This page provides a simple interface to update entity metadata. In our case
   that will be the metadata on an account to make it a dapp definition.
3. Connect your Radix Wallet to the Dashboard and select the account you just
   created to be a dapp definition. If you're already connected, you can click
   the **Connect** button in the top right corner of the page again and **Update
   Data Sharing** to select the new account.
4. Click on the **Connect** button again and copy your account address from the
   connect button to the search bar in the page, then click **Search**.
5. In the **account_type** dropdown select "dapp definition".
6. Fill in the name and description. - _**icon_url** and **claimed_websites**
   would be essential for any production app, but we're keeping this example as
   simple as we can._
7. Click "Send to the Radix Wallet"
8. An approve transaction should appear in your Radix Wallet to confirm. You may
   have to "Customize" which account pays the transaction fee if your dapp
   definition account has no funds. Confirm the transaction and keep the account
   address for the next step.

#### Front End Client

1. To run the client, we first need to add our
   [dapp definition](#creating-a-dapp-definition) and
   [component address](#instantiate-radiswap-component) from the previous steps
   to the start of `client/main.js`, e.g.

   ```javascript
   const dAppDefinitionAddress =
     "account_tdx_2_129js3exttlk8fauagqlh8v7m4880rkp9dmjmt5z5swemeu8sqwrryz";
   const componentAddress =
     "component_tdx_2_1cqmul9y5as3766nxuwwg2m6wgtkl43yj69c6axsvp5xaf9vla8zja7";
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

In your browser you should have the Radiswap dApp up and running.

1. Before anything else you will need to connect your Radix Wallet to the dApp.
   You can do this by clicking the **Connect Wallet** button in the top right
   corner of the page, then approving the connection in your Radix Wallet.
2. Once connected you can interact with the Radiswap component by first adding
   liquidity. Enter the amount of each resource you want to add to the pool and
   click the **Add Liquidity** button. This will send a transaction manifest to
   your connected wallet which you can review and sign. You will then receive
   Pool Units in return.
3. After that you are free, to swap resources, remove liquidity or add more. The
   dApp will guide you through the process with the buttons and input fields on
   the page. Each action will require a transaction manifest to be signed in the
   Radix Wallet. You will notice the swap rate changes as you add and remove
   liquidity, as the pool balances change.
