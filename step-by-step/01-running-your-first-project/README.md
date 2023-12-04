# 1. Running Your First Project

A good "Hello, World!" example provides the simplest possible piece of code to
understand the basics of a new language. However, Scrypto isn't just a typical
language – it is specialized for the management of assets on a decentralized
network. So rather than just printing "Hello, World!" to a console, our example
will hand out a token! So let's see the `Hello` component in action. We will use
`resim` to simulate publishing and using the the package on the Radix network.

- [resim - The Radix Engine Simulator](#resim---the-radix-engine-simulator)
- [Getting started with resim](#getting-started-with-resim)
- [The Hello package](#the-hello-package)
  - [Publishing a Package](#publishing-a-package)
  - [Instantiating a Component from a Package](#instantiating-a-component-from-a-package)
- [Using a Component](#using-a-component)

## `resim` - The Radix Engine Simulator

The Radix Engine Simulator, `resim`, allows you to use the Radix Engine on a
simulated Radix network for local development. You can create accounts, publish
packages, run transactions, and inspect the local ledger that the simulator
creates for this purpose.

## Getting started with `resim`

`resim` is installed along with scrypto. You can check that it is installed with
`resim -h` which will also list the resim commands, if installed. If you don't
have it installed, you can follow the
[Getting Rust & Scrypto](https://docs.radixdlt.com/docs/getting-rust-scrypto)
steps in the Radix Docs.

> The `resim reset` command will reset the simulator to its initial state. This
> is useful if you want to start over.

1. Create a new account with,

   ```
   resim new-account
   ```

   This will create a new account in the simulator, print various account
   details and set this as the default account.

2. Copy and save the printed `Account component address`

   If you do not see the last line,

   `Account configuration complete. Will use the above account as default.`

   you can set the account as default with,

   ```
   resim set-default-account <ACCOUNT_ADDRESS> <PRIVATE_KEY> <OWNER_BADGE>
   ```

   using your saved account address, the `Private key` and `Owner badge` address
   printed in the `new-account` output.

   Alternatively, you can `resim reset` and start over.

3. Check out our balance with

   ```
   resim show <ACCOUNT_ADDRESS>
   ```

   This will print the account details, including our
   `Owned Fungible Resources`, where you will see no HT (HelloToken) balance
   yet.

## The Hello package

We'll use the `Hello` package as our starting example. That package is the files
in the same directory as this README. This includes the files in the `src` and
`tests` subdirectories, as well as the `Cargo.toml` file.

### Publishing a Package

To be able to use the `Hello` component, we need to take our package containing
the `Hello` blueprint and publish it on our simulated network's ledger.

4. Make sure you are in the package directory (the same as this README), then
   publish the package with

   ```
   resim publish .
   ```

5. Copy and save the `New Package` address, from the last line of the output.

### Instantiating a Component from a Package

Once our package exists on the network, we can use it to produce a interactive
component with resources and callable methods. This is called _instantiating_ a
component.

6. Call the `instantiate_hello` function on the package to instantiate a
   component with

   ```
   resim call-function <PACKAGE_ADDRESS> Hello instantiate_hello
   ```

   using your saved package address.

   This will print the changed state of the local ledger. We are only interested
   in the last section, `New Entities`

7. Copy and save the `Component` address from the `New Entities` section.

8. View our newly instantiated component with

   ```
   resim show <COMPONENT_ADDRESS>
   ```

   This will print the component details, including a `Blueprint ID` and an
   `Owned Fungible Resources`, where you will see a 1000 HT (HelloToken)
   balance.

## Using a Component

Once the component is instantiated, we can use any of its methods. In this case,
we will use the `free_token` method to get a HT token from the component.

9. Call the `free_token` method of the component we just instantiated

   ```
   resim call-method <COMPONENT_ADDRESS> free_token
   ```

   This will print the changed state of the ledger again, but we are interested
   in the change to our account...

10. Check our account balance

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

    In the `Owned Fungible Resources` section, you should see that we now have 1
    HT. The tokens must be deposited somewhere, so The Radix Engine Simulator
    automatically deposited them into the account you created at the start as it
    is the default account.

11. Check the `Hello` component balance

    ```
    resim show <COMPONENT_ADDRESS>
    ```

    In the `Owned Fungible Resources` section, you should see that the component
    now has 999 HT as one has been transferred to the account.

### Congratulations!

You have successfully published a package, instantiated a component from it, and
used a method on the component to transfer a token to your account.
