# 1. Running Your First Project

A good "Hello, World!" example provides the simplest possible piece of code to
understand the basics of a new language. However, Scrypto isn't just a typical
language – it is specialized for the management of assets on a decentralized
network. So rather than just printing "Hello, World!" to a console, this first
example will hand out a token! So let's see the `Hello` component in action. We
will use `resim` to simulate publishing and using the package on the Radix
network.

_**For more detailed explanations of this and the following examples we
recommend going to
[Learning Step-by-Step section of the Radix docs](https://docs.radixdlt.com/docs/learning-step-by-step).**
Complete lessons for each example can be found there._

- [`resim` - The Radix Engine Simulator](#resim---the-radix-engine-simulator)
- [Getting started with `resim`](#getting-started-with-resim)
- [The Hello package](#the-hello-package)
  - [Publishing a Package](#publishing-a-package)
  - [Instantiating a Component from a Package](#instantiating-a-component-from-a-package)
- [Using a Component](#using-a-component)
  - [Congratulations!](#congratulations)

## `resim` - The Radix Engine Simulator

The Radix Engine Simulator, `resim`, allows you to use the Radix Engine on a
simulated Radix network for local development. You can create accounts, publish
packages, run transactions, and inspect the local ledger that the simulator
creates for this purpose.

## Getting started with `resim`

If you don't have `resim` installed, you can follow the
[Getting Rust & Scrypto](https://docs.radixdlt.com/docs/getting-rust-scrypto)
steps in the Radix Docs. You can check that it is installed with the command
`resim -h` which will also list the resim commands, if installed.

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

Radix splits the concept of "smart contracts" into two parts: blueprints and
components. Components are instantiated from blueprints, just like objects are
instantiations of a class. Blueprints describe what state a component will
manage, and implement the various methods which will be used to manage that
state. A package is one or multiple blueprints are grouped together.

This example uses the Hello package, which contains only one blueprint, called
`Hello`. That blueprint has a `free_token` method that hands-out a `HelloToken`.
The files for the package are those here in `/01-running-your-first-project`
(explained more in the next example).

### Publishing a Package

To be able to use the `Hello` component, we need to take our package containing
the `Hello` blueprint and publish it on our simulated network's ledger.

4. Clone the repository if you have not done so, and then publish the package

   ```
   git clone https://github.com/radixdlt/official-examples.git
   cd step-by-step/01-running-your-first-project
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
