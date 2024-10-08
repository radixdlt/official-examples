# 9. Hello Token Front End dApp

This example is a very simple dapp with a front end. In the last example we
deployed a package to the network and started interacting with it on ledger.
Before we turn that Gumball Machine into a fully fledged dapp, we need to learn
how to connect a front end to the Radix network and wallet. This example
demonstrates how, using the Hello package from the first example, adding a front
end that sends a connected user a free Hello Token.

> **If you aren't planning on using a front end, you can skip this and the next
> example and move on to the one after that.**

We assume you have some familiarity with javascript and front end web
development for this example, but it's kept as simple as possible.

- [Running the Example](#running-the-example)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
    - [Creating a Radix Wallet Stokenet Account](#creating-a-radix-wallet-stokenet-account)
    - [Scrypto](#scrypto)
      - [Build the scrypto package:](#build-the-scrypto-package)
      - [Deploy the package to Stokenet:](#deploy-the-package-to-stokenet)
      - [Instantiate a component from the package:](#instantiate-a-component-from-the-package)
    - [Client](#client)
      - [Creating a dApp Definition](#creating-a-dapp-definition)
      - [Running the Client](#running-the-client)
  - [Using the dApp](#using-the-dapp)

## Running the Example

To see the dapp in action we'll run the front end locally, but We'll still need
to deploy the package to the network and instantiate it.

### Prerequisites

These are the same as in the last example.

1. The Radix Wallet
   [more info here](https://docs.radixdlt.com/docs/radix-wallet-overview)
2. The Radix Wallet Connector extension. Download from the
   [chrome store](https://chromewebstore.google.com/detail/radix-wallet-connector/bfeplaecgkoeckiidkgkmlllfbaeplgm)
   or [download from github](https://github.com/radixdlt/connector-extension/)

### Setup

Now that we have a front end, we need to setup the scrypto package and the
client. We'll start with the scrypto package.

#### Creating a Radix Wallet Stokenet Account

If you already have a Stokenet account with funds you can skip this step.

1. If you haven't already, open the Radix Wallet and on your phone and run
   through first time set up.
2. You will need to connect to the test network in Settings > App Settings >
   Gateways > Stokenet (testnet) Gateway.
3. Create a new account.
4. Get some test token for transaction fees by clicking on;
   - the account name
   - the three dots "...",
   - "Dev Preferences",
   - the "Get XRD Text Tokens" button.

#### Scrypto

The scrypto setup steps are almost the same as in the last example.

##### Build the scrypto package:

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/09-hello-token-front-end
    ```

2.  From inside the `scrypto` directory, build the code: `scrypto build`
3.  Two important files (`hello.rpd` and `hello.wasm`) will be generated in
    `scrypto/target/wasm32-unknown-unknown/release/`. You will need them for the
    next step.

##### Deploy the package to Stokenet:

1. Go to the
   [Stokenet Developer Console Website](https://stokenet-console.radixdlt.com/deploy-package)
2. Connect the Wallet via the Connect Button
3. Navigate to Deploy Package
4. Upload both `hello.rpd` and `hello.wasm`
5. In the "Owner role" and "Owner role updatable" dropdowns select "None", as we
   do not have any package owner related functionality yet.
6. Click on "Send to the Radix Wallet"
7. Go to your wallet where it should be asking you to approve the transaction
8. On the wallet "Slide to Sign" the deployment transaction. You may have to
   "Customize" which account pays the transaction fee if your account has no
   funds.
9. Once the transaction completes, the deployed _package address_ should then be
   displayed back in the Stokenet Console. Make a note of it for the next step.

##### Instantiate a component from the package:

1. Go to the
   [Send Raw Transaction section of the Stokenet Developer Console](https://stokenet-console.radixdlt.com/transaction-manifest)
2. Connect the Wallet via the Connect Button if you haven't already
3. Copy the `instantiate_hello manifest` from `scrypto/instantiate_hello.rtm`
   into the text box on the console.
4. Replace the `_PACKAGE_ADDRESS_` with the address of the deployed package,
   leaving the outside quote marks in place.
5. Replace the `_ACCOUNT_ADDRESS_` with the address of the account you want to
   instantiate the component from, leaving the outside quote marks in place.
6. Click on "Send to the Radix Wallet"
7. Go to your wallet where it should be asking you to approve the transaction
   and "Slide to Sign" the transaction.
8. Once submitted, back in the console a tx ID is displayed. Click on this to
   see the transaction summary. The component address will be displayed in the
   transaction summary. Make a note of it for later use.

#### Client

The first thing the client needs is the address of the deployed component and a
dapp definition address. They will both be added to the `client/main.js` file

```javascript
const dAppDefinitionAddress = "";
const componentAddress = "";
```

We have the component address from the last step, but we still need a dapp
definition address.

##### Creating a dApp Definition

1. Create a new account in the Radix Wallet. This is the account which we will
   convert to a dapp Definition account.

2. Head to the
   [Developer Console’s Configure Metadata page](https://stokenet-console.radixdlt.com/configure-metadata).
   This page provides a simple interface to update entity metadata. In our case
   that will be the metadata on an account to make it a dapp definition.

3. Connect your Radix Wallet to the Dashboard and select the account you just
   created to be a dapp definition.

4. Click on the **Connect** button again and copy your account address from the
   connect button to the search bar in the page, then click **Search**.

5. In the **account_type** dropdown select "dapp definition".

6. Fill in the name and description. - _**icon_url** and **claimed_websites**
   would be essential for any production app, but we're keeping this example as
   simple as we can._

   > **[Metadata for Verification ](https://docs.radixdlt.com/docs/metadata-for-verification)**  
   > dApp definitions claim ownership of dApps websites for authenticity. This
   > is confirmed by looking up an expected `.well-known/radix.json` file at the
   > claimed website origin. This would be required for a dapp to successfully
   > send requests to the Radix Wallet on mainnet. They also have two way links
   > to other dapp definitions and ledger entities to similarly prove
   > association.

7. Click "Send to the Radix Wallet"

8. An approve transaction should appear in your Radix Wallet to confirm. You may
   have to "Customize" which account pays the transaction fee if your dapp
   definition account has no funds. Confirm the transaction.

##### Running the Client

1. To run the client, we first need to add our dapp definition and component
   addresses to the `client/main.js`.

2. Next we install the dependencies:

   ```sh
   cd client
   npm install
   ```

3. Then we start the client:

   ```sh
   npm run dev
   ```

4. In the console vite will tell you where the client is running. It should be
   `http://localhost:5173/`. Open that in your browser.

### Using the dApp

Now the client is up and running we can use the dapp.

1.  First connect your wallet with the Connect Button. It probably wont connect
    as we haven't set your wallet to developer mode. Developer mode stops the
    authentication check that looks for the dapp definition address in
    `.well-known/radix.json`. To turn on developer mode:

    1. Open the Radix Wallet
    2. Click on; the settings cog in the top right > App Settings > the
       Developer Mode toggle

    Then try to connect again.

    > **Note:** Developer mode is always needed for local development. For a
    > production ready dapp
    > [two way linking](https://docs.radixdlt.com/docs/metadata-for-verification)
    > between the dapp definition and the website is required.

2.  Then we can get our free token by clicking that button and signing the
    manifest in our wallet. And that's it!

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
