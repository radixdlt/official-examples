# 9 Hello Token Front End dApp

This example shows you how to make a very simple dapp with a front end. In the
last example we deployed a package to the network and started interacting with
it on ledger. Before we turn that Gumball Machine into a fully fledged dapp, we
need to learn how to connect a front end to the Radix network and wallet. This
example will show you how to do that.

> **If you aren't planning on using a front end, you can skip this and the next
> example and move on to the one after that.**

We assume you have some familiarity with javascript and front end web
development for this example, but it's kept as simple as possible.

- [File Structure](#file-structure)
- [Dapp Definitions](#dapp-definitions)
- [The Radix Dapp Toolkit](#the-radix-dapp-toolkit)
- [Running the Example](#running-the-example)
  - [Setup](#setup)
    - [Scrypto](#scrypto)
      - [Build the scrypto package:](#build-the-scrypto-package)
      - [Deploy the package to Stokenet:](#deploy-the-package-to-stokenet)
      - [Instantiate a component from the package:](#instantiate-a-component-from-the-package)
    - [Client](#client)
      - [Creating a dApp Definition](#creating-a-dapp-definition)
      - [Running the Client](#running-the-client)
  - [Using the dApp](#using-the-dapp)

## File Structure

Now that we have more than just the scrypto package, we need to reorganize our
project a little. We'll put the scrypto package in a `scrypto` directory and add
a front end `client` directory. In the `client` directory we have an
`index.html` file, a `main.js` file and a `package.json` file. The `index.html`
file is the main page of our dapp. The `main.js` file is the javascript that
runs on the page. The `package.json` file is be used to install the Radix Dapp
Toolkit and has scripts to start and build the front end. There's also a small
amount of styling added with the `style.css` file.

```
/
├── client/
│  ├── index.html
│  ├── main.js
│  ├── package.json
│  ├── style.css
│  └── ...
└── scrypto/
   └── ...
```

## Dapp Definitions

Every dapp needs a dapp definition; an account with metadata that identifies the
dapp on the network. It creates a way for the Radix Wallet (and other clients)
to know and verify what dapp it's interacting with as well as what components
and resources that dapp is associated with.

_We are only going to connect this dapp to the Stokenet test network, but for
Mainnet you will need to
[provide the dapp definition address in the client](https://docs.radixdlt.com/docs/dapp-definition-setup)
as well. Without this, verification will not work and the Radix Wallet will not
be able to connect._

## The Radix Dapp Toolkit

The are a collection of utilities that are needed to build a dapp on Radix. They
include things like ways to query the state of the network, the wallet connect
button, ways to send transactions, etc. We've collected them into a single npm
package called the
[Radix dApp Toolkit](https://github.com/radixdlt/radix-dapp-toolkit). You can
see some of it's essential uses in two places in this example:

First it's used in the `client/index.html` file to connect the wallet:

```html
<radix-connect-button />
```

Second it's used in `client/main.js` to interact with the network and wallet. To
do this we first need to import the toolkit:

```javascript
import {
  DataRequestBuilder,
  RadixDappToolkit,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
```

Then we generate an instance of the toolkit so we can use it's various methods:

```javascript
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppDefinitionAddress,
  networkId: RadixNetwork.Stokenet,
  applicationName: "Hello",
  applicationVersion: "1.0.0",
});
```

We then use the toolkit's wallet API to do a few different things. First we
decide what data we want to request from connected wallets:

```javascript
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
```

Next, to send a transaction we first need to get the user's account address:

```javascript
const accountAddress = rdt.walletApi.getWalletData().accounts[0].address;
```

Which we use in a transaction manifest that we send back to the wallet:

```javascript
const result = await rdt.walletApi.sendTransaction({
  transactionManifest: manifest,
  version: 1,
});
```

The wallet then calculates fees, prompts the user to sign the transaction and
sends it to the network.

## Running the Example

To see the dapp in action we'll run the front end locally, but We'll still need
to deploy the package to the network and instantiate it.

### Setup

Now that we have a front end, we need to setup the scrypto package and the
client. We'll start with the scrypto package.

#### Scrypto

The scrypto setup steps are almost the same as in the last example.

##### Build the scrypto package:

1. From inside the `scrypto` directory, build the code: `scrypto build`
2. Two important files (`hello.rpd` and `hello.wasm`) will be generated in
   `scrypto/target/wasm32-unknown-unknown/release/`. You will need them for the
   next step.

##### Deploy the package to Stokenet:

1. Go to the
   [Stokenet Developer Console Website](https://stokenet-console.radixdlt.com/deploy-package)
2. Connect the Wallet Via the Connect Button
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
2. Connect the Wallet Via the Connect Button if you haven't already
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

   > Linked websites - dApp definitions claim ownership of dApps websites for
   > authenticity. This is confirmed by looking up an expected
   > .well-known/radix.json file at the claimed website origin. This would be
   > required for a dapp to successfully send requests to the Radix Wallet in
   > mainnet.

7. Click "Send Update Transaction to the Radix Wallet"

8. An approve transaction should appear in your Radix Wallet to confirm. You may
   have to "Customize" which account pays the transaction fee if your dapp
   definition account has no funds. Confirm the transaction.

##### Running the Client

1. To run the client, we first need to add our dapp definition and component
   addresses to the `client/main.js`.

2. Next we install the dependencies:

   ```bash
   cd client
   npm install
   ```

3. Then we start the client:

   ```bash
   npm run dev
   ```

4. In the console vite will tell you where the client is running. It should be
   `http://localhost:5173/`. Open that in your browser.

### Using the dApp

Now the client is up and running we can use the dapp.

First connect you wallet with the Connect Button. If this doesn't work it will
be because you haven't set your wallet to developer mode. This stops the
authentication check that looks for the dapp definition address in
`.well-known/radix.json`. To turn on developer mode:

1. Open the Radix Wallet
2. Click on the settings cog in the top right
3. Click App Settings
4. Click the Developer Mode toggle and try to connect again.

Then we can get our free token by clicking that button and signing the manifest
in our wallet. And that's it!
