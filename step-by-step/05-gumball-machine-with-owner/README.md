# 5. Gumball Machine with an Owner

This example builds on top of the previous Gumball Machine example. In this one
we add an owner to the gumball machine. Once we have an owner we can provided a
way to actually retrieve the collected XRD! This can be done by adding a
withdrawal method that's protected by an owner badge, which ensures that only
the possessor of the badge is able to perform the withdrawal. While we're at it,
we'll also add a method to change the price of the gumballs.

- [Ownership and Authorization](#ownership-and-authorization)
  - [Badges](#badges)
  - [New Methods](#new-methods)
- [Using the Gumball Machine as an Owner](#using-the-gumball-machine-as-an-owner)
  - [Setup](#setup)
  - [Usage](#usage)

## Ownership and Authorization

Each component on the radix ledger must have an owner (though it may be set to
none). Proof of that ownership can be required for any method called on the
component.

We use the `enable_method_auth!` macro at the top of our blueprint code to
decide which methods require proof of ownership are which are public.
`restrict_to: [OWNER]` means that the method requires proof of ownership.

```rust
`enable_method_auth!` {
        methods {
            buy_gumball => PUBLIC;
            get_price => PUBLIC;
            set_price => restrict_to: [OWNER];
            withdraw_earnings => restrict_to: [OWNER];
        }
    }
```

### Badges

Evidence of ownership is achieved with a _Badge_. The Badge is any normal
resource (fungible or non-fungible) who's possession shows that the holder is
the owner of a component. Using a badge to prove ownership makes it possible to
transfer ownership between accounts.

In our case we use a fungible resource:

```rust
let owner_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
              .metadata(metadata!(init{
                  "name" => "GumballMachine Owner Badge", locked;
                  "symbol" => "OWN", locked;
              }))
              .divisibility(DIVISIBILITY_NONE)
              .mint_initial_supply(1)
              .into();
```

It's indivisible and has a fixed supply of 1, so there can only be one owner.

The `owner_badge` token is then made into the evidence of ownership when the
component is instantiated:

```rust
    .instantiate()
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    .globalize();
```

The instantiated component and the `owner_badge` are then returned from the
function in a tuple:

```rust
            (component, owner_badge)
```

Now each time a method restricted to the owner is called on the component, the
caller must show possession of the `owner_badge`.

### New Methods

We've added two new methods to the gumball machine:

- `set_price` - Takes a `Decimal` value, like the instantiate function, and
  updates the gumball price.

  ```rust
    pub fn set_price(&mut self, price: Decimal) {
        self.price = price
    }
  ```

- `withdraw_earnings` - Takes no arguments and returns a `Bucket` of XRD all the
  collected XRD in the gumball machine.

  ```rust
    pub fn withdraw_earnings(&mut self) -> Bucket {
        self.collected_xrd.take_all()
    }
  ```

## Using the Gumball Machine as an Owner

### Setup

0.  First, (optionally) reset the simulator and create a new account.

    ```
    resim reset

    resim new-account

    resim show <ACCOUNT_ADDRESS>
    ```

1.  Then, clone the repository if you have not done so, and change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/05-gumball-machine-with-owner
    ```

2.  Next, publish the package and save the package address.

    ```
    resim publish .
    ```

3.  Use the package address to instantiate the gumball machine, choosing a price
    for the gumballs.

    ```
    resim call-function <PACKAGE_ADDRESS> GumballMachine instantiate_gumball_machine <PRICE>
    ```

    The owner badge is created automatically when the gumball machine is
    instantiated. The badge will be in your account.

4.  Inspect your account looking at the `Owned Fungible Resources` section.

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

    You should see the badge listed with symbol `OWN`. Make a note of the
    resource address for use later.

### Usage

1.  Start by buying a gumball.

    ```
    resim call-method <COMPONENT_ADDRESS> buy_gumball <XRD_RESOURCE_ADDRESS>:<AMOUNT>
    ```

    _Where the xrd address is
    `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3`_

    This will return a gumball and the change to your account.

2.  Update the price of the gumball. This will fail without proof of ownership.

    ```
    resim call-method <COMPONENT_ADDRESS> set_price <NEW_PRICE>
    ```

3.  Try again presenting proof of ownership, the owner badge.

    ```
    resim call-method <COMPONENT_ADDRESS> set_price <NEW_PRICE> --proofs <OWNER_BADGE_ADDRESS>:1
    ```

    > To see the transaction manifest for presenting this proof, add
    > `--manifest manifest.rtm` flag to the command and view the generated file.

4.  Check the updated price.

    ```
    resim call-method <COMPONENT_ADDRESS> get_price
    ```

    You should see the new price in the `Outputs` section of the response.

5.  Buy another gumball at the new price.

    ```
    resim call-method <COMPONENT_ADDRESS> buy_gumball <XRD_RESOURCE_ADDRESS>:<AMOUNT>
    ```

6.  Check the gumball machine to see the earnings it's built up and the number
    of gumballs left.

    ```
    resim show <COMPONENT_ADDRESS>
    ```

    As the owner, you will want to collect your earnings and refill the machine.

7.  First let's withdraw the earnings, again presenting our proof of ownership.

    ```
    resim call-method <COMPONENT_ADDRESS> withdraw_earnings --proofs <OWNER_BADGE_ADDRESS>:1
    ```

8.  Now if you check your account balance you will see that you've collected the
    earnings.

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

We've successfully used the gumball machine and collected our earnings.
Collecting our earning can only be done with the owner badge in our account.
