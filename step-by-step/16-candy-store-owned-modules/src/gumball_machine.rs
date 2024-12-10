use scrypto::prelude::*;

#[derive(ScryptoSbor)]
pub struct Status {
    pub price: Decimal,
    pub amount: Decimal,
}

#[blueprint]
mod gumball_machine {
    // An owned component's methods can only be accessed by the its parent component. We therefore don't need to restrict any methods in this blueprint, so there is no enable_method_auth! macro here.

    struct GumballMachine {
        gum_resource_manager: FungibleResourceManager,
        gumballs: FungibleVault,
        collected_xrd: FungibleVault,
        price: Decimal,
    }

    impl GumballMachine {
        // given a price in XRD, creates a ready-to-use gumball machine
        pub fn instantiate_gumball_machine(
            price: Decimal,
            parent_component_address: ComponentAddress,
        ) -> Owned<GumballMachine> {
            // create a new Gumball resource, with an initial supply of 100
            let bucket_of_gumballs = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_NONE)
                .metadata(metadata!(
                    init {
                        "name" => "Gumball", locked;
                        "symbol" => "GUM", locked;
                        "description" => "A delicious gumball", locked;
                        "icon_url" => Url::of("https://assets.radixdlt.com/icons/icon-gumball-pink.png"), locked;
                    }
                ))
                // adding minting rules allows the minting of more gumballs
                .mint_roles(mint_roles! {
                    minter => rule!(require(global_caller(parent_component_address)));
                    minter_updater => rule!(deny_all);
                })
                .mint_initial_supply(100);

            // populate a GumballMachine struct and instantiate a new component
            Self {
                gum_resource_manager: bucket_of_gumballs.resource_manager(),
                gumballs: FungibleVault::with_bucket(bucket_of_gumballs),
                collected_xrd: FungibleVault::new(XRD),
                price,
            }
            .instantiate()
        }

        pub fn buy_gumball(
            &mut self,
            mut payment: FungibleBucket,
        ) -> (FungibleBucket, FungibleBucket) {
            // take our price in XRD out of the payment
            // if the caller has sent too few, or sent something other than XRD, they'll get a runtime error
            let our_share = payment.take(self.price);
            self.collected_xrd.put(our_share);

            // we could have simplified the above into a single line, like so:
            // self.collected_xrd.put(payment.take(self.price));

            // return a tuple containing a gumball, plus whatever change is left on the input payment (if any)
            // if we're out of gumballs to give, we'll see a runtime error when we try to grab one
            (self.gumballs.take(1), payment)
        }

        pub fn get_status(&self) -> Status {
            Status {
                price: self.price,
                amount: self.gumballs.amount(),
            }
        }

        pub fn set_price(&mut self, price: Decimal) {
            self.price = price
        }

        pub fn withdraw_earnings(&mut self) -> FungibleBucket {
            // retrieve all the XRD collected by the gumball machine component.
            self.collected_xrd.take_all()
        }

        pub fn refill_gumball_machine(&mut self) {
            // mint enough gumball tokens to fill the gumball machine back up to 100.
            let gumball_amount = 100 - self.gumballs.amount();
            self.gumballs
                .put(self.gum_resource_manager.mint(gumball_amount));
        }
    }
}
