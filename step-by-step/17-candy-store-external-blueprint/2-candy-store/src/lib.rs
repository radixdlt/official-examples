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
     "package_sim1pk3cmat8st4ja2ms8mjqy2e9ptk8y6cx40v4qnfrkgnxcp2krkpr92",
        GumballMachine {
            // Blueprint Functions
            fn instantiate_global(price: Decimal) -> ( Global<GumballMachine>, FungibleBucket);
            fn instantiate_owned(price: Decimal, component_address: ComponentAddress) -> Owned<GumballMachine>;

            // Component Methods
            fn get_status(&self) -> Status;
            fn buy_gumball(&mut self, payment: FungibleBucket) -> (FungibleBucket, FungibleBucket);
            fn set_price(&mut self, price: Decimal);
            fn withdraw_earnings(&mut self) -> FungibleBucket;
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
        gumball_machine: Owned<GumballMachine>,
    }

    impl CandyStore {
        // create a new CandyStore component with a price for gumballs
        pub fn instantiate_candy_store(
            gumball_price: Decimal,
        ) -> (Global<CandyStore>, FungibleBucket) {
            // reserve an address for the component
            let (address_reservation, component_address) =
                Runtime::allocate_component_address(CandyStore::blueprint_id());

            let owner_badge = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "Candy Store Owner Badge", locked;
                    }
                ))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1);

            // instantiate a new owned gumball machine component
            let gumball_machine =
                Blueprint::<GumballMachine>::instantiate_owned(gumball_price, component_address);

            // populate a CandyStore struct and instantiate a new component
            let component = Self {
                // use shorthand syntax to assign the gumball_machine component to the gumball_machine field
                gumball_machine,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
                owner_badge.resource_address()
            ))))
            .with_address(address_reservation)
            .globalize();

            // return the component, plus the owner badge
            (component, owner_badge)
        }

        pub fn get_prices(&self) -> Decimal {
            // get the current price of gumballs by calling the gumball machine's price getter
            let status = self.gumball_machine.get_status();
            info!(
                "\nGumball price is {} XRD.\nThere are {} gumballs left.",
                status.price, status.amount
            );
            // return the current price
            status.price
        }

        pub fn buy_gumball(&mut self, payment: FungibleBucket) -> (FungibleBucket, FungibleBucket) {
            // buy a gumball
            self.gumball_machine.buy_gumball(payment)
        }

        pub fn set_gumball_price(&mut self, new_price: Decimal) {
            // set the gumball machine's price. requires owner badge
            self.gumball_machine.set_price(new_price);
        }

        pub fn restock_store(&mut self) {
            // refill the gumball machine. requires owner badge
            self.gumball_machine.refill_gumball_machine();
        }

        pub fn withdraw_earnings(&mut self) -> FungibleBucket {
            // withdraw all the XRD collected from the gumball machine. requires owner badge
            self.gumball_machine.withdraw_earnings()
        }
    }
}
