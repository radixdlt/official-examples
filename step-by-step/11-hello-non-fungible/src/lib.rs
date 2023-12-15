use scrypto::prelude::*;

#[derive(ScryptoSbor, NonFungibleData)]
pub struct Greeting {
    // Define what data will be stored in the blueprint's HelloNonFungible tokens
    text: String,
}

#[blueprint]
mod hello {
    struct Hello {
        // Define what resources and data will be managed by Hello components
        sample_vault: Vault,
    }

    impl Hello {
        // Implement the functions and methods which will manage those resources and data

        // This is a function, and can be called directly on the blueprint once deployed
        pub fn instantiate_hello() -> Global<Hello> {
            // Create a new resource called "HelloNonFungible" with a fixed supply of 5, each with their own non-fungible data, and put that supply into a bucket
            let my_bucket: Bucket = ResourceBuilder::new_ruid_non_fungible(OwnerRole::None)
                .metadata(metadata! {
                    init {
                        "name" => "HelloNonFungible", locked;
                        "symbol" => "HNF", locked;
                    }
                })
                .mint_initial_supply(
                    // The data for each of the 5 non-fungible tokens is defined here
                    [
                        Greeting {
                            text: "Hello".into(),
                        },
                        Greeting {
                            text: "Pleased to meet you".into(),
                        },
                        Greeting {
                            text: "Welcome to Radix".into(),
                        },
                        Greeting {
                            text: "Salutations".into(),
                        },
                        Greeting {
                            text: "Hi there".into(),
                        },
                    ],
                )
                .into();

            // Instantiate a Hello component, populating its vault with our supply of the 5 HelloNonFungible tokens
            Self {
                sample_vault: Vault::with_bucket(my_bucket),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        // This is a method, because it needs a reference to self.  Methods can only be called on components
        pub fn free_token(&mut self) -> Bucket {
            info!(
                "My balance is: {} HelloNonFungible tokens. Now giving away a token!",
                self.sample_vault.amount()
            );
            // If the semi-colon is omitted on the last line, the last value seen is automatically returned
            // In this case, a bucket containing 1 HelloNonFungible is returned
            self.sample_vault.take(1)
        }
    }
}
