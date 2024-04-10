# 14. Candy Store with a Gumball Machine

Up until now we've had packages of only one blueprint. Here we will create a
package with more. A candy store containing only a single gumball machine will
be represented with blueprints that, when instantiated, will become two
components.

There are two broad ways to do this, with distinct advantages. This example
covers a version using only global components. The other version, using owned
components, is covered in the next example.

- [Modular Packages](#modular-packages)
- [Modular Package Blueprints](#modular-package-blueprints)
  - [The `GumBallMachine` blueprint](#the-gumballmachine-blueprint)
  - [The `CandyStore` blueprint](#the-candystore-blueprint)
- [Using the Candy Store](#using-the-candy-store)
  - [Setup](#setup)
  - [Use](#use)
- [Final Thoughts](#final-thoughts)

## Modular Packages

Using
[several blueprints in one package](https://docs.radixdlt.com/docs/en/reusable-blueprints-pattern#small-modular-reusable-blueprints)
is a common pattern with advantages of making it;

- easier to manage and upgrade parts of your application,
- more secure, by limiting the scope of each component,
- easier to test and debug,
- easier to reuse components in other packages.

For these reasons it's normally a good idea to split your application into
several blueprints each in their own file, though it's not always necessary.
This is done by placing each blueprint in it's own file in the `src/` directory,
alongside the `lib.rs` file. For example:

```
src/
├── candy_store.rs
├── gumball_machine.rs
└── lib.rs
```

`lib.rs` is the starting point of a scrypto package. Any blueprints modules in
the package not in `lib.rs` it's self must be added using the `mod` keyword,
like so:

```rs lib.rs
mod candy_store;
mod gumball_machine;
```

For a blueprint that directly uses another, we also need to import it into the
blueprint's file. For example, the `CandyStore` blueprint uses the
`GumballMachine`, so we import it at the top of `candy_store.rs`, with the `use`
keyword:

```rs candy_store.rs
use crate::gumball_machine::gumball_machine::*;
```

There are then two ways to for us to prepare our components to work together. We
can globalize them, or we can make one owned by the other. Each requires a
different setup to keep methods and tokens accessible and secure. Let's look at
the global version.

## Modular Package Blueprints

Our package has two blueprints, `CandyStore` and `GumballMachine`.

### The `GumBallMachine` blueprint

The global `GumballMachine` remains the same as in previous examples.

- Some of it's methods are restricted to its owner in the `enable_method_auth!`
  macro at the top of the blueprint.

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

- The component's address is reserved for token access rules.

  ```rs
  pub fn instantiate_gumball_machine(price: Decimal) ->
      (Global<GumballMachine>, Bucket) {
          // reserve an address for the component
          let (address_reservation, component_address) =
              Runtime::allocate_component_address(
                  GumballMachine::blueprint_id()
              );
  ```

- An owner badge is created. This will later be stored in the `CandyStore`, so
  it can call restricted methods on the `GumballMachine`.

  ```rs
  let owner_badge = ...
  ```

- Mint roles are set using the components reserved address ensuring that only
  the `GumballMachine` can mint new tokens.

  ```rs
      .mint_roles(mint_roles! {
          minter => rule!(require(
              global_caller(component_address)
          ));
          minter_updater => rule!(deny_all);
      })
  ```

- Proof of the owner badge is made the required authorization for ownership and
  the address reservation is applied to the new component.

  ```rs
      .instantiate()
      .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
          owner_badge.resource_address()
      ))))
      .with_address(address_reservation)
      .globalize();
  ```

### The `CandyStore` blueprint

Our `CandyStore` has been simplified in comparison to the last example, by
removing the custom auth roles, candy and chocolate eggs. It now contains a
`GumballMachine`, but it does now have some new complexity as it needs to hold
the `GumballMachine` owner badge and pass proof of that ownership back to the
`GumballMachine` when calling it's restricted methods. This is done with the
`authorize_with_amount` method.

- The component state holds the `GumballMachine` and a `Vault` containing the
  `GumballMachine` owner badge.

  ```rs
  struct CandyStore {
      gumball_machine: Global<GumballMachine>,
      gumball_machine_owner_badges: Vault,
  }
  ```

- The gumball machine is instantiated as a part of the candy store's own
  instantiate function.

  ```rs
  let (gumball_machine, gumball_machine_owner_badge) =
      GumballMachine::instantiate_gumball_machine(
          gumball_price
      );
  ```

- To call the `GumballMachine`'s public methods we can simply call them on the
  `CandyStore`'s internal `gumball_machine`.

  ```rs
    pub fn buy_gumball(&mut self, payment: Bucket) -> (Bucket, Bucket) {
      self.gumball_machine.buy_gumball(payment)
    }
  ```

- To call a restricted method on the `GumballMachine` we need to pass a proof
  that we have it's owner badge by calling `authorize_with_amount` on the vault
  containing it.

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

> **Authorize with Amount**  
> `authorize_with_amount` is a Vault method allows us to use it's contents as a
> proof for a function call. The amount of tokens used as the proof is specified
> by the first argument. The second argument is a closure (anonymous function)
> that will be called with the proof. For non-fungibles, the equivalent method
> is `authorize_with_non_fungibles`.

## Using the Candy Store

The multi-blueprint package is set and used in the same way as our previous
single blueprint packages.

### Setup

1. First, clone the repository if you have not done so, and then change
   directory to this example.

   ```
   git clone https://github.com/radixdlt/official-examples.git

   cd official-examples/step-by-step/14-candy-store-modules
   ```

2. From the example's directory, run the setup script.

   On Linux or macOS:

   ```sh
   cd 14-candy-store-modules/
   source ./setup.sh
   ```

   On Windows:

   ```cmd
   cd 14-candy-store-modules/
   ./setup.bat
   ```

   This will reset the simulator, build the package, publish it to the simulator
   and export several useful useful values.

3. Instantiate the component by using the `instantiate_candy_store.rtm`
   manifest.

   You may wish to modify the gumball price in the manifest before running it.

   ```sh
   resim run manifests/instantiate_candy_store.rtm
   ```

   Note the number of `New Entities` created. You should be able to see both the
   new components there.

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

## Final Thoughts

All the `CandyStore` methods correspond to ones on `GumballMachine`. This makes
it little more than a wrapper for the `GumballMachine`. However, you can easily
imagine a more complex example where the candy store contains multiple gumball
machines, all instantiated from the same blueprint. It could even contain
multiple types of products again, with blueprints for each category of product
with similar properties. This type of modularity makes it easier to manage,
expand and upgrade packages even as they grow in complexity.
