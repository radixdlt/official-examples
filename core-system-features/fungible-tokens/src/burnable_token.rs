use scrypto::prelude::*;

#[blueprint]
mod burnable_token {
    struct BurnableToken {
        // Store a reference to the burnable token ResourceManager
        lazy_burn_token: ResourceManager,
        init_supply_tokens: Vault,
        init_supply_token_resource_manager: ResourceManager,
    }

    impl BurnableToken {
        // It is useful to consider that you can have multiple instantiate functions, each returning a different type of component
        pub fn instantiate_burnable_token() -> (Global<BurnableToken>, Bucket) {
            let (address_reservation, component_address) =
                Runtime::allocate_component_address(BurnableToken::blueprint_id());

            let burner_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(init{"name"=>"burner badge", locked;}))
                .burn_roles(burn_roles! (
                         burner => rule!(require(global_caller(component_address)));
                         burner_updater => OWNER;
                ))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1)
                .into();
            // Create a new burnable token called "lazy_burn_token," with a no initial supply, and store a reference to its ResourceManager
            let lazy_burn_token = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_NONE)
                .metadata(metadata! {
                    init {
                        "name" => "LazyBurnToken", locked;
                        "symbol" => "LBT", locked;
                    }
                })
                .burn_roles(burn_roles! {
                    burner => rule!(require(burner_badge.resource_address())); // this requires the caller to present a proof of the burner_badge
                    burner_updater => rule!(deny_all);
                })
                .mint_roles(mint_roles! { // #1
                    minter => rule!(allow_all); // #2
                    minter_updater => rule!(deny_all); // #3
                })
                .create_with_no_initial_supply();

            // Create a new token called "burn_init_supply_token," with an initial supply of 1000, and put that supply into a bucket
            let burn_init_supply_token: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_NONE)
                .metadata(metadata! {
                    init {
                        "name" => "BurnInitSupplyToken", locked;
                        "symbol" => "BIST", locked;
                    }
                })
                .burn_roles(burn_roles! {
                    burner => rule!(require(global_caller(component_address))); // this requires the caller to be the component
                    burner_updater => rule!(deny_all);
                })
                .mint_initial_supply(1000)
                .into();

            // Store a reference to the lazy_burn_token ResourceManager
            // Store a reference to the burn_init_supply_token ResourceManager
            // Store our initial supply of 1000 burn_init_supply_token in a Vault
            let component = Self {
                lazy_burn_token: lazy_burn_token,
                // Note the order below is important. The ResourceManager reference must be stored before moving the burn_init_supply_token into the Vault
                init_supply_token_resource_manager: burn_init_supply_token.resource_manager(),
                init_supply_tokens: Vault::with_bucket(burn_init_supply_token),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .with_address(address_reservation)
            .globalize();
            return (component, burner_badge);
        }

        // This is an example of a function to burn a burnable token and return a bucket containing the burned tokens
        // burning these tokens requires the burner badge
        // pub fn burn_lazy_tokens(&mut self) -> Bucket {
        //     let lazy_burned_tokens = self.lazy_burn_token.burn(10);
        //     lazy_burned_tokens
        // }

        // Note the difference between accessing the ResourceManager on the token with no supply vs with initial supply
        // in the Self {} block above yet at this level the ResourceManager is accessed the same way as the method above
        // burning these tokens uses the actor virtual badge so you would need to protect this method with an accessrule
        // pub fn burn_init_supply_tokens(&mut self) -> Bucket {
        //     let burned_tokens = self.init_supply_token_resource_manager.burn(100);
        //     burned_tokens
        // }
    }
}
