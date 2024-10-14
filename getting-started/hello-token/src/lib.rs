use scrypto::prelude::*;

#[blueprint]
mod hello_token {
    struct HelloToken {
        // Define what resources and data will be managed by Hello components
        hello_token_resource_manager: FungibleResourceManager,
    }

    impl HelloToken {
        // Implement the functions and methods which will manage those resources and data
        // This is a function, and can be called directly on the blueprint once deployed
        pub fn instantiate_hello_token() -> (Global<HelloToken>, FungibleBucket) {
            // Get the address of the dapp definition as an Address type
            let dapp_def_address = global_component!(
                Account,
                "account_tdx_2_12y7ue9sslrkpywpgqyu3nj8cut0uu5arpr7qyalz7y9j7j5q4ayhv6"
            )
            .address();

            // Create owner badge
            let owner_badge = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(init{"name"=>"Hello Token owner badge", locked;}))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1);

            // Create a new token called mintable token called "HelloToken"
            let hello_token = ResourceBuilder::new_fungible(OwnerRole::Updatable(rule!(require(owner_badge.resource_address()))))
                .divisibility(DIVISIBILITY_MAXIMUM)
                .metadata(metadata! {
                    init {
                        "name" => "HelloToken", locked;
                        "symbol" => "HT", locked;
                        "description" => "A simple token welcoming you to the Radix DLT network.", locked;
                        "icon_url" => Url::of("https://assets.radixdlt.com/icons/hello-token-164.png"), locked;
                        "dapp_definitions" => [dapp_def_address], locked;
                    }
                })
                .mint_roles(mint_roles! {
                    minter => rule!(allow_all);
                    minter_updater => rule!(deny_all);
                })
                .create_with_no_initial_supply();

            // Instantiate a Hello component and store the hello token resource manager
            let component = Self {
                hello_token_resource_manager: hello_token,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::Updatable(rule!(require(
                owner_badge.resource_address()
            ))))
            .metadata(metadata! {
                roles {
                metadata_locker => OWNER;
                metadata_locker_updater => OWNER;
                metadata_setter => OWNER;
                metadata_setter_updater => OWNER;
                },
                init {
                "Name" => "HelloToken Component", locked;
                "dapp_definition" => dapp_def_address, locked;
                }
            })
            .globalize();
            return (component, owner_badge);
        }

        // This is a method, because it needs a reference to self.  Methods can only be called on components
        pub fn free_token(&mut self) -> FungibleBucket {
            // Mint a hello token and return it to the caller
            self.hello_token_resource_manager.mint(1)
        }
    }
}
