# 16. Candy Store with External Gumball Machine Blueprint

Blueprints and components do not exist on the radix network in isolation. They
are addressable and can interact with each other if allowed. This example shows
us how to allow and enable component interactions other than transactions.

- [External Blueprints](#external-blueprints)
- [Multiple instantiation functions](#multiple-instantiation-functions)
- [Using the Candy Store with External Gumball Machine](#using-the-candy-store-with-external-gumball-machine)
  - [Setup](#setup)
  - [Usage](#usage)

## External Blueprints

As the Radix eco system matures there will be more and more blueprints available
to use. These blueprints will be created are created by many different teams and
individuals. Some may even be made by you. To use them

## Multiple instantiation functions

So as to allow for both an owned and global gumball machine, we have two
instantiation functions. `instantiate_owned` and `instantiate_global`. This is a
good demonstration of component instantiation producing owned components
initially, which can subsequently be globalized. `instantiate_global` calls
`instantiate_owned` then globalizes the returned component:

```rs

```

We use it here, so the same version of the blueprint can be used in this and the
next example.

Having multiple instantiation functions can serve several other purposes as
well. Allowing for a standard default component to be created, while also
allowing for a more complex or customized component versions, potentially using
input arguments to decide on metadata or
[more complex access rules](https://docs.radixdlt.com/docs/en/reusable-blueprints-pattern#multiple-instantiation-functions).

## Using the Candy Store with External Gumball Machine

### Setup

1.  First, clone the repository if you have not done so, and then change
    directory to this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/16-candy-store-external-blueprint
    ```

2.  From the example's directory, run the setup script.

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

7.  Export the component and owner badge addresses. These will be displayed in
    the output of the previous command. To check the addresses use
    `resim show <ADDRESS>`. The badge can also be found with its name when
    inspecting the default account (`resim show $account`).

    ```sh
    export component=<YOUR_COMPONENT_ADDRESS>
    export component_badge=<YOUR_OWNER_BADGE_ADDRESS>
    ```

### Usage
