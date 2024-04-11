# 15. Candy Store with an Owned Gumball Machine

In the last example we looked at a candy store package made up of several
blueprints. This example will show how to do the same thing in a different way.
We will still have a candy store component containing a gumball machine
component. The difference this time, will be the gumball machine will be
**owned** by the candy store.

There are two broad ways to modularise your components, each with distinct
advantages.

1. Global components: Like all the components from the previous examples, these
   are created at the global level and are accessible to all other components on
   the ledger.
2. Owned components: Internal to other components, they are only accessible to
   those parent components.

- [Global and Owned Components](#global-and-owned-components)
  - [Owned vs Global `GumBallMachine`](#owned-vs-global-gumballmachine)
  - [Owner vs Non-owner `CandyStore`](#owner-vs-non-owner-candystore)
- [Using the Candy Store](#using-the-candy-store)
  - [Setup](#setup)
  - [Use](#use)

## Global and Owned Components

All components are initially local. In this state they are not addressable by or
accessible to others. To change this we globalize them, done after instantiation
by first calling `prepare_to_globalize` (setting the component access rules and
reserving an address) on the new component, then calling the `globalize` method
like so:

```rs
    .instantiate()
    .prepare_to_globalize(OwnerRole::None)
    .globalize();
```

Without these steps, to use a component it must be internal to another. This is
done by adding the component in a parent component's struct, with the wrapping
`Owned` type, e.g.

```rust
    struct CandyStore {
        gumball_machine: Owned<GumballMachine>,
    }
```

The owned component's methods, can then be called by it's parent, but no other
components. e.g.

```rust
    self.gumball_machine.buy_gumball(payment);
```

Let's compare how this looks in our example packages.

### Owned vs Global `GumBallMachine`

The global `GumballMachine` is the same as from previous examples. The owned
version is where we see several changes.

<table>
<tr><td>GumballMachine blueprint</td><td>Owned</td><td>Global</td>
<tr>
  <td>Restricted methods</td>
  <td>
  
  - No method restrictions. This is now handled by the parent component.
  
  </td>
  <td>

```rs
enable_method_auth! {
    methods {
        buy_gumball => PUBLIC;
        get_price => PUBLIC;
        set_price => restrict_to: [OWNER];
        withdraw_earnings => restrict_to: [OWNER];
        refill_gumball_machine => restrict_to: [OWNER];
    }
    }
```

  </td>
</tr>
<tr>
  <td>Instantiation function start</td>
  <td>

- The parent component address is passed in.
- Only the new component is returned as there's no owner badge.

```rs
pub fn instantiate_gumball_machine(
    price: Decimal,
    parent_component_address: ComponentAddress,
) -> Owned<GumballMachine> {
```

  </td>
  <td>

- A component address reserved.
- Both the component and owner badge are returned.

```rs
pub fn instantiate_gumball_machine(price: Decimal) ->
    (Global<GumballMachine>, Bucket) {
        // reserve an address for the component
        let (address_reservation, component_address) =
            Runtime::allocate_component_address(
                GumballMachine::blueprint_id()
            );
```

  </td>
</tr>
<tr>
  <td>Owner badge</td>
  <td>
  
  - No owner badge. The parent component is the owner.
  
  </td>
  <td>

```rs
let owner_badge = ...
```

  </td>
</tr>
<tr>
  <td>Gumball mint roles</td>
  <td>

```rs
    .mint_roles(mint_roles! {
        minter => rule!(
              require(
                  global_caller(parent_component_address)
              )
            );
        minter_updater => rule!(deny_all);
    })
```

  </td>
    <td>

```rs
    .mint_roles(mint_roles! {
        minter => rule!(require(
            global_caller(component_address)
        ));
        minter_updater => rule!(deny_all);
    })
```

  </td>
</tr>
<tr>
  <td>Instantiation function end</td>
  <td>

```rs
    .instantiate()
```

  </td>
  <td>

```rs
    .instantiate()
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    .with_address(address_reservation)
    .globalize();
```

  </td>
  
</tr>
</table>

The owned version is simpler, as we're able to remove much of the access and
control code, but it comes with a downside. The radix engine has to do more
under the hood to manage an owned component. This means that the owned version
is more expensive to run, with higher transaction fees.

### Owner vs Non-owner `CandyStore`

The `CandyStore` is globalized in both version of our package. The code for its
blueprint is simpler when it owns the `GumballMachine`. In this version the only
accessible methods to a caller are those of the `CandyStore`, which we've
restricted access to where necessary. The `GumballMachine` methods can then only
be used if they are called by the `CandyStore`. There is no way to access the
`GumballMachine` without going through the `CandyStore` first, so we don't need
to restrict the `GumballMachine` methods.

The previous example's version needs to hold the `GumballMachine` owner badge
and pass proof of that ownership to the `GumballMachine` when calling it's
restricted methods. This is done with the `authorize_with_amount` method, which
we don't have to use at all in our owned version. The methods must be restricted
in both the `CandyStore` and the `Gumball Machine` as both have global addresses
and can be accessed by any caller.

<table>
<tr>
  <td>CandyStore blueprint</td><td>Owner (owned GumballMachine)</td><td>Non-owner (global GumballMachine)</td>
</tr>
<tr>
  <td>Component state</td>
  <td>
  
```rs
struct CandyStore {
    gumball_machine: Owned<GumballMachine>,
}
```
  
  </td>
  <td>

```rs
struct CandyStore {
    gumball_machine: Global<GumballMachine>,
    gumball_machine_owner_badges: Vault,
}
```

  </td>
</tr>
<tr>
  <td>Address reservation</td>
  <td>

```rs
let (address_reservation, component_address) =
    Runtime::allocate_component_address(
        CandyStore::blueprint_id()
    );
```

  </td>
  <td>

- None. The `GumballMachine` address and owner badge are used to restrict access
to component methods and token behaviours.

  </td>
</tr>
<tr>
  <td>Gumball machine instantiation</td>
  <td>

```rs
let gumball_machine =
    GumballMachine::instantiate_gumball_machine(
        gumball_price,
        component_address,
    );
```

  </td>
  <td>

```rs
let (gumball_machine, gumball_machine_owner_badge) =
    GumballMachine::instantiate_gumball_machine(
        gumball_price
    );
```

  </td>
</tr>
<tr>
  <td>Globalizing</td>
  <td> 
  
  ```rs
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    .with_address(address_reservation)
    .globalize();
  ```
  
  </td>
  <td>

```rs
    .instantiate()
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    .globalize();
```

  </td>
</tr>
<tr>
  <td>Calling restricted GumballMachine methods</td>
  <td> 
  
  ```rs
pub fn set_gumball_price(&mut self, new_price: Decimal) {
    self.gumball_machine.set_price(new_price);
}
  ```
  </td>
  <td>

- To call a method on the GumballMachine we need to pass a proof that we have
  it's owner badge.

```rs
pub fn set_gumball_price(&mut self, new_price: Decimal) {
    self.gumball_machine_owner_badges
        .as_fungible()
        .authorize_with_amount(
            1,
            || self.gumball_machine.set_price(new_price)
        );
}
```

  </td>
</tr>
<table>

Owned components make for simpler code that is easier to read and maintain. But
you will have to decide if the extra transaction cost is worth it for your
applications.

## Using the Candy Store

The steps here are the same as for the previous example. There are a few small
differences in what you will see when running the commands, but the overall
process is the same.

### Setup

1. First, clone the repository if you have not done so, and then change
   directory to this example.

   ```
   git clone https://github.com/radixdlt/official-examples.git

   cd official-examples/step-by-step/15-candy-store-owned-modules
   ```

2. From the example's directory, run the setup script.

   On Linux or macOS:

   ```sh
   cd 15-candy-store-owned-modules/
   source ./setup.sh
   ```

   On Windows:

   ```cmd
   cd 15-candy-store-owned-modules/
   ./setup.bat
   ```

   This will reset the simulator, build the package, publish it to the simulator
   and export several useful useful values.

3. Instantiate the component by using the `instantiate_candy_store.rtm`
   manifest.

   You may wish to modify the gumball price in the manifest before running it.

   ```sh
   resim run ../manifests/instantiate_candy_store.rtm
   ```

   Note the number of `New Entities` created. A different number of components
   will be listed depending on which example you are running. As the owned
   component is not globally addressable, it is not counted as a new entity.

4. Export the component and owner badge addresses. These will be displayed in
   the output of the previous command. To check the addresses use
   `resim show <ADDRESS>`. The badge can also be found with its name when
   inspecting the default account (`resim show $account`).

   ```sh
   export component=<YOUR COMPONENT ADDRESS>
   export owner_badge=<YOUR OWNER BADGE ADDRESS>
   ```

### Use

After instantiation the components methods can be called in the same way as with
previous examples. Either by using the `resim call-method` command or by using
the `resim run` followed by the radix transaction manifest path of choice. The
manifests are located in the `manifests` directory.
