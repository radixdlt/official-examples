use scrypto::prelude::*;

#[derive(ScryptoSbor, NonFungibleData)]
pub struct MyData {
    name: String,
    description: String,
    #[mutable]
    mutable_field: String,
    // Add any other custom data fields here
}

#[blueprint]
mod non_fungible_data_examples {
    struct NonFungibleDataExamples {
        // Collection to store our non-fungibles
        collection_manager: NonFungibleResourceManager,
        // Owner badge
        owner_badge: FungibleVault,
    }

    impl NonFungibleDataExamples {
        pub fn new(owner_badge: FungibleBucket) -> Global<NonFungibleDataExamples> {
            let owner_badge_address = owner_badge.resource_address();

            // Create a new non-fungible collection with mutable supply
            let collection_manager = ResourceBuilder::new_string_non_fungible::<MyData>(
                OwnerRole::Fixed(rule!(require(owner_badge_address))),
            )
            .metadata(metadata! {
                init {
                    "name" => "Generic Non-Fungibles".to_owned(), locked;
                    "symbol" => "GNF".to_owned(), locked;
                }
            })
            .mint_roles(mint_roles! {
                minter => OWNER;
                minter_updater => OWNER;
            })
            .non_fungible_data_update_roles(non_fungible_data_update_roles! {
                non_fungible_data_updater => OWNER;
                non_fungible_data_updater_updater => OWNER;
            })
            .create_with_no_initial_supply();

            // Instantiate the component
            Self {
                collection_manager,
                owner_badge: FungibleVault::with_bucket(owner_badge),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::Fixed(rule!(require(owner_badge_address))))
            .globalize()
        }

        pub fn mint_non_fungible(
            &mut self,
            id: String,
            name: String,
            description: String,
        ) -> NonFungibleBucket {
            // Create non-fungible data
            let non_fungible_data = MyData {
                name,
                description,
                mutable_field: "original value".to_owned(),
            };

            // Mint a single non-fungible with the data
            self.collection_manager
                .mint_non_fungible(&NonFungibleLocalId::string(id).unwrap(), non_fungible_data)
        }

        pub fn get_non_fungible_data_by_id(&self, id: NonFungibleLocalId) -> MyData {
            self.collection_manager.get_non_fungible_data::<MyData>(&id)
        }

        pub fn get_non_fungible_id_and_data_from_bucket(
            &self,
            bucket: NonFungibleBucket,
        ) -> (NonFungibleLocalId, MyData) {
            let non_fungible_id = bucket.non_fungible_local_id();
            let non_fungible_data = bucket.non_fungible().data();

            (non_fungible_id, non_fungible_data)
        }

        pub fn get_multiple_non_fungible_ids_and_data_from_bucket(
            &self,
            bucket: NonFungibleBucket,
        ) -> Vec<(NonFungibleLocalId, MyData)> {
            // Get all non-fungible IDs from the bucket
            let non_fungible_ids = bucket.non_fungible_local_ids();
            // Get all the non-fungible data from the bucket
            let non_fungible_data: Vec<MyData> = bucket
                .non_fungibles()
                .iter()
                .map(|non_fungible| non_fungible.data())
                .collect();

            // For each ID, get the associated data and add to results
            non_fungible_ids
                .iter()
                .cloned()
                .zip(non_fungible_data)
                .collect()
        }

        pub fn update_non_fungible_data(
            &mut self,
            id: NonFungibleLocalId,
            new_field_value: String,
        ) {
            self.owner_badge.authorize_with_amount(1, || {
                self.collection_manager.update_non_fungible_data(
                    &id,
                    "mutable_field",
                    new_field_value,
                );
            });
        }

        // There is no way to read a single specified non-fungible data field by name yet. However
        // if you know its position in the non-fungible data struct (which you can find out with
        // a Gateway API call) you can use the following method.
        pub fn get_non_fungible_data_field(
            &self,
            field_index: usize,
            id: NonFungibleLocalId,
        ) -> ScryptoValue {
            // In this scenario, we don't know the type of the non-fungible data, so we choose
            // to read the data into a general type which can handle any data: ScryptoValue.
            // `get_non_fungible_data_field` is a higher-level API that does not support
            // ScryptoValue, so we use the `call` method directly instead.
            let structured_data: ScryptoValue = self.collection_manager.call(
                NON_FUNGIBLE_RESOURCE_MANAGER_GET_NON_FUNGIBLE_IDENT,
                &NonFungibleResourceManagerGetNonFungibleInput { id: id.clone() },
            );
            // Unwrap the tuple to get the fields
            let ScryptoValue::Tuple { fields } = structured_data else {
                panic!("NF data was not a tuple");
            };
            // Retrieve then return the field at the given index
            fields.get(field_index).unwrap().to_owned()
        }
    }
}
