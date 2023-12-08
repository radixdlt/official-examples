# 7 Gumball Machine Transaction Manifests

In this example there are no changes to the previous blueprint. Instead we focus
on transaction manifests, what they do and how to use them.

- [Transaction Manifests](#transaction-manifests)
- [Generating Transaction Manifests](#generating-transaction-manifests)
  - [Transaction Fees](#transaction-fees)
- [Transaction Manifests in `resim`](#transaction-manifests-in-resim)
- [Using Transaction Manifests](#using-transaction-manifests)

## Transaction Manifests

Every transaction in the Radix Engine and Radix Engine Simulator (resim) has a
manifest. Transaction manifests are list of instructions that are followed by
the engin. They are listed in order of execution in largely human readable
language, so that in most cases we can see what a transaction will do without
too much effort. If any step fails for any reason, the entire transaction fails
and none of the steps are committed to the ledger on the network.

Here is an example of simple transaction manifest to transfer 10 XRD from one
account to another:

```rust
CALL_METHOD
    Address("account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma")
    "lock_fee"
    Decimal("5")
;
CALL_METHOD
  Address("account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma")
  "withdraw"
  Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
  Decimal("10")
;
CALL_METHOD
  Address("account_sim1c9yeaya6pehau0fn7vgavuggeev64gahsh05dauae2uu25njk224xz")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP")
;
```

In the above:

- The first method call withdraws 10 XRD from an account leaving it on the
  transaction worktop
  > The **transaction worktop** is a temporary storage area for resources during
  > a transaction. Withdrawn resources are automatically placed on the worktop.
  > The transaction cannot be completed until all resources are deposited
  > elsewhere and the worktop is clear.
- The second method call deposits everything on the worktop (the 10 XRD) to
  another account

## Generating Transaction Manifests

Although you can write manifests by hand, it easier to use `resim` to generate
them for you. With very few modifications they can then be used on the network
as well as the simulator.

resim generates transaction manifests for us for each transaction, so we don't
have to create and apply them ourselves. Normally we don't have access to them,
but we can use the `--manifest <FILE_NAME>` flag to produce the manifest for a
given transaction instead of run it. e.g.

```bash
resim call-function package_sim1pk3cmat8st4ja2ms8mjqy2e9ptk8y6cx40v4qnfrkgnxcp2krkpr92 GumballMachine instantiate_gumball_machine 5 --manifest instantiate_gumball_machine.rtm
```

This will print the manifest to the file `instantiate_gumball_machine.rtm`,
where we can view, modify or run it.

### Transaction Fees

Transactions in the Radix Engine require a small fee to pay for the resources
used to run the transaction. The simulator has these too and you'll see an
amount reserved for the fee at the start of each transaction manifest. That
looks something like this:

```rust
CALL_METHOD
    Address("component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh")
    "lock_fee"
    Decimal("5000")
;
```

This locks a fee for the transaction from the faucet, a component that will
produce an endless supply of XRD whenever we need it. The `5000` value is high
enough to cover any incurred fee and the unspent part is left with the
component. This component, of course, does not exist on the main Radix network,
so these fees have to be handled in different ways. The Radix Wallet can
automatically add them for us, but if our transaction do not involve the Wallet
we will need to `lock_fees` in manifest so they be processed. For now though, as
we are working in the simulator, we do not have to worry.

## Transaction Manifests in `resim`

To run a transaction manifest in `resim` we can use the `run` command, e.g.

```bash
resim run instantiate_gumball_machine.rtm
```

Performing transaction in this way allows us to run multiple of the same
transaction, with a much shorter command.

## Using Transaction Manifests

Here we can try generating and running the manifests for the `GumballMachine`'s
functions and methods ourselves.

1. First publish the blueprint and get the package address as usual:

   ```bash
   resim publish .
   ```

2. Then generating and running the instantiate manifest uses the same commands
   as described above. Here they are again for reference:

   ```bash
   resim call-function <PACKAGE_ADDRESS> GumballMachine instantiate_gumball_machine <GUMBALL_PRICE> --manifest instantiate_gumball_machine.rtm
   ```

   ```bash
   resim run instantiate_gumball_machine.rtm
   ```

3. Next try the `buy_gumball` method, with the component address for the newly
   instantiated `GumballMachine`:

   ```bash
   resim call-method <COMPONENT_ADDRESS> buy_gumball <XRD_ADDRESS>:<XRD_AMOUNT> --manifest buy_gumball.rtm
   ```

   _Where the XRD address is
   `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3`_

   Run the manifest with:

   ```bash
   resim run buy_gumball.rtm
   ```

   Try changing the XRD amount in the manifest to `0` and running it again. You
   will the the transaction fails, with an `InsufficientBalance` error as there
   are no longer the funds requires to buy a Gumball. This demonstrates the
   updated manifest is being used for the transaction. Try some other values and
   see what happens.

4. Now we know how to generate and run the manifests, try doing it with the
   `GumballMachine`'s other methods.

   _Remember to use the `--proofs` flag for methods that require them._

   Once a manifest has been generated, try modifying it where you can and see
   what happens.
