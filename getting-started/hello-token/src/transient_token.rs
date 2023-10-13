use scrypto::prelude::*;

#[blueprint]
mod transient_token {
    struct TransientToken {
        transient_token: ResourceManager,
    }
    impl TransientToken {
        pub fn instantiate_transient_token() -> (Global<TransientToken>, Bucket) {
            let (address_reservation, component_address) =
                Runtime::allocate_component_address(TransientToken::blueprint_id());

            let admin_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(init{"name"=>"admin badge", locked;}))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1)
                .into();
            // Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
            let transient_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(
                admin_badge.resource_address()
            ))))
            .metadata(metadata! {
                init {
                    "name" => "Transient Token", locked;
                    "symbol" => "TT", locked;
                }
            })
            .mint_roles(mint_roles! {
                minter => rule!(require(admin_badge.resource_address()));
                minter_updater => rule!(deny_all);
            })
            .deposit_roles(deposit_roles! {
                depositor => rule!(deny_all);
                depositor_updater => rule!(deny_all);
            })
            .burn_roles(burn_roles! {
                burner => rule!(require(global_caller(component_address)));
                burner_updater => rule!(deny_all);
            })
            .create_with_no_initial_supply();

            let component = Self {
                transient_token: transient_token,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .with_address(address_reservation)
            .globalize();

            return (component, admin_badge);
        }
    }
}
