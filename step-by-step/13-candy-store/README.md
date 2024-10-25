# 13. Candy Store

This is a good opportunity to introduce another new blueprint. This time we've
created a candy store with two products, candy tokens and chocolate egg
non-fungibles that each have toys inside. We also have not just an owner role,
but manager and staff roles too, so the store owner doesn't have to run all the
day to day of the store. This introduces the new concept of **authorization
roles**.

- [Using the Candy Store](#using-the-candy-store)
  - [Setup](#setup)
  - [Usage](#usage)
- [License](#license)

## Using the Candy Store

### Setup

1.  First, clone the repository if you have not done so, and then change
    directory to this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/12-candy-store
    ```

2.  There is a startup script that will reset `resim`, publish the `CandyStore`
    package and create environmental variables of useful values for you. To run
    it, **make sure you're in the right directory** and use the following
    command:

    on Linux or MacOS:

    ```sh
    source ./startup.sh
    ```

    on Windows:

    ```dos
    .\startup.bat
    ```

    Alternatively, you can run the commands in the script manually.

    1. Reset the simulator, create a new account and export the account address.

       ```sh
       resim reset
       resim new-account
       ```

       ```sh
       export account=<ACCOUNT_ADDRESS>
       ```

    2. Then, publish the package and export the package address.

       ```sh
       resim publish .
       ```

       ```sh
       export package=<PACKAGE_ADDRESS>
       ```

3.  Use the package address (or
    `resim run manifests/instantiate_candy_store.rtm`) to instantiate the candy
    store, choosing a price for the candy and chocolate bars.

    ```sh
    resim call-function <PACKAGE_ADDRESS> CandyStore instantiate_candy_store <CANDY_PRICE> <CHOCOLATE_BAR_PRICE>
    ```

    and export the component address.

    ```sh
    export component=<COMPONENT_ADDRESS>
    ```

    An owner badge, an manager badge and 5 staff badges are created
    automatically when the candy store is instantiated. The badges will be in
    your account.

4.  Inspect your account looking at the `Owned Fungible Resources` section to
    see the badges and export their addresses.

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

    ```sh
    export owner_badge=<OWNER_BADGE_ADDRESS>
    export manager_badge=<MANAGER_BADGE_ADDRESS>
    export staff_badge=<STAFF_BADGE_ADDRESS>
    ```

### Usage

The new methods here work similarly to the gumball machine examples. Try them
out in whichever order you like.

Remember that;

- you can view any component, resource or account with `resim show <ADDRESS>`,
- the XRD address in resim is
  `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3` and can
  be seen in your account,
- to present a proof you need to use the `--proofs` flag and specify the
  quantity of each resource you want to use as proof. e.g.
  `resim call-method <COMPONENT_ADDRESS> restock_store --proofs <STAFF_BADGE_ADDRESS>:1`,
- if you want to see the transaction manifest that's generated under the hood,
  add the `--manifest` flag, followed by the name of the file you want to save.
  e.g.
  `resim call-method <COMPONENT_ADDRESS> mint_staff_badge --proof <MANAGER_BADGE_ADDRESS>:1 --manifest manifest.rtm`,
- example transaction manifests that use the exported variables from setup can
  be found in the `manifests` directory,
- once you have some transaction manifests, you can try deploying the package on
  Stokenet via the
  [Console](https://stokenet-console.radixdlt.com/deploy-package), then use the
  manifests to run the methods of the deployed component.

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
