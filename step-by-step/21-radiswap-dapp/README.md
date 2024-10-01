# 21. Radiswap

The Radiswap dApp is the last example in the step-by-step learning journey. It
takes the concepts learned in the previous sections and combines them with some
new additions to make a single, more complex demonstration. The Radiswap dApp is
a decentralized exchange (DEX) that allows users to deposit and swap between two
tokens.

- [Using the Radiswap Scrypto Package in `resim`](#using-the-radiswap-scrypto-package-in-resim)
  - [Setup](#setup)
  - [Usage](#usage)
- [Using the Radiswap Front End on Stokenet](#using-the-radiswap-front-end-on-stokenet)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup-1)
    - [Scrypto](#scrypto)
      - [Build the scrypto package:](#build-the-scrypto-package)
      - [Deploy the package to Stokenet:](#deploy-the-package-to-stokenet)
      - [Creating a Radiswap Component](#creating-a-radiswap-component)
        - [Creating a dApp Definition](#creating-a-dapp-definition)
        - [Create Resources](#create-resources)
        - [Instantiate Radiswap Component](#instantiate-radiswap-component)
    - [Dapp Definition Two Way Linking](#dapp-definition-two-way-linking)
    - [Front End Client](#front-end-client)
  - [Using the dApp](#using-the-dapp)
- [License](#license)

## Using the Radiswap Scrypto Package in `resim`

In `resim` we can use our Radiswap package to see how the Radiswap component
behaves locally. The following steps will guide you through the process.

Skip to the
[Using the Radiswap Front End on Stokenet](#using-the-radiswap-front-end-on-stokenet)
section if you want to deploy the Radiswap package to Stokenet and interact with
the Radiswap dApp.

### Setup

1.  First Clone the repository if you have not done so, and then change
    directory to this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/21-radiswap-dapp/scrypto-package
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
to do this is to use manifests in the `scrypto-package/manifests/resim/`
directory. The first one we will use is `add_liquidity.rtm` to add resources to
the pool and receive some Pool Units. You may want to adjust the amounts in the
manifest before running it. Whether you do or not, run it with the following
command:

```sh
resim run manifests/resim/add_liquidity.rtm
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

There are separate setup steps for the **scrypto package**, **dapp-definition**
and the **front end client**.

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
   > Package roles are used for
   > [royalty payments](https://docs.radixdlt.com/docs/using-royalties) and
   > package metadata updates. We strongly recommended having an owner role for
   > production packages.
6. Click on "Send to the Radix Wallet"
7. Go to your wallet where it should be asking you to approve the transaction
8. On the wallet "Slide to Sign" the deployment transaction. You may have to
   "Customize" which account pays the transaction fee if your account has no
   funds.
9. Once the transaction completes, the deployed **package address** should then
   be displayed back in the Stokenet Console. Make a note of it for later.

##### Creating a Radiswap Component

To create a Radiswap component we need an owner badge, two resource addresses
and an address of a dapp definition. We can create new dapp definition and
resources for this purpose, then instantiate the Radiswap component once we have
them.

###### Creating a dApp Definition

1. Create a new account in the Radix Wallet. This is the account which we will
   convert to a dapp definition account.
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
   would be essential for any production app and could be added later._
7. Click "Send to the Radix Wallet"
8. An approve transaction should appear in your Radix Wallet to confirm. You may
   have to "Customize" which account pays the transaction fee if your dapp
   definition account has no funds. Confirm the transaction and keep the account
   address for the
   [Instantiate Radiswap Component](#instantiate-radiswap-component) and
   [Front End Client](#front-end-client) steps.

###### Create Resources

1. Go to the
   [Stokenet Developer Console, Send a Raw Transaction page](https://stokenet-console.radixdlt.com/transaction-manifest).
2. Copy the contents of the `manifests/stokenet/create_resources.rtm` file from
   the `scrypto-package` directory into the box.
3. Connect the Wallet via the **Connect** button, copy your account address from
   the button and paste it into the final section of the manifest, replacing
   `_ACCOUNT_` but keeping the `"` around it.
4. Press **Send to the Radix Wallet**. Then approve the transaction in the Radix
   Wallet.
5. When the transaction is complete, a link to the transaction summary will show
   in the Dashboard. Click the link and the new resources will be displayed in
   the page where you can click on each and copy their addresses. These will be
   needed for the next step.

###### Instantiate Radiswap Component

1. Go to the
   [Stokenet Developer Console, Send a Raw Transaction page](https://stokenet-console.radixdlt.com/transaction-manifest).
2. Copy the contents of the `manifests/stokenet/instantiate_radiswap.rtm` file
   from the `scrypto-package` directory into the text box.
3. Replace `_PACKAGE_`, `_RADISWAP_BADGE_`, `_RESOURCE_A_`, `_RESOURCE_B_`,
   `_DAPP_DEFINITION_` and `_ACCOUNT_` in the manifest with the package address,
   Radiswap Owner Badge **global address** (including the `:#1#` on the end),
   the two resource addresses, your dapp definition's account address and your
   account address. _**Note:** Make sure to keep the `"` around the addresses._
4. Press **Send to the Radix Wallet**. Then approve the transaction in the
   Wallet.
5. When the transaction is complete, the Developer Console will display a link
   to the transaction summary page. Click on it and then "Details" to see the
   transactions "Created Entities". The entity address that starts with
   `component_` is the Radiswap component address. Make a note of it for the
   next step.

#### Dapp Definition Two Way Linking

When we instantiate the Radiswap component we gave it a dapp definition address,
but we also need to link the dapp definition to the component by giving it the
component address as described in the
[Metadata for Verification](https://docs.radixdlt.com/docs/metadata-for-verification)
docs section. This is done by:

1. Going to the
   [Developer Console’s Configure Metadata page](https://stokenet-console.radixdlt.com/configure-metadata).
2. Connect your Radix Wallet to the Dashboard and select the dapp definition
   account.
3. Click on the **Connect** button again and copy the dapp definition account
   address from the connect button to the search bar in the page, then click
   **Search**.
4. In the **Metadata for Verification** section, go to **claimed_entities** and
   click the **+ Add Claimed Entity** button.
5. In the **Enter entity address** box that appears, paste your Radiswap
   component address.
6. Click **Send to the Radix Wallet** and approve the transaction in the Wallet.

Now, when transactions are made with the Radiswap component, the are verifiably
linked to the dapp definition. This means, for example, that the Radix Wallet
will show the dapp definition's name, icon and description when the user is
interacting with your Radiswap component.

#### Front End Client

1. To run the client, we first need to add our
   [dapp definition](#creating-a-dapp-definition) and
   [component address](#instantiate-radiswap-component) from the previous steps
   to the start of `client/main.js`, e.g.

   ```javascript
   const dAppDefinitionAddress =
     "account_tdx_2_129js3exttlk8fauagqlh8v7m4880rkp9dmjmt5z5swemeu8sqwrryz";
   const componentAddress =
     "component_tdx_2_1cps9lr2zg0czpddznhhs2zfn0g6u67v6642z3cqh89h47n6vld9dm6";
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

## License

The Radix Official Examples code is released under Radix Modified MIT License.

    Copyright 2024 Radix Publishing Ltd

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software for non-production informational and educational purposes without
    restriction, including without limitation the rights to use, copy, modify,
    merge, publish, distribute, sublicense, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    This notice shall be included in all copies or substantial portions of the
    Software.

    THE SOFTWARE HAS BEEN CREATED AND IS PROVIDED FOR NON-PRODUCTION, INFORMATIONAL
    AND EDUCATIONAL PURPOSES ONLY.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE, ERROR-FREE PERFORMANCE AND NONINFRINGEMENT. IN NO
    EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES,
    COSTS OR OTHER LIABILITY OF ANY NATURE WHATSOEVER, WHETHER IN AN ACTION OF
    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE, MISUSE OR OTHER DEALINGS IN THE SOFTWARE. THE AUTHORS SHALL
    OWE NO DUTY OF CARE OR FIDUCIARY DUTIES TO USERS OF THE SOFTWARE.
