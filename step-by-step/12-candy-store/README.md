# 12. Candy Store

This is a good opportunity to introduce another new blueprint. This time we'll
create a candy store with two products, candy tokens and chocolate egg
non-fungibles that each have toys inside. We're also going to have not just an
owner role, but manager and staff roles too, so the store owner doesn't have to
run all the day to day of the store. This introduces a new concept,
**authorization roles**, which we will provide an explanation for.

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

> The `buy_candy` method uses checked mathematical operations to prevent
> overflow which might lock a component. It is highly recommended that you do
> the same in any Decimal calculations
>
> ```rs
>    let candy_amount = payment
>        .amount()
>        .checked_div(self.candy_price)
>        .unwrap()
>        .checked_round(0, RoundingMode::ToZero)
>        .unwrap();
> ```
>
> See the
> [Decimal Overflows](https://docs.radixdlt.com/docs/code-hardening#ensure-that-no-blueprints-suffer-from-state-explosion)
> section of the docs for more information.

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

1.  First, clone the repository if you have not done so, and then change
    directory to this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/12-candy-store
    ```

2.  There is a startup script that will reset `resim`, publish the `CandyStore`
    package and create environmental variables of useful values for you. To run
    it, **make sure you're in the right directory** and use the following
    command:

    on Linux or MacOS:

    ```sh
    source ./startup.sh
    ```

    on Windows:

    ```dos
    .\startup.bat
    ```

    Alternatively, you can run the commands in the script manually.

    1. Reset the simulator, create a new account and export the account address.

       ```sh
       resim reset
       resim new-account
       ```

       ```sh
       export account=<ACCOUNT_ADDRESS>
       ```

    2. Then, publish the package and export the package address.

       ```sh
       resim publish .
       ```

       ```sh
       export package=<PACKAGE_ADDRESS>
       ```

3.  Use the package address (or
    `resim run manifests/instantiate_candy_store.rtm`) to instantiate the candy
    store, choosing a price for the candy and chocolate bars.

    ```sh
    resim call-function <PACKAGE_ADDRESS> CandyStore instantiate_candy_store <CANDY_PRICE> <CHOCOLATE_BAR_PRICE>
    ```

    and export the component address.

    ```sh
    export component=<COMPONENT_ADDRESS>
    ```

    An owner badge, an manager badge and 5 staff badges are created
    automatically when the candy store is instantiated. The badges will be in
    your account.

4.  Inspect your account looking at the `Owned Fungible Resources` section to
    see the badges and export their addresses.

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

    ```sh
    export owner_badge=<OWNER_BADGE_ADDRESS>
    export manager_badge=<MANAGER_BADGE_ADDRESS>
    export staff_badge=<STAFF_BADGE_ADDRESS>
    ```

### Usage

The new methods here work similarly to the gumball machine examples. Try them
out in whichever order you like.

Remember that;

- you can view any component, resource or account with `resim show <ADDRESS>`,
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
- example transaction manifests that use the exported variables from setup can
  be found in the `manifests` directory,
- once you have some transaction manifests, you can try deploying the package on
  Stokenet via the
  [Console](https://stokenet-console.radixdlt.com/deploy-package), then use the
  manifests to run the methods of the deployed component.
