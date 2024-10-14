# Getting Started

This example is the template for a simple decentralized application (dApp) using
vanilla JavaScript. It utilizes the Radix dApp Toolkit to interact with the
Radix Ledger via the Gateway API and the Radix Wallet.

In the `vanilla-js-dapp` directory: run `npm install` to install the
dependencies and then `npm run dev` to start the development server.

## What is Included

- `index.html` - The main HTML file for the dApp.
- `main.js` - The main JavaScript file for the dApp.
- `style.css` - The main CSS file for the dApp.

The project is bootstrapped with a vanilla JS Vite project. This gives you a hot
reload development server out of the box and we add the preconfigured Radix dApp
toolkit, a walk through demonstrating how to set the Radix Wallet for Dev mode,
and a pre-deployed scrypto component to interact with on stokenet (the Radix
Public Test Network).

The `index.html` file contains the structure of the dApp. There is an example
nav bar where we inject the `radix-connect-button` web component. This can be
found in main.js and looks like this:

```javascript
// Inject the navbar into the DOM
document.querySelector("#navbar-container").innerHTML = `
    <div id="navbar">
      <img src="${radixLogo}" alt="scrypto logo" id="scrypto-logo" />
      <img src="${developerImg}" alt="radix logo" id="radix-logo" />
    </div>
    <div id="connect-btn">
      <radix-connect-button />
    </div>
`;
```

This is where we inject the `radix-connect-button` web component into the DOM.
This component is a part of the Radix dApp Toolkit and is used to connect the
Radix Wallet to the dApp.

The `main.js` file contains the logic for the dApp. It uses the Radix dApp
Toolkit to interact with the Radix Ledger via the Gateway API and the Radix
Wallet. You can find examples of how to use the Radix dApp Toolkit to get user
information, connect to the Radix Ledger, and send tokens. These examples
provide core building blocks for creating a dApp on the Radix Ledger. Key
Features of the Radix dApp Toolkit include:

- User persona and account information
- Constructing and sending transactions
- Listening for transaction status updates & retrieving comitted transaction
  details.

The next section of `main.js` is where we instantiate the Radix dApp Toolkit
which looks like this:

```javascript
// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/dapp-metadata
// then use that account for your dAppDefinitionAddress
const dAppDefinitionAddress =
  "account_tdx_2_128jm6lz94jf9tnec8d0uqp23xfyu7yc2cyrnquda4k0nnm8gghqece";

// Instantiate Radix Dapp Toolkit for connect button and wallet usage.
const rdt = RadixDappToolkit({
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Hello Token dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
  // This field will be updated and removed soon
  dAppDefinitionAddress,
});
// Instantiate Gateway API for network queries
const gatewayApi = GatewayApiClient.initialize(rdt.gatewayApi.clientConfig);
```

Following the instantiation of the Radix dApp Toolkit, we have an example of how
to get user information:

```javascript
// ************ Fetch the user's account address ************
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1))
// Subscribe to updates to the user's shared wallet data
rdt.walletApi.walletData$.subscribe((walletData) => {
  console.log("subscription wallet data: ", walletData)
  // set the account address to the first account in the wallet
  accountAddress = walletData.accounts[0].address
  // add all shared accounts to the account select dropdown
  accounts = walletData.accounts
  let accountSelect = document.getElementById('select-dropdown')
  accounts.map((account) => {
    console.log("account: ", account)
    let shortAddress = account.address.slice(0, 4) + "..." + account.address.slice(account.address.length - 6, account.address.length)
    let li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.innerHTML = `
      <input type="radio" name="account" id="" value="${account.address}">
      <label for="${account.label}">
        ${account.label} ${shortAddress}
      </label>
    `;
    accountSelect.appendChild(li);
  })
```

Next we have an example that shows how to construct and send a transaction to
the Radix wallet, and then fetch the results committed to the ledger from the
gateway API:

```javascript
// Send a transaction to the wallet when user clicks on the claim token button Id=get-hello-token
document.getElementById("get-hello-token").onclick = async function () {
  let manifest = `
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
  console.log("manifest: ", manifest);
  // Send manifest to extension for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("free token result:", result.value);
  let getCommitReceipt = await gatewayApi.transaction.getCommittedDetails(
    result.value.transactionIntentHash,
  );
  console.log("getCommittedDetails:", getCommitReceipt);
};
```

The `style.css` file contains the styling for the dApp.

For more information about the hello-token you can find the scrypto project in
the Radix Official-Examples repository
[here](https://github.com/radixdlt/official-examples/tree/main/getting-started/hello-token)
This project is a simple example of a Radix component that can be used to
interact with the Radix Ledger. It is pre-deployed on the stokenet network and
can be interacted with using the Radix dApp Toolkit. It contains a simple
blueprint that allows users to claim a token and deposit it into their wallet.
The other point of interest is the example of how to set up the
`dapp_definition` metadata for 2 way verification in the Radix Wallet. This is a
key feature of the Radix Wallet that allows users to verify the dApp they are
interacting with is the correct one.

## License

The Radix Official Examples code is released under Radix Modified MIT License.

    Copyright 2023 Radix Publishing Ltd

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
