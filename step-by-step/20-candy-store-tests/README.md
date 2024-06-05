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
- [License](#license)

## Using Candy Store Tests

Testing is simple with the `scrypto test` command. This will run all the tests
in the package. Try it for yourself:

```sh
cd step-by-step/20-candy-store-tests
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

Depending on your code editor/IDE, you may also be able to run test from inline
buttons or context menus. Look for a "Run Test" or "Debug Test" option at the
top of the test file and/or with the individual test functions.

## License

The Radix Official Examples code is released under Radix Modified MIT License.

    Copyright 2024 Radix Publishing Ltd

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software for non-production informational and educational purposes without
    restriction, including without limitation the rights to use, copy, modify,
    merge, publish, distribute, sublicense, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    This notice shall be included in all copies or substantial portions of the
    Software.

    THE SOFTWARE HAS BEEN CREATED AND IS PROVIDED FOR NON-PRODUCTION, INFORMATIONAL
    AND EDUCATIONAL PURPOSES ONLY.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE, ERROR-FREE PERFORMANCE AND NONINFRINGEMENT. IN NO
    EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES,
    COSTS OR OTHER LIABILITY OF ANY NATURE WHATSOEVER, WHETHER IN AN ACTION OF
    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE, MISUSE OR OTHER DEALINGS IN THE SOFTWARE. THE AUTHORS SHALL
    OWE NO DUTY OF CARE OR FIDUCIARY DUTIES TO USERS OF THE SOFTWARE.
