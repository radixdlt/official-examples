# 8. A Ledger Ready Gumball Machine

In the previous example we allowed our gumball machine to mint its own gumballs.
The blueprint still isn't quite ready for us to publish on the ledger though.
Currently anyone can mint gumballs, so let's look at restricting it to the
component it's methods. We'll also add an icon for the gumball token, so it's
easily identifiable in wallets and explorers.

- [Virtual Badges](#virtual-badges)
  - [Address Reservation](#address-reservation)
  - [Restricting Mint Roles](#restricting-mint-roles)
- [Icons for Tokens](#icons-for-tokens)
- [Publishing the Gumball Machine](#publishing-the-gumball-machine)
  - [Prerequisites](#prerequisites)
  - [Creating a Radix Wallet Stokenet Account](#creating-a-radix-wallet-stokenet-account)
  - [Building the Package](#building-the-package)
  - [Deploy the package to Stokenet](#deploy-the-package-to-stokenet)
- [Using the Gumball Machine on Stokenet](#using-the-gumball-machine-on-stokenet)
  - [Instantiate the Gumball Machine](#instantiate-the-gumball-machine)
  - [Using the Gumball Machine methods](#using-the-gumball-machine-methods)

## Virtual Badges

The Owner badge, like other badges we might make, is a resource. We make it the
required evidence of ownership in one of the instantiation steps. In some cases
it makes more sense to use a component's address instead of creating a badge.
This is known as the _Virtual Badge_ pattern.

> A component does not need to have its own badge to provide permission and
> perform authorized actions. Instead of a badge the component address can act
> as evidence to perform a action that requires permission. This is known as the
> _Virtual Badge_ pattern.

### Address Reservation

All components on the Radix ledger have a unique address assigned at
instantiation, but the gumball token is defined inside the instantiate function.
So we have access to the a component address inside the function before it's
complete, we need to reserve it. We do so right at the start of
`instantiate_gumball_machine`.

```rust
let (address_reservation, component_address) =
    Runtime::allocate_component_address(GumballMachine::blueprint_id());
```

This give us the `component_address` to use for the minter rule, and the
`address_reservation` to apply to the component in the last instantiation step.

### Restricting Mint Roles

We update the minter rule to now require the component's own address to mint new
gumballs. Only the component and therefore it's methods will be able to mint.

```rust
.mint_roles(mint_roles! {
    minter => rule!(require(global_caller(component_address)));
    minter_updater => rule!(deny_all);
})
```

The `address_reservation` is applied in the last instantiation step, giving our
component the address we reserved and same address as used to mint new gumballs.

```rust
    .instantiate()
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    // Apply the address reservation
    .with_address(address_reservation)
    .globalize();
```

## Icons for Tokens

We now have one last thing to do before we publish the gumball machine. Outside
of `resim` the token will be displayed in a variety of ways in dapps and
wallets. So these can be more visually appealing we need to add an icon for the
gumball token. This is done with just an extra metadata field called `icon_url`.

```rust
   "icon_url" => Url::of("https://assets.radixdlt.com/images/dApps/gumball_club/gumball-token-yellow-256x256.png"), locked;
```

URLs and strings are not treated the same in the Radix ledger and so we need to
use the `Url` type. The `locked` keyword, as before, is used to prevent the icon
URL from being changed after the component is instantiated.

We now have a blueprint we can publish on the ledger.

## Publishing the Gumball Machine

We will deploy the gumball machine to the Stokenet testnet.

### Prerequisites

1. The Radix Wallet
   [more info here](https://docs.radixdlt.com/docs/radix-wallet-overview)
2. The Radix Wallet Connector extension. Download from the
   [chrome store](https://chromewebstore.google.com/detail/radix-wallet-connector/bfeplaecgkoeckiidkgkmlllfbaeplgm)
   or [download from github](https://github.com/radixdlt/connector-extension/)

### Creating a Radix Wallet Stokenet Account

1. If you haven't already, open the Radix Wallet on your phone and run through
   first time set up.
2. You will need to connect to the test network in Settings > App Settings >
   Gateways > Stokenet (testnet) Gateway.
3. Create a new account.
4. Get some test token for transaction fees by clicking on;
   - the account name
   - the three dots "...",
   - "Dev Preferences",
   - the "Get XRD Text Tokens" button.

### Building the Package

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/08-ledger-ready-gumball-machine
    ```

2.  From the same directory as the `Cargo.toml` file, build the code:
    `scrypto build`
3.  Two important files (`refillable_gumball_machine.rpd` and
    `refillable_gumball_machine.wasm`) will be generated in
    `/target/wasm32-unknown-unknown/release/`. You will need them for the next
    step.

### Deploy the package to Stokenet

1. Go to the
   [Stokenet Developer Console Website](https://stokenet-console.radixdlt.com/deploy-package)
2. Connect the Wallet Via the Connect Button
3. Navigate to Deploy Package
4. Upload both `refillable_gumball_machine.rpd` and
   `refillable_gumball_machine.wasm`
5. In the "Owner role" and "Owner role updatable" dropdowns select "None", as we
   do not have any package owner related functionality yet.  
   _This is the owner of the package, not the `GumballMachine` components that
   will be instantiated from it. The owner badge we mint as a part of component
   instantiation is for the component._
6. Click on "Send to the Radix Wallet"
7. Go to your wallet where it should be asking you to approve the transaction
8. On the wallet "Slide to Sign" the deployment transaction.
9. Once the transaction completes, the deployed _package address_ should then be
   displayed back in the Stokenet Console. Make a note of it for the next step.

## Using the Gumball Machine on Stokenet

Once the package is deployed to the network we interact with it and it's
components using transaction manifests. The first of these manifests will
instantiate a gumball machine component.

### Instantiate the Gumball Machine

1. Go to the
   [Send Raw Transaction section of the Stokenet Developer Console](https://stokenet-console.radixdlt.com/transaction-manifest)
2. Connect the Wallet Via the Connect Button if you haven't already
3. Copy the `instantiate_gumball_machine manifest` from
   `./manifests/instantiate_gumball_machine.rtm` into the text box on the
   console.
4. Replace the `_PACKAGE_ADDRESS_` with the address of the deployed package,
   leaving the outside quote marks in place.
5. Replace the `_GUMBALL_PRICE_` with your desired decimal value, leaving the
   quotes.
6. Replace the `_ACCOUNT_ADDRESS_` with the address of your wallet account,
   leaving the quotes. The address can be copied from the connect button - Click
   the button to open a dropdown, then click the copy button next to the
   address.
7. Click on "Send to the Radix Wallet"
8. Go to your wallet where it should be asking you to approve the transaction
   and "Slide to Sign" the transaction.
9. Once submitted, back in the console a tx ID displayed. Click on this to see
   the transaction summary. The component address, GUM token address and OWN
   badge address will be displayed in the transaction summary. Make a note of
   them for later use.

### Using the Gumball Machine methods

Now that the gumball machine is instantiated we can use it's methods. There are
manifests for each of the methods in the `./manifests` directory. To try them
out use them in the the
[Send Raw Transaction section of the Stokenet Developer Console](https://stokenet-console.radixdlt.com/transaction-manifest)
as we have for the instantiation. You will need to add the appropriate addresses
and input arguments for each manifest.
