use scrypto::prelude::*;

#[blueprint]
mod hello_token {
    struct HelloToken {
        // Define what resources and data will be managed by Hello components
        hello_token_resource_manager: ResourceManager,
    }

    impl HelloToken {
        // Implement the functions and methods which will manage those resources and data

        // This is a function, and can be called directly on the blueprint once deployed
        pub fn instantiate_hello_token() -> Global<HelloToken> {
            // Create a new token called "HelloToken," with a fixed supply of 1000, and put that supply into a bucket
            let hello_token = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_MAXIMUM)
                .metadata(metadata! {
                    init {
                        "name" => "HelloToken", locked;
                        "symbol" => "HT", locked;
                        "description" => "A simple token welcoming you to the Radix DLT network.", locked;
                        "icon_url" => Url::of("https://assets.radixdlt.com/icons/hello-token-164.png"), locked;
                    }
                })
                .mint_roles(mint_roles! {
                    minter => rule!(allow_all);
                    minter_updater => rule!(deny_all);
                })
                .create_with_no_initial_supply();

            // Instantiate a Hello component, populating its vault with our supply of 1000 HelloToken
            Self {
                hello_token_resource_manager: hello_token,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        // This is a method, because it needs a reference to self.  Methods can only be called on components
        pub fn free_token(&mut self) -> Bucket {
            // Mint a hello token and return it to the caller
            self.hello_token_resource_manager.mint(1)
        }
    }
}
