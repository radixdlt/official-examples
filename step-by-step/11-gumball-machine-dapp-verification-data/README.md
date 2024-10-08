# 11. Gumball Machine dApp with Verification Metadata

After getting our Gumball Machine dapp up and running on the Stokenet test
network, there are still a few things that would stop it from working correctly
on the main Radix network and in the Radix Wallet. This example will
demonstrates how to add metadata to your dapp definition, and how to link that
to your on ledger component and front end, to get it working and displaying
correctly on all versions of the network.

## Contents

- [Contents](#contents)
- [Setting up the Gumball Machine dApp](#setting-up-the-gumball-machine-dapp)
  - [Build the Scrypto Package](#build-the-scrypto-package)
  - [Deploy the Scrypto Package to Stokenet](#deploy-the-scrypto-package-to-stokenet)
  - [Instantiate the Gumball Machine Component](#instantiate-the-gumball-machine-component)
  - [dApp Definition](#dapp-definition)
  - [Updating Component Metadata](#updating-component-metadata)
  - [Front End Client Well-Known dApp Definition](#front-end-client-well-known-dapp-definition)
- [Using the dApp](#using-the-dapp)

## Setting up the Gumball Machine dApp

Running this example involves the very similar steps to the previous one with
the a few extras. We now have to instantiate our GumballMachine component in the
Developer Console and need to set our verification metadata with two way
linking.

### Build the Scrypto Package

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```sh
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/10.1-gumball-machine-dapp-with-metadata
    ```

2.  From inside the `scrypto-package` directory, build the code: `scrypto build`
3.  Two important files (`refillable_gumball_machine.rpd` and
    `refillable_gumball_machine.wasm`) will be generated in
    `scrypto-package/target/wasm32-unknown-unknown/release/`. You will need them
    for the next step

### Deploy the Scrypto Package to Stokenet

1. Go to the
   [Stokenet Developer Console Website](https://stokenet-console.radixdlt.com/deploy-package)
2. Connect the Wallet via the Connect Button
3. Navigate to Deploy Package
4. Upload both `refillable_gumball_machine.rpd` and
   `refillable_gumball_machine.wasm`
5. In the "Owner role" and "Owner role updatable" dropdowns select "None", as we
   do not have any package owner related functionality.
   > Package roles are used for
   > [royalty payments](https://docs.radixdlt.com/docs/using-royalties) and
   > package metadata updates. We strongly recommended having an owner role for
   > production packages.
6. Click on **Send to the Radix Wallet**, then go to your Radix Wallet where it
   should be asking you to approve the transaction
7. On the wallet **Slide to Sign** the deployment transaction. You may have to
   "Customize" which account pays the transaction fee if your account has no
   funds.
8. Once the transaction completes, the deployed **package address** should then
   be displayed back in the Stokenet Console. Make a note of it for the next
   step.

### Instantiate the Gumball Machine Component

We'll instantiate our Gumball Machine component using the Developer Console.

1. Head to the
   [Developer Console’s Send Raw Transaction Page](https://stokenet-console.radixdlt.com/transaction-manifest/).
2. Copy and paste the contents of the
   `/scrypto-package/manifests/instantiate_gumball_machine.rtm` file into the
   text box.
3. Replace the `_PACKAGE_ADDRESS_` placeholder with the address of the package
   you deployed earlier, the `_GUMBALL_PRICE_` with you desired price and the
   `_ACCOUNT_ADDRESS_` with the address of the account you are using.
4. Click **Send to the Radix Wallet** and approve the transaction in your Radix
   Wallet.
5. Once the transaction has been confirmed you should see a link to the
   transaction summary page in the console. Click it too.
6. Go to **Details** and see the transaction details. Make a note of all the
   **Created Entities**. We'll need them later.

Using the Developer Console for this means, compared to the last example, there
are some changes to the front end client that you'll see later.

### dApp Definition

We can add metadata to our dapp definition when we define it, or later if we
discover more details to add. In either case we can use the following steps to
set it.

1. Make sure you have an account in your Radix Wallet that you want to use as
   the dapp definition account. If you don't have one, create one.
2. Head to the
   [Developer Console’s Configure Metadata page](https://stokenet-console.radixdlt.com/configure-metadata).
   to use the interface to update entity metadata.
3. Connect your Radix Wallet to the Dashboard and select the dapp definition
   account. You may need to change the connected account by clicking on the
   **Connect** button again if you don't have the right account available.
4. Click on the **Connect** button again and copy your account address from the
   connect button to the search bar in the page, then click **Search**.
5. In the **account_type** dropdown ensure "dapp definition" is selected.
6. Make sure the correct name, description and icon_url are in their respective
   boxes. e.g:
   - **Name**: Gumball Machine
   - **Description**: A gumball machine that dispenses gumballs for XRD
   - **Icon URL**: https://assets.radixdlt.com/icons/icon-gumball-blue.png
7. In the **Metadata for Verification** section, click the **Add Claimed
   Entity** button and enter the Gumball Machine component address.
8. Repeat 6 for the Gumball Resource address.
9. Click the **+ Add Claimed Website** button and enter the website address your
   dapp will be reachable at. This will be used to link the dapp definition to
   the front end client and allows the Radix Wallet to work with the dapp when
   not in developer mode.
10. Click "Send to the Radix Wallet"
11. An approve transaction should appear in your Radix Wallet to confirm. You
    will likely need to "Customize" which account pays the transaction fee.

### Updating Component Metadata

Now that the dapp definition has been linked to the GumballMachine component and
resources, we need to link the component to the dapp definition. We do this by
updating the component's metadata.

1. Head back to the
   [Developer Console’s Configure Metadata page](https://stokenet-console.radixdlt.com/configure-metadata).
2. Paste the Gumball Machine component address into the search bar and click
   **Search**.
3. In the **Metadata for Verification** section, add your dapp definition
   account address.
4. In **Badges** section, click **+ Add Badge** and select the GumballMachine
   Owner Badge address.  
   _**Note:** You will need to have the account holding the badge connected to
   the console for it to show in the list._
5. Send the transaction to the Radix Wallet and approve it.
6. Repeat steps 2 to 5 for the Gumball Resource

### Front End Client Well-Known dApp Definition

To link the front end dapp to the dapp definition we need to add the dapp
definition address to the `/.well-known/radix.json` file. e.g:

```json
{
  "dApps": [
    {
      "dAppDefinitionAddress": "account_tdx_2_128mzv582sa7ang9hvkfz3xp07hjg8uegsyuv72nn6xcexj2t82nnuc"
    }
  ]
}
```

This completes the two way linking between the dapp definition and web address.
Transactions from this web address will now be verifiably linked to the dapp's
component and resources.

## Using the dApp

1. Connect your Radix Wallet to the client by clicking the "Connect" button in
   the top right corner of Connect Account section. When you do you'll see your
   account name and address displayed underneath.

2. In the **Connect Gumball Machine Component** section, enter the component
   address instantiated earlier and click **Connect**. You should see a
   transaction appear in your wallet. Approve it and wait for it to complete.
   Gumball resource address and Owner badge address displayed

   _You can save the component addresses to `client/main.js`, in the "Global
   states" section, to skip this step in the future. e.g._

   ```javascript
   // ********** Global states **********
   let account; // Users connected wallet account
   let componentAddress =
     "component_tdx_2_1cptrqpyhppv4r278affz4hr3cfzwxq5uw2vweenx7dmugnmh7840rr";
   ```

3. Once the Gumball Machine component has been instantiated you can use the
   methods in the Public and Owner Restricted sections. Try them out and see the
   results on the page. Each button will send a transaction manifest to your
   connected wallet to review and sign. These transactions will now show you
   information about the component from its dapp definition.

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
