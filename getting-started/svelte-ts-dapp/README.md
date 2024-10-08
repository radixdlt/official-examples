# Getting Started

This example is the template for a simple decentralized application (dApp) using
Svelte TypeScript with SvelteKit. It utilizes the Radix dApp Toolkit to interact
with the Radix Ledger via the Gateway API and the Radix Wallet.

In the `svelte-ts-dapp` directory: run `npm install` to install the dependencies
and then `npm run dev` to start the development server.

## What is Included

- `static/` - Contains global styles and favicon.
- `src/` - Contains the main source code for the dapp.
  - `routes/` - Contains the page, layouts and subcomponents.
  - `lib/` - The app internal library.
    - `components/` - Components usable across the dapp.
    - `assets/` - Assets for the dapp.
    - `stores.ts` - The dapp shared state including connection to Radix network
      and wallet.

The project is bootstrapped using `npm create svelte` to make a SvelteKit with
Vite project. This gives you a hot reload development server out of the box.
We've added the preconfigured Radix dApp toolkit, a walk through demonstrating
how to set the Radix Wallet for Dev mode, and a pre-deployed scrypto component
to interact with on stokenet (the Radix Public Test Network).

The `src/routes/+page.svelte` file contains the main page of the dApp. The nav
bar (`src/routes/Nav`) is where we find the `radix-connect-button` web
component:

```svelte
  <div class="connect-btn">
    <radix-connect-button />
  </div>
```

This component is a part of the Radix dApp Toolkit and is used to connect the
Radix Wallet to the dApp.

The logic for the dApp is spread across the various `.svelte` files, but
connections to the Radix Wallet and Network are handled in `+layout.svelte` and
`HelloToken.svelte`. They use the Gateway API to interact with the Radix Ledger
and the Radix dApp Toolkit to interact with the Radix Wallet. You can find
examples of how to use each to get user information, connect to the Radix
Ledger, and send tokens. These examples provide core building blocks for
creating a dApp on the Radix Ledger. Key Features of the Radix dApp Toolkit
include:

- User persona and account information
- Constructing and sending transactions
- Listening for transaction status updates & retrieving committed transaction
  details.

The `src/routes/+layout.svelte` file contains the connection initialisation to
the Radix Wallet and test network:

```typescript
// Instantiate Radix Dapp Toolkit for connect button and wallet usage.
$rdt = RadixDappToolkit({
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Hello Token dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
});

// Instantiate Gateway API for network queries
$gatewayApi = GatewayApiClient.initialize(rdt.gatewayApi.clientConfig);
```

Which sets the value of the static `$rdt` store in the `stores.ts` file and
allows for the initialisation of the updating `$walletData` store:

```typescript
// Subscribe to updates to the user's shared wallet data and store it in the walletData store
$rdt?.walletApi.walletData$.subscribe((data) => {
  $walletData = data;
});
```

From here on they can be used by importing from the `stores.ts`:

```typescript
import { rdt, walletData } from "$lib/stores";
```

In `HelloToken.svelte` we can see how it's used to construct and send a
transaction to the Radix wallet. Then fetch the results committed to the ledger
from the gateway API:

```typescript
// Send a transaction to the wallet when user clicks on the claim token button
const handelClick = async () => {
  // Check if the wallet is connected and an account is selected. If not, do nothing
  if (!$rdt || !accountAddress) return;
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
  const result = await $rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("free token result:", result.value);

  let getCommitReceipt = await $rdt?.gatewayApi.transaction.getCommittedDetails(
    result.value.transactionIntentHash,
  );
  console.log("trasaction receipt:", getCommitReceipt);
};
```

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

More information on Svelte can be found in the
[Svelte documentation](https://svelte.dev/docs).

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
