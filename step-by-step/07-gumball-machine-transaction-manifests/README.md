# 7. Gumball Machine Transaction Manifests

In this example there are no changes to the previous blueprint. Instead we focus
on transaction manifests, what they do and how to use them.

- [Transaction Manifests](#transaction-manifests)
- [Using Transaction Manifests](#using-transaction-manifests)

## Transaction Manifests

Every transaction in the Radix Engine and Radix Engine Simulator (resim) has a
manifest. Transaction manifests are lists of instructions that are followed by
the engin. They are listed in order of execution in largely human readable
language, so that in most cases we can see what a transaction will do without
too much effort. If any step fails for any reason, the entire transaction fails
and none of the steps are committed to the ledger on the network.

## Using Transaction Manifests

Here we can try generating and running the manifests for the `GumballMachine`'s
functions and methods ourselves.

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

    cd official-examples/step-by-step/07-gumball-machine-transaction-manifests
    ```

2.  Next publish the blueprint and get the package address as usual:

    ```sh
    resim publish .
    ```

3.  Then generating and running the instantiate manifest uses the same commands
    as described above. Here they are again for reference:

    ```sh
    resim call-function <PACKAGE_ADDRESS> GumballMachine instantiate_gumball_machine <GUMBALL_PRICE> --manifest instantiate_gumball_machine.rtm
    ```

    ```sh
    resim run instantiate_gumball_machine.rtm
    ```

4.  Next try the `buy_gumball` method, with the component address for the newly
    instantiated `GumballMachine`:

    ```sh
    resim call-method <COMPONENT_ADDRESS> buy_gumball <XRD_ADDRESS>:<XRD_AMOUNT> --manifest buy_gumball.rtm
    ```

    _Where the XRD address is
    `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3`_

    Run the manifest with:

    ```sh
    resim run buy_gumball.rtm
    ```

    Try changing the XRD amount in the manifest to `0` and running it again. You
    will the the transaction fails, with an `InsufficientBalance` error as there
    are no longer the funds requires to buy a Gumball. This demonstrates the
    updated manifest is being used for the transaction. Try some other values
    and see what happens.

5.  Now we know how to generate and run the manifests, try doing it with the
    `GumballMachine`'s other methods.

    _Remember to use the `--proofs` flag for methods that require them._

    Once a manifest has been generated, try modifying it where you can and see
    what happens.
