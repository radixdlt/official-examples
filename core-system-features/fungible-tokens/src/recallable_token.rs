use scrypto::prelude::*;

#[blueprint]
mod recallable_token {
    struct RecallableToken {
        recall_token: Vault,
    }
    impl RecallableToken {
        pub fn instantiate_recallable_token() -> (Global<RecallableToken>, Bucket) {
            let admin_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(init{"name"=>"admin badge", locked;}))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1)
                .into();
            // Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
            let recall_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(
                admin_badge.resource_address()
            ))))
            .metadata(metadata! {
                init {
                    "name" => "Recall Token", locked;
                    "symbol" => "RCT", locked;
                }
            })
            .recall_roles(recall_roles! {
                recaller => rule!(allow_all);
                recaller_updater => rule!(deny_all);
            })
            .mint_initial_supply(1000)
            .into();

            let component = Self {
                recall_token: Vault::with_bucket(recall_token),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize();

            return (component, admin_badge);
        }
    }
}
