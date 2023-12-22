# 12 Candy Store

It's time for a new blueprint again. This time we're going to create a candy
store with multiple products; candy tokens and chocolate egg non-fungibles that
come with different toys inside. We're also going to have not just an owner, but
manager and staff roles so the owner doesn't have to run all the day to day of
the store. This introduces a new concept, **authorization roles**, which we will
explain.

- [Authorization Roles](#authorization-roles)
  - [Adding Roles](#adding-roles)
  - [Badge Creation](#badge-creation)
  - [Instantiation](#instantiation)
- [Methods](#methods)
- [Using the Candy Store](#using-the-candy-store)
  - [Setup](#setup)
  - [Usage](#usage)

## Authorization Roles

Authorization in Scrypto is handled with roles. Each component has 2 predefined
roles, the Owner role and the Self role. In previous examples, we used the Owner
role to restrict access to the multiple methods our gumball machines. Here we'll
add two more custom roles, the Manger and the Staff roles.

### Adding Roles

Additional roles are defined in the `enable_method_auth!` macro at the top of
the blueprint code:

```rust
enable_method_auth!{
    roles {
        manager => updatable_by: [OWNER];
        staff => updatable_by: [manager, OWNER];
    },
```

The component methods can then be restricted to one or more roles:

```rust
    methods {
        buy_candy => PUBLIC;
        buy_chocolate_egg => PUBLIC;
        get_prices => PUBLIC;
        set_candy_price => restrict_to: [manager, OWNER];
        set_chocolate_egg_price => restrict_to: [manager, OWNER];
        mint_staff_badge => restrict_to: [manager, OWNER];
        restock_store => restrict_to: [staff, manager, OWNER];
        withdraw_earnings => restrict_to: [OWNER];
    }
}
```

### Badge Creation

Along with the Owner badge we now need a Manger badge and a Staff badges. The
Manger badge is just like the Owner badge, but with `name` and `symbol` metadata
of `Manger Badge` and `MNG` respectively.

```rust
let manager_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
    .metadata(metadata!(
        init {
            "name" => "Manger Badge", locked;
            "symbol" => "MNG", locked;
        }
    ))
    .mint_initial_supply(1)
    .into();
```

The Staff badge, as well as having it's own `name` and `symbol`, is mintable, in
case we hire more staff.

To make it mintable we've set the minter rule to require the component address
as proof. To do that we have to reserve an address for the component at the
beginning of the instantiate function.

```rust
let (address_reservation, component_address) =
    Runtime::allocate_component_address(CandyStore::blueprint_id());
```

The `component_address` can then be used in the `minter` rule.

```rust
let staff_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
    .metadata(metadata!(
        init {
            "name" => "Staff Badge", locked;
            "symbol" => "STAFF", locked;
        }
    ))
    .mint_roles(mint_roles! {
        minter => rule!(require(global_caller(component_address)));
        minter_updater => rule!(deny_all);
    })
    .mint_initial_supply(2)
    .into();
```

This means that only the instantiated `CandyStore` component can mint the Staff
badge, which can be done with the `mint_staff_badge` method called from the
component.

This is the **Virtual Badge pattern** described in the
[Ledger Ready Gumball Machine](/08-ledger-ready-gumball-machine/README.md#virtual-badges)
example.

The same minting rule is applied to our candy and chocolate egg tokens. This
means that we'll know that they must have come from our `buy_candy` and
`buy_chocolate_egg` methods, as only the `CandyStore` component can mint them.

### Instantiation

Now we have these new roles and rules, we need to instantiate the component with
the rules stating which proofs are required to fulfil which roles. We also need
to give the new component the address reserved at the beginning of the
instantiation function.

```rust
let component = Self {
                // stripped for brevity
    }
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    // define required proofs for custom roles
    .roles(roles!(
        manager => rule!(require(admin_badge.resource_address()));
        staff => rule!(require(staff_badge.resource_address()));))
    // apply the address reservation to the component
    .with_address(address_reservation)
    .globalize();
```

## Methods

Buying a chocolate egg works the same as buying a gumball. You provide a payment
and if it is more than the cost of an egg, you get one chocolate egg and change.

```rust
pub fn buy_chocolate_egg(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
```

Buying candy is a little different. You can buy as much candy as is currently in
stock at once, if you have the tokens to pay for it. The payment is divided by
the candy price and you receive that many candy tokens, plus any change.

```rust
pub fn buy_candy(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
```

There are also two methods to set the price of the candy and chocolate eggs.
These are restricted to the manager and owner roles.

```rust
pub fn set_candy_price(&mut self, new_price: Decimal) {
```

```rust
pub fn set_chocolate_egg_price(&mut self, new_price: Decimal) {
```

Minting staff badges is also restricted to the manager and owner roles. The
method returns the minted badge rather than storing it in the component.

```rust
pub fn mint_staff_badge(&mut self) -> Bucket {
```

The `restock_store` method can be called by staff, manager or owner role
holders. It now adds resources to two vaults, adding one of each type of egg and
refilling the candy vault to 100.

```rust
    pub fn restock_store(&mut self) {
        let candy_amount = 100 - self.candy.amount();
        self.candy
            .put(self.candy_resource_manager.mint(candy_amount));

        let eggs = [
            Egg { toy: Toy::Dinosaur },
            Egg { toy: Toy::Unicorn },
            Egg { toy: Toy::Dragon },
            Egg { toy: Toy::Robot },
            Egg { toy: Toy::Pony },
        ];
        for egg in eggs.iter() {
            self.chocolate_eggs.put(
                self.chocolate_egg_resource_manager
                    .mint_ruid_non_fungible(egg.clone()),
            )
        }
```

## Using the Candy Store

### Setup

0.  First, (optionally) reset the simulator and create a new account.

    ```sh
    resim reset

    resim new-account
    ```

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/12-candy-store
    ```

2.  Then, publish the package and save the package address.

    ```sh
    resim publish .
    ```

3.  Use the package address to instantiate the candy store, choosing a price for
    the candy and chocolate bars.

    ```
    resim call-function <PACKAGE_ADDRESS> CandyStore instantiate_candy_store <CANDY_PRICE> <CHOCOLATE_BAR_PRICE>
    ```

    An owner badge, an manager badge and 5 staff badges are created
    automatically when the candy store is instantiated. The badges will be in
    your account.

4.  Inspect your account looking at the `Owned Fungible Resources` section to
    see the badges.

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

### Usage

The new methods here work similarly to the gumball machine examples. Try them
out in whichever order you like. Remember that;

- you can view any component or account with `resim show <ADDRESS>`,
- the XRD address in resim is
  `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3` and can
  be seen in your account,
- to present a proof you need to use the `--proofs` flag and specify the
  quantity of each resource you want to use as proof. e.g.
  `resim call-method <COMPONENT_ADDRESS> restock_store --proof <STAFF_BADGE_ADDRESS>:1`,
- if you want to see the transaction manifest that's generated under the hood,
  add the `--manifest` flag, followed by the name of the file you want to save.
  e.g.
  `resim call-method <COMPONENT_ADDRESS> mint_staff_badge --proof <MANAGER_BADGE_ADDRESS>:1 --manifest manifest.rtm`,
- once you have some transaction manifests, you can try deploying the package on
  Stokenet via the
  [Console](https://stokenet-console.radixdlt.com/deploy-package), then use the
  manifests to run the methods of the deployed component.
