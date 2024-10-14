# 18. Candy Store with External Gumball Machine Component

With the right access, components on the Radix ledger can contact and call
methods on global components instantiated from other packages. This example
demonstrates those external calls with our now very familiar Candy Store and
Gumball Machine components.

- [Using the Candy Store and External Gumball Machine](#using-the-candy-store-and-external-gumball-machine)
  - [Setup](#setup)
  - [Usage](#usage)

## Using the Candy Store and External Gumball Machine

This example, like the last, contains two packages. The first an identical
Gumball Machine package. The second is a Candy Store package that uses an
instantiated Gumball Machine component. You can use a script to publish and
instantiate the Gumball Machine. From there you can use the Gumball Machine's
addresses and owner badge to update and instantiate the Candy Store package.

### Setup

1.  First, clone the repository if you have not done so, and then change
    directory to this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/17-candy-store-external-component
    ```

2.  From the example's directory, run the setup script.

    You may wish to modify the gumball price in the
    `instantiate_gumball_machine.rtm` manifest before running it.

    On Linux or macOS:

    ```sh
    cd 17-candy-store-external-component/
    source ./setup.sh
    ```

    On Windows:

    ```cmd
    cd 17-candy-store-external-component/
    ./setup.bat
    ```

    This will reset the simulator, build the Gumball Machine package, publish it
    to the simulator, **instantiate it** and export several useful values,
    including:

    - The Gumball Machine package address
    - The Gumball Machine component address
    - The Gumball Machine owner badge address

3.  Add the Gumball Machine package address to the `2-candy-store/src/lib.rs`
    file, in the `extern_blueprint!` macro.

    ```rust
    extern_blueprint! {
     "<YOUR_GUMBALL_MACHINE_PACKAGE_ADDRESS>",
     // --snip--
    }
    ```

4.  Publish the Candy Store package to the simulator.

    ```sh
    resim publish ./2-candy-store
    ```

5.  Export the Candy Store package address.

    ```sh
    export package2=<YOUR_CANDY_STORE_PACKAGE_ADDRESS>
    ```

6.  Instantiate the Candy Store by using the `instantiate_candy_store.rtm`
    manifest.

    ```sh
    resim run manifests/instantiate_candy_store.rtm
    ```

    Looking at the manifest you will see it instantiates a new Candy Store
    component using the exported Gumball Machine component address,
    `$component1`. It also takes the Gumball Machine owner badge from your
    account and places that in the Candy Store component. The new component can
    then use the badge and component address to call any of the methods on the
    Gumball Machine.

7.  Export the component and owner badge addresses. These will be displayed in
    the output of the previous command. To check the addresses use
    `resim show <ADDRESS>`. The badge can also be found with its name when
    inspecting the default account (`resim show $account`).

    ```sh
    export component2=<YOUR_COMPONENT_ADDRESS>
    export component2_badge=<YOUR_OWNER_BADGE_ADDRESS>
    ```

### Usage

With the Candy Store and Gumball Machine instantiated, you can now use them
similarly to the previous examples. There are various manifests files in the
`manifests/` directory that can be used to interact with the
`resim run <PATH_TO_MANIFEST>` command.

Just like with the last example, you may also want to try publishing the
packages and instantiating the components on Stokenet. If you tried this last
time you can even use the same Gumball Machine package address you will have
generated then. Just remember to update the `extern_blueprint!` macro in the
Candy Store blueprint with the address.

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
