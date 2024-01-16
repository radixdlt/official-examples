use scrypto::prelude::*;

#[blueprint]
mod soulbound_token {
    struct SoulboundToken {
        soulbound_token: Vault,
    }
    impl SoulboundToken {
        pub fn instantiate_soulbound_token() -> (Global<SoulboundToken>, Bucket) {
            let admin_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(init{"name"=>"admin badge", locked;}))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1)
                .into();
            // Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
            let soulbound_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(
                admin_badge.resource_address()
            ))))
            .metadata(metadata! {
                init {
                    "name" => "Soulbound Token", locked;
                    "symbol" => "SBT", locked;
                }
            })
            .withdraw_roles(withdraw_roles! {
                withdrawer => rule!(deny_all);
                withdrawer_updater => rule!(deny_all);
            })
            .mint_initial_supply(1000)
            .into();

            let component = Self {
                soulbound_token: Vault::with_bucket(soulbound_token),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize();

            return (component, admin_badge);
        }
    }
}
