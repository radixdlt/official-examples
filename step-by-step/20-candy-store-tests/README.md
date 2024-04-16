# 20. Candy Store Tests

The last example introduced us to testing blueprints. It's now time to apply
those lessons to a more complex blueprint package; our familiar favourite, the
Candy Store. This example shows us how to test larger packages with multiple
blueprints and methods.

We've added tests to the version of the Candy Store and Gumball Machine
blueprints created in the
[Candy Store with an Owned Gumball Machine](../16-candy-store-owned-modules)
section.

- [Using Candy Store Tests](#using-candy-store-tests)

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
