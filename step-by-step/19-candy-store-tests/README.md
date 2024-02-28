# 19. Candy Store Tests

The last section introduced us to testing blueprints. It's now time to apply
those lessons to a more complex blueprint package; our familiar favourite, the
Candy Store. This will show us how to test larger packages with multiple
blueprints and methods.

We'll add tests to the version of the Candy Store and Gumball Machine blueprints
we created in the Candy Store with an Owned Gumball Machine section.

## Contents

- [Contents](#contents)
- [Testing the Candy Store Package](#testing-the-candy-store-package)
  - [Unit Testing the Gumball Machine Module](#unit-testing-the-gumball-machine-module)
  - [Integration Testing the Candy Store Module](#integration-testing-the-candy-store-module)
- [Using Candy Store Tests](#using-candy-store-tests)
- [Closing thoughts](#closing-thoughts)

## Testing the Candy Store Package

We can have multiple test files for a Scrypto package by placing them in the
`tests/` directory. We've done this with the separate modules of our package
which each have their own test files, `tests/candy_store.rs` and
`tests/gumball_machine.rs`.

To import the modules into their test files we need to add the `pub` keyword to
module exports in `/src/lib.rs`. This makes them accessible for testing:

```rs
pub mod candy_store;
pub mod gumball_machine;
```

The two modules in the package are nicely separated in ways that make a
different testing approach preferable for each. The `gumball_machine` module is
a good candidate for unit testing, while the `candy_store` module is better for
integration testing.

### Unit Testing the Gumball Machine Module

Most of the logic of our package is in the `gumball_machine` module. To test it
we use the Scrypto-Test framework to write unit tests.

First we add the `scrypto-test`, `radix-engine-interface` crates to the
`Cargo.toml` file `dev-dependencies`, as well as `candy-store` itself with the
`test` feature:

```toml
[dev-dependencies]
# --snip--
scrypto-test = { git = "https://github.com/radixdlt/radixdlt-scrypto", tag = "v1.1.1" }
radix-engine-interface = { git = "https://github.com/radixdlt/radixdlt-scrypto", tag = "v1.1.1" }
candy-store = { path = ".", features = ["test"] }
```

Then we add the required imports to `tests/gumball_machine.rs`:

```rs
use radix_engine_interface::prelude::*;
use scrypto::this_package;
use scrypto_test::prelude::*;

use candy_store::gumball_machine::test_bindings::*;
```

We can now write tests for the `gumball_machine` module. We'll start with a
helper function to arrange the test environment:

```rs
fn arrange_test_environment(
    price: Decimal,
) -> Result<(TestEnvironment, GumballMachine), RuntimeError> {
    let mut env = TestEnvironment::new();
    let package_address = Package::compile_and_publish(this_package!(), &mut env)?;

    let (gumball_machine, _owner_badge) =
        GumballMachine::instantiate_global(price, package_address, &mut env)?;

    Ok((env, gumball_machine))
}
```

This function creates a new `TestEnvironment`, compiles and publishes the
package, and instantiates a `GumballMachine` with the given price. It exits to
stop us needing to repeat code as we can use this as part or all of the setup
for the tests that follow.

The first test checks that the `GumballMachine` can be instantiated, by just
running our helper function. If it doesn't panic, the test passes.

```rs
#[test]
fn can_instantiate_gumball_machine() -> Result<(), RuntimeError> {
    let (_env, _gumball_machine) = arrange_test_environment(dec!(1))?;
    Ok(())
}
```

After this, the rest of our unit tests follow a similar pattern. With clear
arrange, act, and assert sections. For example, we can test that the
`GumballMachine` can be refilled:

```rs
#[test]
fn can_refill_gumball_machine() -> Result<(), RuntimeError> {
    // Arrange
    let (mut env, mut gumball_machine) = arrange_test_environment(dec!(10))?;

    let payment = BucketFactory::create_fungible_bucket(XRD, dec!(100), Mock, &mut env)?;
    let _ = gumball_machine.buy_gumball(payment, &mut env)?;
    env.disable_auth_module();

    // Act
    gumball_machine.refill_gumball_machine(&mut env)?;

    // Assert
    let status = gumball_machine.get_status(&mut env)?;
    assert_eq!(status.amount, dec!(100));

    Ok(())
}
```

Here we;

1. arrange the environment and gumball machine with our helper function, the
   `BucketFactory` to create a payment bucket and buy a gumball,
2. act by refilling the gumball machine,
3. and assert that the amount of gumballs in the machine is now back to 100.

> [`BucketFactory`](https://docs.radixdlt.com/docs/scrypto-test#creation-of-buckets-and-proofs)
> part of the `scrypto-test` framework, used to create buckets for testing.

### Integration Testing the Candy Store Module

As the `candy_store` module is the globalised part of the package, any
transaction manifests addressing the package will interact with a Candy Store
component (or blueprint when instantiating a component) first. As it's the entry
point for all method calls it's much better suited to integration testing than
the `gumball_machine` module.

The Scrypto Test Runner works by generating and running transaction manifests,
so it too is ideal for integration testing. To use it in the
`tests/candy_store.rs` file we first need to add the `scrypto-unit` and
`radix-engine-interface` crates to the `Cargo.toml` file `dev-dependencies`:

```toml
[dev-dependencies]
# --snip---
scrypto-unit = { git = "https://github.com/radixdlt/radixdlt-scrypto", tag = "v1.1.1" }
# --snip---
radix-engine-interface = { git = "https://github.com/radixdlt/radixdlt-scrypto", tag = "v1.1.1" }
```

Then we add the required imports to `tests/candy_store.rs`:

```rs
use radix_engine_interface::prelude::*;
use scrypto::this_package;
use scrypto_test::prelude::*;
use scrypto_unit::*;
```

We can then start to write our test with a `TestRunner` (simulated ledger for
testing) created with `TestRunnerBuilder`:

```rs
    let mut test_runner = TestRunnerBuilder::new().build();
```

Any test we write will need to emulate the way we interact with the Candy Store
on the Radix network, publishing the package, using it to instantiate a
`CandyStore` and then calling methods on them with transaction manifests. you
can see some of this demonstrated at the start of the test:

```rs
// Create a new account with associated public and private keys.
    let (public_key, _private_key, account_address) = test_runner.new_allocated_account();

    // Compile and publish the CandyStore blueprint package.
    let package_address = test_runner.compile_and_publish(this_package!());

    // ----------------- Instantiate the CandyStore -----------------
    // Build a manifest to instantiate the CandyStore, including initial price argument.
    let gumball_price = dec!(10);
    let manifest = ManifestBuilder::new()
        .call_function(
            package_address,
            "CandyStore",
            "instantiate_candy_store",
            manifest_args!(gumball_price),
        )
        .deposit_batch(account_address)
        .build();

    // Execute the manifest, obtaining a transaction receipt.
    let receipt = test_runner.execute_manifest_ignoring_fee(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );

    println!(
        "instantiate_candy_store Transaction Receipt:\n{}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    // Assert that the transaction commits successfully
    // If the transaction is unsuccessful, the test will fail here
    receipt.expect_commit_success();
```

The
[TestRunner](https://radixdlt.github.io/radixdlt-scrypto/scrypto_unit/struct.TestRunner.html)
has various methods to arrange and execute in the simulated ledger, like
`new_allocated_account()` and `execute_manifest_ignoring_fee()` while the
[ManifestBuilder](https://docs.radixdlt.com/docs/rust-manifest-builder) is used
to create transaction manifests inside a rust file. These allow us to test a
variety of interactions with the Candy Store and be sure that none will fail.
Have a closer look at the file to see more of how this works.

## Using Candy Store Tests

Testing is simple with the `scrypto test` command. This will run all the tests
in the package. Try it for yourself:

```sh
cd step-by-step/19-candy-store-tests
cargo test
```

The `println!` statements in the `candy_store` tests will then only output if
there are any test failures.To see this working try modifying a test to fail,
for example by commenting out a manifest building line, e.g.

```rs
   // .create_proof_from_account_of_amount(account_address, owner_badge, dec!(1))
```

Then run the tests again:

```sh
scrypto test
```

## Closing thoughts

This section shows how to test a Scrypto package with both unit and integration
tests, but there's room for more thorough testing even here. We could add more
tests to cover more edge cases and check for where we should see more failed
transactions rather than just successful ones. There is also a lot of repeated
code in these tests, which is useful to see how they work but could be reduced
with helper functions. `scrypto-unit` and `scrypto-test` are powerful tools for
testing Scrypto packages, and it's worth exploring the [documentation]
(https://docs.radixdlt.com/docs/scrypto-test) more to see what else it can do.
