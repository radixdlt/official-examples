# 6. Refillable Gumball Machine

Building on the previous Gumball Machine with an Owner example, in this one
we've modified our first behaviour and given the machine the ability to mint
more Gumball tokens. Using the updated behaviour we've also added a new method
for the owner to refill the gumball machine.

- [Using the Refillable Gumball Machine](#using-the-refillable-gumball-machine)
  - [Setup](#setup)
  - [Usage](#usage)

## Using the Refillable Gumball Machine

### Setup

0.  First, (optionally) reset the simulator and create a new account.

    ```
    resim reset

    resim new-account

    resim show <ACCOUNT_ADDRESS>
    ```

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/06-refillable-gumball-machine
    ```

2.  Then, publish the package and save the package address.

    ```
    resim publish .
    ```

3.  Use the package address to instantiate the gumball machine, choosing a price
    for the gumballs.

    ```
    resim call-function <PACKAGE_ADDRESS> GumballMachine instantiate_gumball_machine <PRICE>
    ```

    The owner badge is created automatically when the gumball machine is
    instantiated. The badge will be in your account.

4.  Inspect your account looking at the `Owned Fungible Resources` section.

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

### Usage

You can use the Gumball Machine the same way as in the previous example. The
only difference is that you can now refill the machine with gumballs.

1.  Inspecting the gumball machine to observe how many gumball tokens are in the
    vault.

    ```
    resim show <COMPONENT_ADDRESS>
    ```

2.  Refill the machine with gumballs.

    ```
    resim call-method <COMPONENT_ADDRESS> refill_gumball_machine --proofs <OWNER_BADGE_ADDRESS>:1
    ```

3.  Inspecting the gumball machine component again will show it has been
    refilled.

    ```
    resim show <COMPONENT_ADDRESS>
    ```

We can now successfully used the gumball machine, collect our earnings, and
refill it.
