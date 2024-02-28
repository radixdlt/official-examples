# 18 Hello Test

It's time to focus on testing. Thorough testing is essential to ensuring the
proper predictable working of any Scrypto packages we write. You may have
noticed an example of this in the Hello template used in several previous
sections. It has a `test/` directory that holds a `lib.rs` file containing two
test functions. These demonstrate two ways to test the Hello blueprint and the
two main ways to test any Scrypto package. Here we'll explain both and show you
how to run the tests.

## Contents

- [Contents](#contents)
- [Testing Blueprints and Modules](#testing-blueprints-and-modules)
  - [TestRunner](#testrunner)
  - [Scrypto-Test](#scrypto-test)
- [Running the Tests](#running-the-tests)

## Testing Blueprints and Modules

There are two ways to test blueprints and modules, the TestRunner and
Scrypto-Test. The TestRunner is better suited for integration testing, while
Scrypto-Test is more ideal for unit testing.

### TestRunner

The
[TestRunner](https://radixdlt.github.io/radixdlt-scrypto/scrypto_unit/struct.TestRunner.html)
is an in-memory ledger simulator. Tests interact with the simulator as a user
submitting transactions to the network would. This is great for integration and
end-to-end testing.

To test with the TestRunner, we import `scrypto::this_package` and the currently
poorly named `scrypto_unit` at the top of our test file:

```rs
use scrypto::this_package;
use scrypto_unit::*;
```

To make this import work, we need to add `scrypto_unit` to the `Cargo.toml`
file:

```toml Cargo.toml
[dev-dependencies]
# --snip--
scrypto-unit = { git = "https://github.com/radixdlt/radixdlt-scrypto", tag = "v1.1.1" }
```

Where we also need to make sure the `test` feature is enabled:

```toml Cargo.toml
[features]
default = []
test = []
```

Then we can create our ledger simulator environment. In our case that's back in
the `test/lib.rs` file inside the `test_hello` function:

```rs
#[test]
fn test_hello() {
    // Setup the environment
    let mut test_runner = TestRunnerBuilder::new().build();
```

In that environment, we create an account:

```rs
    // Create an account
    let (public_key, _private_key, account) = test_runner.new_allocated_account();
```

We then need the package available in the environment:

```rs
    // Publish package
    let package_address = test_runner.compile_and_publish(this_package!());
```

Once we have the package we can test the instantiate function. This is done by:

1. Building a manifest:

   ```rs
       let manifest = ManifestBuilder::new()
           .call_function(
               package_address,
               "Hello",
               "instantiate_hello",
               manifest_args!(),
           )
           .build();
   ```

2. Submitting the manifest to the ledger:

   ```rs
       let receipt = test_runner.execute_manifest_ignoring_fee(
           manifest,
           vec![NonFungibleGlobalId::from_public_key(&public_key)],
       );
   ```

3. Checking the manifest receipt to see if it successfully instantiated a new
   component, then storing the component address for later use if it did:

   ```rs
       let component = receipt.expect_commit(true).new_component_addresses()[0];
   ```

With the component in our test environment and its address, we can now test the
`free_token` method. A similar 3 steps are followed, but with a different
manifest:

1. Build a manifest:

   ```rs
    let manifest = ManifestBuilder::new()
        .call_method(component, "free_token", manifest_args!())
        .call_method(
            account,
            "deposit_batch",
            manifest_args!(ManifestExpression::EntireWorktop),
        )
        .build();
   ```

2. Submit the manifest to the ledger:

   ```rs
    let receipt = test_runner.execute_manifest_ignoring_fee(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );
   ```

3. Check the manifest receipt to see if it was successful:

   ```rs
    receipt.expect_commit_success();
   ```

We do not need to check the return value of the `free_token` method as we are
testing the ledger interaction, not the logic of the method. If the method
returns an error, the test will fail. Testing the logic of the method is more
easily done with Scrypto-Test.

### Scrypto-Test

The
[Scrypto-Test](https://radixdlt.github.io/radixdlt-scrypto/scrypto_test/index.html)
framework is different to the Test Runner. Instead of interacting with the
ledger as a user, tests interact as native blueprints. This removes the need for
transaction manifests and opens up some extra options unavailable with
TestRunner. These differences make it better suited for unit testing the logic
of a blueprint.

Testing our Hello blueprint with Scrypto-Test is done with the
`scrypto::this_package` macro, `scrypto_test::prelude` and
`hello_test::test_bindings` modules:

```rs
use scrypto::this_package;
use scrypto_test::prelude::*;
use hello_test::test_bindings::*;
```

`scrypto-test` and `hello-test` also need to be added to the `Cargo.toml` file's
dev-dependencies, `hello-test` with the `test` feature enabled:

```toml Cargo.toml
[dev-dependencies]
# --snip--
scrypto-test = { git = "https://github.com/radixdlt/radixdlt-scrypto", tag = "v1.1.1" }
# --snip--
hello-test = { path = ".", features = ["test"] }
```

Adding `hello-test` itself allows us to use its auto generated `test_bindings`
module. Without adding the test feature, the module will not be generated.

The `test` feature also needs to be enabled for Scrypto-Test, the same way it
was for the TestRunner:

```toml Cargo.toml
[features]
default = []
test = []
```

We'll use the Scrypto-Test framework to test the `free_token` method output with
a AAA testing pattern: Arrange, Act, Assert.

In our `test/lib.rs` file, with the modules imported we create a new environment
and arrange the conditions for our test by publishing our package and
instantiating a new Hello component from it - no manifest required:

```rs
// Arrange
    let mut env = TestEnvironment::new();
    let package_address = Package::compile_and_publish(this_package!(), &mut env)?;

    let mut hello = Hello::instantiate_hello(package_address, &mut env)?;
```

This allows us to then perform the action we want to test by calling the method:

```rs
    // Act
    let bucket = hello.free_token(&mut env)?;
```

The method returns whatever it would on ledger; in this case a bucket. We can
now check the amount of tokens in the bucket is what we expect with an
assertion:

```rs
    // Assert
    let amount = bucket.amount(&mut env)?;
    assert_eq!(amount, dec!("1"));
```

If the assertion is incorrect the test will panic and the test will fail. If the
assertion is correct we can return an `Ok` (containing an empty value):

```rs
    Ok(())
```

If you're wondering about the new syntax, Scrypto-Test uses
[`Result`](https://doc.rust-lang.org/std/result/) return types for error
handling, so we can use the `?` operator to propagate errors up the call stack,
and OK to return the function values. In our case we're just returning `Ok(())`,
with an empty value, to indicate the test passed and propagated errors are
handled by the test framework.

## Running the Tests

Running test is simple. All we need to do is run `scrypto test` in the package
root:

```sh
cd step-by-step/18-hello-test
scrypto test
```

This will build the package and run all the tests in the `test` directory, so we
can have more than one test file and it doesn't have to be called `lib.rs`.
