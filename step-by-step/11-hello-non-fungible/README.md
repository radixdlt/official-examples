# 11. Hello Non-Fungible

So far this series of examples has only focused on fungible resources. This will
be our first look at non-fungibles.

By making some small changes to our starting Hello example, we can create it
with a non-fungible instead of a fungible resource. That resource can then be
obtained with the same `free_token` method as we used in the original example.

- [Non-Fungible Resources](#non-fungible-resources)
- [What's Changed](#whats-changed)
- [Running the Example](#running-the-example)

## Non-Fungible Resources

Non-fungibles, like fungible resources, are native to Radix, so they behave as
real world objects and have other behaviours guaranteed by the Radix Engine.

What makes them unique is that they are unique, meaning that non-fungible tokens
minted from the same resource manager are not interchangeable. This is in
contrast to fungible resources, where any token from the same resource manager
is identical and interchangeable. If fungible resources are like money,
non-fungibles are like collectibles.

Non-fungibles have several different properties to fungibles on Radix. Firstly
they have a unique identifier, their `NonFungibleLocalID`. This can be an
integer, string, byte array or RUID (Radix Unique Identifier). This is used to
identify the non-fungible within the resource address and must be of the same
type throughout the same resource address. e.g. a non-fungible collection of
playing cards could all have integer local IDs, or all have string local IDs,
but not some with integers and some with strings.

In our example we'll use RUIDs, as the Radix Engine will generate them for us.
For the other types, we would need to specify them ourselves (see below).

Non-fungibles also have `NonFungibleData`, which can take the form of any data
you require. It's structure will need to be defined outside of the blueprint,
like ours is. In our case the non-fungible data structure definition is just
above the blueprint code.

## What's Changed

To make the Hello example non-fungible, we need to make a few small changes.

Firstly, we need to add our `NonFungibleData` structure in the form of
the`Greeting` struct.

```rust
#[derive(ScryptoSbor, NonFungibleData)]
pub struct Greeting {
    text: String,
}
```

Then we need to change our `HelloToken` resource to be non-fungible by changing
the `ResourceBuilder` method used from `new_fungible` to
`new_ruid_non_fungible`.

```rust
  let my_bucket: Bucket = ResourceBuilder::new_ruid_non_fungible(OwnerRole::None)
```

> **Note:** Non-fungible `ResourceBuilder` methods include
> `new_ruid_non_fungible`, `new_integer_non_fungible`,`new_string_non_fungible`
> and `new_bytes_non_fungible`.

For clarity we also change the metadata so we have a new name an symbol for our
resource.

```rust
  .metadata(metadata! {
    init {
      "name" => "HelloNonFungible", locked;
      "symbol" => "HNF", locked;
    }
})
```

Finally, we need to mint our initial supply of non-fungibles. This is done by
calling the `mint_initial_supply` method on our resource builder, but it now
takes an array of `NonFungibleData` in the form described in our `Greeting`
struct.

```rust
  .mint_initial_supply(
    [
      Greeting { text: "Hello".into(), },
      Greeting { text: "Pleased to meet you".into(), },
      Greeting { text: "Welcome to Radix".into(), },
      Greeting { text: "Salutations".into(), },
      Greeting { text: "Hi there".into() },
    ]
  )
```

> **Note:** A `NonFungibleLocalID` must be specified for a **non-RUID**
> non-fungible (integer, string or bytes) when minting. To do this state the
> local ID before the `NonFungibleData` in a tuple. e.g. if we create our
> non-fungibles with integer local IDs like so:
>
> ```rust
> let my_bucket: Bucket = ResourceBuilder::new_integer_non_fungible(OwnerRole::None)
> ```
>
> Then we would mint like this:
>
> ```rust
>   .mint_initial_supply([
>     (
>       // NonFungibleLocalID
>       IntegerNonFungibleLocalId::new(1),
>       // NonFungibleData
>       Greeting {
>         text: "Hello world!".into(),
>       },
>     ),
>   ])
> ```

## Running the Example

Running the example is much the same as the running the original Hello example:

0.  First, (optionally) reset the simulator and create a new account.

    ```sh
    resim reset

    resim new-account

    resim show <ACCOUNT_ADDRESS>
    ```

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```sh
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/11-hello-non-fungible
    ```

2.  Then, publish the package and save the package address.

    ```sh
    resim publish .
    ```

3.  Use the package address to instantiate the component.

    ```sh
    resim call-function <PACKAGE_ADDRESS> Hello instantiate_hello
    ```

4.  This is a good opportunity to check the state of the component. You should
    see the `HNF` non-fungibles with the initial supply of 5, each with a
    different local id.

    ```sh
    resim show <COMPONENT_ADDRESS>
    ```

5.  Now we can transfer one of the non-fungibles to our account.

    ```sh
    resim call-method <COMPONENT_ADDRESS> free_token
    ```

6.  Finally, we can check the state of our account to see that we now have the
    non-fungible.

        ```sh
        resim show <ACCOUNT_ADDRESS>
        ```

Unfortunately resim doesn't yet support showing individual non-fungibles and the
data on them. You will eventually be able to examine non-fungibles using their
global resource addresses (resource address followed by the local id) like so:

```sh
# Not yet supported
resim show <RESOURCE_ADDRESS>:<NON_FUNGIBLE_LOCAL_ID>
```
