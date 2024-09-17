# 8. A Ledger Ready Gumball Machine

In the previous examples we allowed our gumball machine to mint its own
gumballs. The blueprint still isn't quite ready for us to publish on the ledger
though. Up until now anyone could mint gumballs, here we look at restricting
minting to the component it's methods. We also add an icon for the gumball
token, so it's easily identifiable in wallets and explorers.

- [Publishing the Gumball Machine](#publishing-the-gumball-machine)
  - [Prerequisites](#prerequisites)
  - [Creating a Radix Wallet Stokenet Account](#creating-a-radix-wallet-stokenet-account)
  - [Building the Package](#building-the-package)
  - [Deploy the package to Stokenet](#deploy-the-package-to-stokenet)
- [Using the Gumball Machine on Stokenet](#using-the-gumball-machine-on-stokenet)
  - [Instantiate the Gumball Machine](#instantiate-the-gumball-machine)
  - [Using the Gumball Machine methods](#using-the-gumball-machine-methods)
- [License](#license)

## Publishing the Gumball Machine

We will deploy the gumball machine to the Stokenet testnet.

### Prerequisites

1. The Radix Wallet
   [more info here](https://docs.radixdlt.com/docs/radix-wallet-overview)
2. The Radix Wallet Connector extension. Download from the
   [chrome store](https://chromewebstore.google.com/detail/radix-wallet-connector/bfeplaecgkoeckiidkgkmlllfbaeplgm)
   or [download from github](https://github.com/radixdlt/connector-extension/)

### Creating a Radix Wallet Stokenet Account

1. If you haven't already, open the Radix Wallet on your phone and run through
   first time set up.
2. You will need to connect to the test network in Settings > App Settings >
   Gateways > Stokenet (testnet) Gateway.
3. Create a new account.
4. Get some test token for transaction fees by clicking on;
   - the account name
   - the three dots "...",
   - "Dev Preferences",
   - the "Get XRD Text Tokens" button.

### Building the Package

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/08-ledger-ready-gumball-machine
    ```

2.  From the same directory as the `Cargo.toml` file, build the code:
    `scrypto build`
3.  Two important files (`refillable_gumball_machine.rpd` and
    `refillable_gumball_machine.wasm`) will be generated in
    `/target/wasm32-unknown-unknown/release/`. You will need them for the next
    step.

### Deploy the package to Stokenet

1. Go to the
   [Stokenet Developer Console Website](https://stokenet-console.radixdlt.com/deploy-package)
2. Connect the Wallet via the Connect Button
3. Navigate to Deploy Package
4. Upload both `refillable_gumball_machine.rpd` and
   `refillable_gumball_machine.wasm`
5. In the "Owner role" and "Owner role updatable" dropdowns select "None", as we
   do not have any package owner related functionality yet.  
   _This is the owner of the package, not the `GumballMachine` components that
   will be instantiated from it. The owner badge we mint as a part of component
   instantiation is for the component._
6. Click on "Send to the Radix Wallet"
7. Go to your wallet where it should be asking you to approve the transaction
8. On the wallet "Slide to Sign" the deployment transaction.
9. Once the transaction completes, the deployed _package address_ should then be
   displayed back in the Stokenet Console. Make a note of it for the next step.

## Using the Gumball Machine on Stokenet

Once the package is deployed to the network we interact with it and it's
components using transaction manifests. The first of these manifests will
instantiate a gumball machine component.

### Instantiate the Gumball Machine

1. Go to the
   [Send Raw Transaction section of the Stokenet Developer Console](https://stokenet-console.radixdlt.com/transaction-manifest)
2. Connect the Wallet via the Connect Button if you haven't already
3. Copy the `instantiate_gumball_machine manifest` from
   `./manifests/instantiate_gumball_machine.rtm` into the text box on the
   console.
4. Replace the `_PACKAGE_ADDRESS_` with the address of the deployed package,
   leaving the outside quote marks in place.
5. Replace the `_GUMBALL_PRICE_` with your desired decimal value, leaving the
   quotes.
6. Replace the `_ACCOUNT_ADDRESS_` with the address of your wallet account,
   leaving the quotes. The address can be copied from the connect button - Click
   the button to open a dropdown, then click the copy button next to the
   address.
7. Click on "Send to the Radix Wallet"
8. Go to your wallet where it should be asking you to approve the transaction
   and "Slide to Sign" the transaction.
9. Once submitted, back in the console a tx ID displayed. Click on this to see
   the transaction summary. The component address, GUM token and Gumball Machine
   Owner Badge will be displayed in the transaction summary. Make a note of the
   component address for later use. Click on the token and badge and make a note
   of their addresses too.

### Using the Gumball Machine methods

Now that the gumball machine is instantiated we can use it's methods. There are
manifests for each of the methods in the `./manifests` directory. To try them
out use them in the the
[Send Raw Transaction section of the Stokenet Developer Console](https://stokenet-console.radixdlt.com/transaction-manifest)
as we have for the instantiation. You will need to add the appropriate addresses
and input arguments for each manifest.

_Note: `get_status.rtm` will work, but you will not be able to see the output as
you could in `resim`._

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
