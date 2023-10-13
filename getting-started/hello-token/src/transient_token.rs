use scrypto::prelude::*;

#[blueprint]
mod transient_token {
    struct TransientToken {
        transient_token: Vault,
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
            .deposit_roles(deposit_roles! {
                depositor => rule!(deny_all);
                depositor_updater => rule!(deny_all);
            })
            .burn_roles(burn_roles! {
                burner => rule!(require(global_caller(component_address)));
                burner_updater => rule!(deny_all);
            })
            .mint_initial_supply(1000)
            .into();

            let component = Self {
                transient_token: Vault::with_bucket(transient_token),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .with_address(address_reservation)
            .globalize();

            return (component, admin_badge);
        }
    }
}
