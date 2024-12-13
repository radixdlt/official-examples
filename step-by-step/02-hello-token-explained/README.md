# 2. Hello Token, Explained

After using the Hello package in the last example I'm sure you'll want to better
understand what you just did. Here we give you that explanation and hopefully
you'll get a taste of how asset-oriented programming with Scrypto for DeFi
works.

_**For more detailed explanations of this and the following examples we
recommend going to
[Learning Step-by-Step section of the Radix docs](https://docs.radixdlt.com/docs/learning-step-by-step).**
Complete lessons for each example can be found there._

The Scrypto package in this example is the exact same as the previous one. What
follows is an explanation of the package.

The Hello package is a simple one blueprint package. The component it creates
gives out a Hello Token whenever it's `free_token` method is called.

- [File Structure](#file-structure)
- [Blueprint](#blueprint)
  - [1. Defining Component Structure](#1-defining-component-structure)
  - [2. Instantiating a Component from a Package](#2-instantiating-a-component-from-a-package)
    - [Resource Creation](#resource-creation)
    - [Vaults \& Buckets](#vaults--buckets)
    - [Instantiation](#instantiation)
  - [3. Component Methods](#3-component-methods)
- [License](#license)

## File Structure

For every new Scrypto package, there are mainly three files/folders:

- The `src` folder, which contains all the source code;
- The `test` folder, which contains all the test code;
- The `Cargo.toml` file which specifies all the dependencies and compile
  configurations.

For now we will only look at the `src` folder.

## Blueprint

In the `src` folder, there is a `lib.rs` file, which contains our blueprint
code.

> A _blueprint_ is the code that defines a single working part of our
> application. When it is instantiated it becomes an interactive _component_
> running in the Radix Engine.
>
> One or multiple blueprints grouped together, ready to be instantiated are a
> _package_.

In this example, we have only one blueprint in the package called `Hello`, which
defines:

1. The state structure of all `Hello` components (a single _vault_, which is a
   container for _resources_);
2. A function `instantiate_hello`, which instantiates a `Hello` component;
3. A method `free_token`, which returns a bucket of `HelloToken` (from the
   component vault) when invoked.

```rust
use scrypto::prelude::*;

#[blueprint]
mod hello {
    // 1. The state structure of all `Hello` components
    struct Hello {
        sample_vault: FungibleVault,
    }

    impl Hello {
        // 2. A function which instantiates a `Hello` component
        pub fn instantiate_hello() -> Global<Hello> {
            // --snip--
        }

        // 3. A method which returns a bucket of `HelloToken` when invoked
        pub fn free_token(&mut self) -> FungibleBucket {
            // --snip--
        }
    }
}
```

### 1. Defining Component Structure

```rust
    struct Hello {
        // A vault to store resources
        sample_vault: FungibleVault,
    }
```

Every blueprint must start with a `struct` defining what is stored where in the
component. The `struct` has the same name as the blueprint.

### 2. Instantiating a Component from a Package

```rust
    pub fn instantiate_hello() -> Global<Hello> {
        // --snip--
    }
```

#### Resource Creation

When a `Hello` component is instantiated, so is an initial supply of
`HelloToken` resources.

> In Scrypto, assets like tokens, NFTs, and more are not implemented as
> blueprints or components. Instead, they are types of _resources_ that are
> configured and requested directly from the system.

To create a new resource, we:

1. Use the `ResourceBuilder` to create a new fungible resource;
2. Specify the number of decimal places the resource can be divided into;
3. Specifying the resource metadata, like name and symbol;
4. Specifying the initial supply of the resource.

```rust
// 1. Define a new fungible resource with ResourceBuilder
let my_bucket = ResourceBuilder::new_fungible(OwnerRole::None)
    // 2. Set the max number of decimal places to 18
    .divisibility(DIVISIBILITY_MAXIMUM)
    // 3. Set the metadata
    .metadata(metadata!{
        init {
            "name" => "Hello Token", locked;
            "symbol" => "HT", locked;
        }
    })
    // 4. Create the initial supply
    .mint_initial_supply(1000);

```

#### Vaults & Buckets

> A _bucket_ is a temporary container for resources.

When a resource is created, it is in a bucket. As buckets only exist to move
resources around we have to:

5. Put the new resources in a _vault_.

```rust
    // 5. Put the new resources in a vault
    sample_vault: FungibleVault::with_bucket(my_bucket),
```

> A _vault_ is a permanent container for resources and where resources must be
> stored.

#### Instantiation

Finally, we can instantiate a `Hello` component by:

6. Calling `instantiate`
7. Making the component available in the network by calling `globalize`

```rust
Self {
        sample_vault: FungibleVault::with_bucket(my_bucket),
    }
    // 6. Instantiate the component
    .instantiate()
    // 7. Make the component available in the network
    .prepare_to_globalize(OwnerRole::None)
    .globalize()
```

### 3. Component Methods

```rust
    pub fn free_token(&mut self) -> Bucket {
            // --snip--
    }
```

Methods can only be called on instantiated components. `Hello` components have
one method, `free_token`, which returns a bucket of one `HelloToken` when
invoked, ready to transfer to another component or account.

```rust
    // Return 1 HelloToken, taken from the vault
    self.sample_vault.take(1)
```

The lack of `;` at the end of the line means that the result of the last
expression is returned from the method. This also applies to the `instantiate`
function.

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
