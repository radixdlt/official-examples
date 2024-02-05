use scrypto::prelude::*;

#[derive(ScryptoSbor)]
pub struct Status {
    price: Decimal,
    amount: Decimal,
}

#[blueprint]
mod candy_store {
    extern_blueprint! {
        // import the GumballMachine package from the ledger using its package address
        "<YOUR_GUMBALL_MACHINE_PACKAGE_ADDRESS>",
        GumballMachine {
            // Blueprint Functions
            fn instantiate_owned(price: Decimal, component_address: ComponentAddress) -> Owned<GumballMachine>;
            fn instantiate_global(price: Decimal) -> ( Global<GumballMachine>, Bucket);

            // Component Methods
            fn buy_gumball(&mut self, payment: Bucket) -> (Bucket, Bucket);
            fn get_status(&self) -> Status;
            fn set_price(&mut self, price: Decimal);
            fn withdraw_earnings(&mut self) -> Bucket;
            fn refill_gumball_machine(&mut self);
        }
    }

    enable_method_auth! {
        // decide which methods are public and which are restricted to certain roles
        methods {
            buy_gumball=> PUBLIC;
            get_prices => PUBLIC;
            set_gumball_price => restrict_to: [OWNER];
            restock_store => restrict_to: [OWNER];
            withdraw_earnings => restrict_to: [OWNER];
        }
    }

    struct CandyStore {
        gumball_machine_owner_badge: Vault,
        gumball_machine_address: Global<GumballMachine>,
    }

    impl CandyStore {
        // create a new CandyStore component with a price for gumballs
        pub fn instantiate_candy_store(
            gumball_machine_badge: Bucket,
            gumball_machine_address: Global<GumballMachine>,
        ) -> (Global<CandyStore>, Bucket) {
            let owner_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "Candy Store Owner Badge", locked;
                    }
                ))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1)
                .into();

            // populate a CandyStore struct and instantiate a new component
            let component = Self {
                gumball_machine_owner_badge: Vault::with_bucket(gumball_machine_badge),
                // use shorthand syntax to assign the gumball_machine_address String to the gumball_machine_address field
                gumball_machine_address,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
                owner_badge.resource_address()
            ))))
            .globalize();

            // return the component, plus the owner badge
            (component, owner_badge)
        }

        pub fn get_prices(&self) -> Decimal {
            // get the current price of gumballs by calling the gumball machine's price getter
            let status = self.gumball_machine_address.get_status();
            info!(
                "\nGumball price is {} XRD.\nThere are {} gumballs left.",
                status.price, status.amount
            );
            // return the current price
            status.price
        }

        pub fn buy_gumball(&mut self, payment: Bucket) -> (Bucket, Bucket) {
            // buy a gumball
            self.gumball_machine_address.buy_gumball(payment)
        }

        pub fn set_gumball_price(&mut self, new_price: Decimal) {
            // use gumball machine owner badge to authorize the method and then set the gumball
            // machine's price. requires owner badge
            self.gumball_machine_owner_badge
                .as_fungible()
                .authorize_with_amount(1, || self.gumball_machine_address.set_price(new_price));
        }

        pub fn restock_store(&mut self) {
            // use gumball machine owner badge to authorize the method and then refill the gumball
            // machine. requires owner badge
            self.gumball_machine_owner_badge
                .as_fungible()
                .authorize_with_amount(1, || self.gumball_machine_address.refill_gumball_machine());
        }

        pub fn withdraw_earnings(&mut self) -> Bucket {
            // use gumball machine owner badge to authorize the method and then withdraw all the XRD
            // collected from the gumball machine. requires owner badge
            self.gumball_machine_owner_badge
                .as_fungible()
                .authorize_with_amount(1, || self.gumball_machine_address.withdraw_earnings())
        }
    }
}
