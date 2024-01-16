use scrypto::prelude::*;

#[blueprint]
mod freezable_token {
    struct FreezableToken {
        freezer_token: Vault,
    }
    impl FreezableToken {
        pub fn instantiate_freezable_token() -> (Global<FreezableToken>, Bucket) {
            let admin_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(init{"name"=>"admin badge", locked;}))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1)
                .into();
            // Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
            let freezer_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(
                admin_badge.resource_address()
            ))))
            .metadata(metadata! {
                init {
                    "name" => "Freezer Token", locked;
                    "symbol" => "FZT", locked;
                }
            })
            .freeze_roles(freeze_roles! {
                freezer => rule!(require(
                admin_badge.resource_address()
            ));
                freezer_updater => rule!(deny_all);
            })
            .mint_initial_supply(1000)
            .into();

            let component = Self {
                freezer_token: Vault::with_bucket(freezer_token),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize();

            return (component, admin_badge);
        }
    }
}
