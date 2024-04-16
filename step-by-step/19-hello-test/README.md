# 19. Hello Test

It's time to focus on testing. Thorough testing is essential to ensuring the
proper predictable working of any Scrypto packages we write. You may have
noticed an example of this in the Hello template used in several previous
sections. It has a `test/` directory that holds a `lib.rs` file containing two
test functions. These demonstrate two ways to test the Hello blueprint and the
two main ways to test any Scrypto package.

- [Running the Tests](#running-the-tests)

## Running the Tests

Running test is simple. All we need to do is run `scrypto test` in the package
root:

```sh
cd step-by-step/18-hello-test
scrypto test
```

This will build the package and run all the tests in the `test` directory, so we
can have more than one test file and it doesn't have to be called `lib.rs`.
