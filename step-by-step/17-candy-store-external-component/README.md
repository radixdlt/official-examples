# 17. Candy Store with External Gumball Machine Component

## External Components

There are many ways to use external components in Scrypto. This example focuses
on using the engine's compile time type checking to ensure that our external
component is used correctly.

## Using the Candy Store and External Gumball Machine

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

    This will take the Gumball Machine owner badge from your account and place
    it in a new Candy Store component. That component can then use the badge and
    component address to call any of the methods on the Gumball Machine.

7.  Export the component and owner badge addresses. These will be displayed in
    the output of the previous command. To check the addresses use
    `resim show <ADDRESS>`. The badge can also be found with its name when
    inspecting the default account (`resim show $account`).

    ```sh
    export component2=<YOUR_COMPONENT_ADDRESS>
    export component2_badge=<YOUR_OWNER_BADGE_ADDRESS>
    ```

### Usage
