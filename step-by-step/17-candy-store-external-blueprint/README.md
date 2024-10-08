# 17. Candy Store with External Gumball Machine Blueprint

Blueprints and components do not exist on the radix network in isolation. They
are addressable and can interact with each other if allowed. This example shows
us how to allow and enable component interactions other than transactions.

- [Using the Candy Store with an External Gumball Machine](#using-the-candy-store-with-an-external-gumball-machine)
  - [Setup with no published external blueprint](#setup-with-no-published-external-blueprint)
  - [Setup including publishing an external blueprint](#setup-including-publishing-an-external-blueprint)
  - [Usage](#usage)

## Using the Candy Store with an External Gumball Machine

You will notice that there are two packages in this example. To demonstrate
using and external blueprint we need to first publish the external Gumball
Machine package to the ledger. The Candy Store Package can then be published
using the Gumball Machine package address.

Before we try that though, lets see what happens without a published Gumball
Machine package.

### Setup with no published external blueprint

1.  First, clone the repository if you have not done so, and then change
    directory to this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/16-candy-store-external-blueprint
    ```

2.  Next reset the simulator and create a new account.

    ```sh
    resim reset
    resim new-account
    ```

3.  Try to publish the Candy Store package to the ledger.

    ```sh
    resim publish ./2-candy-store
    ```

    You will see an error message like this:

    ```sh
    Error: TransactionRejected(ErrorBeforeLoanAndDeferredCostsRepaid(KernelError(InvalidReference(NodeId("0da38df56782eb2eab703ee4022b250aec726b06abd9504d23b2266c0556")))))
    ```

    This is because the Candy Store blueprint is trying to find the Gumball
    Machine blueprint, but the Gumball Machine blueprint does not exist on the
    ledger at the given address yet.

### Setup including publishing an external blueprint

1.  From the example's directory, run the setup script.

    On Linux or macOS:

    ```sh
    cd 16-candy-store-external-blueprint/
    source ./setup.sh
    ```

    On Windows:

    ```cmd
    cd 16-candy-store-external-blueprint/
    ./setup.bat
    ```

    This will reset the simulator, build the Gumball Machine package, publish it
    to the simulator and export several useful values.

2.  Add the Gumball Machine package address to the `2-candy-store/src/lib.rs`
    file, in the `extern_blueprint!` macro.

    ```rust
    extern_blueprint! {
     "<YOUR_GUMBALL_MACHINE_PACKAGE_ADDRESS>",
     // --snip--
    }
    ```

3.  Publish the Candy Store package to the simulator.

    ```sh
    resim publish ./2-candy-store
    ```

4.  Export the Candy Store package address.

    ```sh
    export package2=<YOUR_CANDY_STORE_PACKAGE_ADDRESS>
    ```

5.  Instantiate the Candy Store by using the `instantiate_candy_store.rtm`
    manifest.

    ```sh
    resim run manifests/instantiate_candy_store.rtm
    ```

6.  Export the component and owner badge addresses. These will be displayed in
    the output of the previous command. To check the addresses use
    `resim show <ADDRESS>`. The badge can also be found with its name when
    inspecting the default account (`resim show $account`).

    ```sh
    export component=<YOUR_COMPONENT_ADDRESS>
    export component_badge=<YOUR_OWNER_BADGE_ADDRESS>
    ```

### Usage

The Candy Store component can now be used in the same way as in previous
examples. There are manifest files in the `manifests/` directory usable with the
`resim run <PATH_TO_MANIFEST>` command.

You might also like to try publishing the packages to the Stokenet test network
to see how they work there. This process is described for a single package in
the [Ledger Ready Gumball Machine](../08-ledger-ready-gumball-machine/README.md)
example. Simply do this for both, remembering to insert the Gumball Machine
package address into the Candy Store package before publishing it. The
transaction manifests in the `manifests/` directory can then be used to interact
with the components on Stokenet, though you will have to update the addresses in
them.

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
