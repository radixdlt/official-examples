# 19. Hello Test

It's time to focus on testing. Thorough testing is essential to ensuring the
proper predictable working of any Scrypto packages we write. You may have
noticed an example of this in the Hello template used in several previous
sections. It has a `test/` directory that holds a `lib.rs` file containing two
test functions. These demonstrate two ways to test the Hello blueprint and the
two main ways to test any Scrypto package.

- [Running the Tests](#running-the-tests)
- [License](#license)

## Running the Tests

Running test is simple. All we need to do is run `scrypto test` in the package
root:

```sh
cd step-by-step/18-hello-test
scrypto test
```

This will build the package and run all the tests in the `test` directory, so we
can have more than one test file and it doesn't have to be called `lib.rs`.

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
