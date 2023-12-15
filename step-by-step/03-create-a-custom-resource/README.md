# 3. Create A Custom Resource

One of the greatest strengths of Scrypto as part of the Radix stack is it's use
of native assets or _resources_. Resources are the basis of all transaction on
the Radix network and have guaranteed behaviors that are provided by the system,
meaning they intuitively follow the same behaviour as real-world physical
objects. This example shows how to create and customise them.

- [Using `resim` to create a resource](#using-resim-to-create-a-resource)
- [Metadata](#metadata)
- [Customizing a Resource](#customizing-a-resource)
  - [Preparing the Blueprint](#preparing-the-blueprint)
  - [Using the Component](#using-the-component)
- [Multiple Components from One Blueprint](#multiple-components-from-one-blueprint)

## Using `resim` to create a resource

There are several commands in `resim` that can be used to create resources.
Let's try `new-token-fixed`.

> If you do not have your default account address saved, you can retrieve it
> with `resim show-config`

1. Check your current balances using your default account address and,

   ```

   resim show <ACCOUNT_ADDRESS>

   ```

   Make a note of the balances in `Owned Fungible Resources`.

2. Create a new token with a fixed supply of 100 with,

   ```
   `resim new-token-fixed 100`

   ```

   Make a note of the `Resource` address of the one `New Entity`.

3. Check your balances again. You should see that you now have 100 of the new
   resource. But our new token has no name or symbol. This is because it lacks
   metadata.

## Metadata

To make resources and components meaningful and understandable to humans, we
need some form of descriptive metadata, things like the token’s "name" and
"symbol".

This is set for our `Hello` blueprint in the in the `instantiate_hello` function
here

```rust
    .metadata(metadata! {
        init {
            "name" => "HelloToken", locked;
            "symbol" => "HT", locked;
        }
    })
```

With different values we can create a new token with a different name and
symbol.

> Metadata fields that have _url_ values must be of type `Url` and not `String`,
> as they are treated differently in by the Radix engine. To do this convert the
> `String` to a `Url` with **`Url::of()`**, e.g.
>
> ```
> "icon_url" => Url::of("https://example.url/icon.png"), locked;
> ```

## Customizing a Resource

### Preparing the Blueprint

The Hello blueprint can be updated to create resources with custom names and
symbols. To do this we:

- Update the `instantiate_hello` function to take a `name` and `symbol` as
  arguments.

  ```rust
      pub fn instantiate_hello(name: String, symbol: String) -> Global<Hello> {
          // stripped
      }
  ```

- Update the `ResourceBuilder` to use the new arguments.

  ```rust
  let my_bucket: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
               .divisibility(DIVISIBILITY_MAXIMUM)
               .metadata(metadata! {
                   init {
                       "name" => name, locked;
                       "symbol" => symbol, locked;
                   }
               })
               .mint_initial_supply(1000)
               .into();
  ```

### Using the Component

With our new blueprint, we can now create publish the package and create
components that produce resources with custom names and symbols.

1. Clone the repository if you have not done so, and then change directory to
   this example.

   ```
   git clone https://github.com/radixdlt/official-examples.git

   cd official-examples/step-by-step/03-create-a-custom-resource
   ```

2. Publish the new package. First make sure you are in the correct directory.
   Then,

   ```
   resim publish .
   ```

   Save the package address.

3. Instantiate a new component with a custom name and symbol.

   ```
   resim call-function <PACKAGE_ADDRESS> Hello instantiate_hello "My Token" "MT"
   ```

   Save the `Component` and `Resource` addresses printed in the `New Entities`
   section of the output.

4. View the new resource metadata with,

   ```
   resim show <RESOURCE_ADDRESS>
   ```

   You should see the new name and symbol in `Metadata` section.

## Multiple Components from One Blueprint

Now that we have parameterized our blueprint, we can instantiate multiple
components from it that produce different resources.

5. Instantiate a second `Hello` component with a different token name and symbol

   ```
   resim call-function <PACKAGE_ADDRESS> Hello instantiate_hello "New Token" "NT"
   ```

   Again, save the component and resource addresses in `New Entities` section of
   the output. You may choose to inspect the metadata of the new resource too.

6. Send one of the new `NT` tokens to our account.

   ```
   resim call-method <NEW_COMPONENT_ADDRESS> free_token
   ```

7. Send one of the previous `MT` tokens to our account.

   ```
    resim call-method <FIRST_COMPONENT_ADDRESS> free_token
   ```

8. Check the account balances again.

   ```
   resim show <ACCOUNT_ADDRESS>
   ```

   You should see that you now have 1 of each of the new tokens in the
   `Owned Fungible Resources` section.

We have successfully created two different resources from two different
components from the same blueprint.
