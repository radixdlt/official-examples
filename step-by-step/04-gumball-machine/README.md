# 4 Gumball Machine

A Radix favorite, this example covers the creation of a simple gumball machine,
which allows users to purchase a gumball in exchange for XRD.

In addition to the most basic operation, this particular example allows
instantiators to set the price (in XRD) of each gumball, and permits callers to
submit more than the exact price required. Callers will receive their change (if
any) in addition to their tasty gumball.

- [Resources and Data](#resources-and-data)
- [Getting Ready for Instantiation](#getting-ready-for-instantiation)
- [Allowing Callers to Buy Gumballs](#allowing-callers-to-buy-gumballs)
- [Using the Gumball Machine](#using-the-gumball-machine)
- [`resim` Makes Things Easy](#resim-makes-things-easy)

## Resources and Data

```rust
struct GumballMachine {
  gumballs: Vault,
  collected_xrd: Vault,
  price: Decimal
}
```

Our gumball machine will hold two kinds of resources in vaults: the gumballs to
be dispensed, and any XRD which has been collected as payment.

We'll also need to maintain the price, which we're using `Decimal` for.
`Decimal` is a bounded type appropriate for use for resource quantities. In
Scrypto, it has a fixed precision of 10<sup>-18</sup>, and a maximum value of
2<sup>96</sup>. Unless we're selling spectacularly expensive gumballs, this
should be fine. If we wanted an unbounded type to use for quantity, we could use
`BigDecimal` instead.

## Getting Ready for Instantiation

In order to instantiate a new gumball machine, the only input we need from the
caller is to set the price of each gumball. After creation, we'll be returning
the address of our new component, so we'll set our function signature up
appropriately:

```rust
pub fn instantiate_gumball_machine(price: Decimal) -> ComponentAddress {
```

Within the `instantiate_gumball_machine` function, the first thing we need to do
is create a new supply of gumballs which we intend to populate our new component
with:

```rust
let bucket_of_gumballs: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
   .divisibility(DIVISIBILITY_NONE)
   .metadata(metadata!(
      init {
         "name" => "Gumball", locked;
         "symbol" => "GUM", locked;
         "description" => "A delicious gumball", locked;
      }
   ))
   .mint_initial_supply(100)
   .into();
```

All that's left is to populate our `GumballMachine` struct with our supply of
gumballs, the user-specified price, and an empty Vault which we will force to
contain XRD. Then we'll instantiate it, which returns the address, and we'll
return that to the caller.

```rust
Self {
   gumballs: Vault::with_bucket(bucket_of_gumballs),
   collected_xrd: Vault::new(XRD),
   price: price,
}
.instantiate()
.prepare_to_globalize(OwnerRole::None)
.globalize()
```

## Allowing Callers to Buy Gumballs

In order to sell a gumball, we just need the method caller to pass us in enough
XRD to cover the price. We'll return the purchased gumball, as well as giving
back their change if they overpaid, so we actually need to return _two_ buckets.
This is easily accomplished by simply returning a tuple, giving us a method
signature like this:

```rust
pub fn buy_gumball(&mut self, payment: Bucket) -> (Bucket, Bucket) {
```

Note that we used `&mut self` because our reference to ourself must be mutable;
we will be changing the contents of our vaults, if all goes well.

Accomplishing the actual mechanics of putting the XRD in our vault, taking a
gumball out, and then returning the gumball as well as whatever is left in the
caller's input bucket are trivial:

```rust
let our_share = payment.take(self.price);
self.collected_xrd.put(our_share);
(self.gumballs.take(1), payment)
```

Note that we didn't have to check that the input bucket contained XRD...when we
attempt to put tokens into our `collected_xrd` Vault (which was initialized to
contain XRD), we'll get a runtime error if we try to put in anything else.

Similarly, we'll get a runtime error if we try to take out a quantity matching
the price, and find that there is insufficient quantity present.

Finally, if the user provided exactly the correct amount of XRD as input, when
we return their `payment` bucket, it will simply contain quantity 0.

## Using the Gumball Machine

To use the Gumball machine in the Radix Engine Simulator, we'll need to:

1. Publish the package

   ```
   resim publish .
   ```

2. Instantiate the gumball machine

   ```
   resim call-function <PACKAGE_ADDRESS> GumballMachine instantiate_gumball_machine <PRICE>

   resim show <COMPONENT_ADDRESS>

   ```

   Note the number of `GUM` tokens in the `Owned Fungible Resources` section of
   the output.

3. Fetch the price from the component

   ```
   resim call-method <COMPONENT_ADDRESS> get_price
   ```

   Look at the `Outputs` section of the response to see the price.

4. Buy a gumball

   ```
    resim call-method <COMPONENT_ADDRESS> buy_gumball <XRD_RESOURCE_ADDRESS>:<AMOUNT>

    resim show <ACCOUNT_ADDRESS>

    resim show <COMPONENT_ADDRESS>

   ```

   _where the `<XRD_RESOURCE_ADDRESS>` is
   `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3`_

   You will see that one gumball has been transferred from the `GumaballMachine`
   component to your account, and the price of the gumball has been transferred
   from your account to the GumballMachine component. If you provided more XRD
   than the price of the gumball, you will also see that the change has been
   returned to your account.

## `resim` Makes Things Easy

To make things easy `resim` hides some steps from us, steps in the form of
transaction manifests. A transaction manifest is a list of instructions that
must be submitted to the network for the transaction to take place.

`resim` automatically generates and submits these manifest files for us. We will
revisit this in later examples but, if you'd like to see these hidden manifest
you can add the `--manifest` flag to the `resim` command.

Try it out with,

```
resim call-method <COMPONENT_ADDRESS> buy_gumball --manifest manifest.rtm
```

This will output the manifest file to `manifest.rtm` in the current directory,
where you can inspect it.
