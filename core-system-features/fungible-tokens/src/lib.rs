use scrypto::prelude::*;

mod burnable_token;
mod freezable_token;
mod mintable_token;
mod recallable_token;
mod soulbound_token;
mod the_works;
mod transient_token;

#[blueprint]
mod hello_token {
    struct HelloToken {
        // Define a Vault to hold our HelloToken supply
        hello_token_vault: Vault,
    }

    impl HelloToken {
        pub fn instantiate_hello_token() -> Global<HelloToken> {
            // Create a new token called "HelloToken," with a fixed supply of 1000, and put that supply into a bucket
            let hello_token_bucket: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_MAXIMUM)
                .metadata(metadata! {
                    init {
                        "name" => "HelloToken", locked;
                        "symbol" => "HT", locked;
                    }
                })
                .mint_initial_supply(1000)
                .into();

            // Instantiate a HelloToken component, populating its Vault with our supply of 1000 HelloToken
            Self {
                hello_token_vault: Vault::with_bucket(hello_token_bucket),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        // This is a method, because it needs a reference to self.  Methods can only be called on components
        pub fn free_token(&mut self) -> Bucket {
            info!(
                "My balance is: {} HelloToken. Now giving away a token!",
                self.hello_token_vault.amount()
            );
            // If the semi-colon is omitted on the last line, the last value seen is automatically returned
            // In this case, a bucket containing 1 HelloToken is returned
            self.hello_token_vault.take(1)
        }
    }
}
