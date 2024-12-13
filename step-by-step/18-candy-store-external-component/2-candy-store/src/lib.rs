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
            fn instantiate_global(price: Decimal) -> ( Global<GumballMachine>, FungibleBucket);

            // Component Methods
            fn buy_gumball(&mut self, payment: FungibleBucket) -> (FungibleBucket, FungibleBucket);
            fn get_status(&self) -> Status;
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
        gumball_machine_owner_badge: FungibleVault,
        gumball_machine_address: Global<GumballMachine>,
    }

    impl CandyStore {
        // create a new CandyStore component with a gumball machine badge and address
        pub fn instantiate_candy_store(
            gumball_machine_badge: FungibleBucket,
            gumball_machine_address: Global<GumballMachine>,
        ) -> (Global<CandyStore>, FungibleBucket) {
            let owner_badge = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "Candy Store Owner Badge", locked;
                    }
                ))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1);

            // populate a CandyStore struct and instantiate a new component
            let component = Self {
                gumball_machine_owner_badge: FungibleVault::with_bucket(gumball_machine_badge),
                // use shorthand syntax to assign the gumball_machine_address String to the gumball_machine_address field
                gumball_machine_address,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
                owner_badge.resource_address()
            ))))
            .globalize();

            // return the component, plus the component owner badge
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

        pub fn buy_gumball(&mut self, payment: FungibleBucket) -> (FungibleBucket, FungibleBucket) {
            // buy a gumball
            self.gumball_machine_address.buy_gumball(payment)
        }

        pub fn set_gumball_price(&mut self, new_price: Decimal) {
            // create a proof of the gumball machine owner badge
            let gumball_machine_owner_badge_proof =
                self.gumball_machine_owner_badge.create_proof_of_amount(1);
            // place the proof on the local auth zone. methods called within this method are authorized by it
            LocalAuthZone::push(gumball_machine_owner_badge_proof);
            // set the gumball machine's price, authorized by the gumball machine owner badge proof
            self.gumball_machine_address.set_price(new_price);
        }

        pub fn restock_store(&mut self) {
            // create a proof of the gumball machine owner badge
            let gumball_machine_owner_badge_proof =
                self.gumball_machine_owner_badge.create_proof_of_amount(1);
            // place the proof on the local auth zone. methods called within this method are authorized by it
            LocalAuthZone::push(gumball_machine_owner_badge_proof);
            // refill the gumball machine, authorized by the gumball machine owner badge proof
            self.gumball_machine_address.refill_gumball_machine();
        }

        pub fn withdraw_earnings(&mut self) -> FungibleBucket {
            // create a proof of the gumball machine owner badge
            let gumball_machine_owner_badge_proof =
                self.gumball_machine_owner_badge.create_proof_of_amount(1);
            // place the proof on the local auth zone. methods called within this method are authorized by it
            LocalAuthZone::push(gumball_machine_owner_badge_proof);
            //  withdraw all the XRD collected from the gumball machine, authorized by the gumball machine owner badge proof
            self.gumball_machine_address.withdraw_earnings()
        }
    }
}
