# 6 Refillable Gumball Machine

Building on the previous Gumball Machine with an Owner example, in this one
we'll modify our first behaviour and give the machine the ability to mint more
Gumball tokens. Using the updated behaviour we also add a new method for the
owner to refill the gumball machine.

- [Behaviours](#behaviours)
  - [Fixed Supply vs Mintable](#fixed-supply-vs-mintable)
  - [Resource Managers](#resource-managers)
  - [New Methods](#new-methods)
- [Using the Refillable Gumball Machine](#using-the-refillable-gumball-machine)
  - [Setup](#setup)
  - [Usage](#usage)

## Behaviours

Tokens in the Radix Engine have a collection of behaviours that define what they
can and can't do. Things like whether they can be withdrawn, burned, or minted.
If we don't select their values, they will be set to their defaults
(withdrawable, none-burnable, none-mintable etc.). If we want to change these we
can do so by adding the desired behaviours, along with the rules to update them,
to the token when it's first defined.

### Fixed Supply vs Mintable

By default tokens have a fixed supply. We need make the gumball resource
mintable, so we can create more after the initial batch. Our token is made
mintable by adding `mint_roles` to the `bucket_of_gumballs` in its initial
definition.

```rust
.mint_roles(mint_roles! {
    minter => rule!(allow_all);
    minter_updater => rule!(deny_all);
})
```

For now our minter rule allows anyone to mint new gumballs. We'll look at
restricting this in later examples. We also need to decide on a rule for who can
change the minter rule. For simplicity, we stop anyone from updating it.

### Resource Managers

Now our gumball resource is mintable, we need to have access to its resource
manager to mint it. We can do this by adding a `ResourceManager` to our
component's state.

```rust
struct GumballMachine {
    gum_resource_manager: ResourceManager,
    gumballs: Vault,
    collected_xrd: Vault,
    price: Decimal,
}
```

That also means we need to add the resource manager to the component at
instantiation. We can do this with the `resource_manager` method on the bucket.

```rust
let component = Self {
    gum_resource_manager: bucket_of_gumballs.resource_manager(),
    gumballs: Vault::with_bucket(bucket_of_gumballs),
    collected_xrd: Vault::new(XRD),
    price: price,
}
```

If we had no initial supply of gumballs, defining them would produce a resource
manager instead of a bucket, which we could have used directly in the
instantiation.

### New Methods

We've added just one new method to the gumball machine this time:

- `refill_gumball_machine` - Takes no arguments and refills the `gumballs` vault
  with to gumballs.

  ```rust
    pub fn refill_gumball_machine(&mut self) {
        let gumball_amount = 100 - self.gumballs.amount();
        self.gumballs
            .put(self.gum_resource_manager.mint(gumball_amount));
    }
  ```

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
