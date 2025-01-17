use scrypto::prelude::*;

// Simple examples of non-fungible data structures using the standard displayed fields
#[derive(ScryptoSbor, NonFungibleData)]
pub struct OwnerBadgeData {
    name: String,
    description: String,
    key_image_url: Url,
}
#[derive(ScryptoSbor, NonFungibleData)]
pub struct NonFungibleTokenData {
    name: String,
    description: String,
    key_image_url: Url,
}

#[blueprint]
mod proof_example {
    enable_method_auth! {
        methods {
            create_proofs_from_vaults => PUBLIC;
            create_proofs_from_buckets => PUBLIC;
            create_proof_from_proof => PUBLIC;
            transfer_proof_to_and_from_auth_zone => PUBLIC;
            confirm_non_fungible_id_in_auth_zone => restrict_to: [OWNER];
            get_non_fungible_data_from_auth_zone => restrict_to: [OWNER];
            check_proof_by_intent => PUBLIC;
            get_non_fungible_data_from_proof => PUBLIC;
            get_local_id_from_proof => PUBLIC;
            get_and_unwrap_local_id_from_proof => PUBLIC;
            call_restricted_method_on_resource => PUBLIC;
            call_restricted_method_on_other_component => PUBLIC;
        }
    }

    // import the OtherComponent package from the ledger using its package address
    extern_blueprint! {
        // Example package address
        "package_sim1pk3cmat8st4ja2ms8mjqy2e9ptk8y6cx40v4qnfrkgnxcp2krkpr92",
        OtherComponent {
            // Blueprint Functions
            fn restricted_method(&self);
        }
    }

    struct ProofExamples {
        owner_badge_address: ResourceAddress,
        fungible_token_manager: FungibleResourceManager,
        fungible_vault: FungibleVault,
        non_fungible_vault: NonFungibleVault,
        other_component: Global<OtherComponent>,
    }

    impl ProofExamples {
        pub fn new(
            owner_badge_address: ResourceAddress,
            other_component: Global<OtherComponent>,
        ) -> Global<ProofExamples> {
            let fungible_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(
                owner_badge_address
            ))))
            .mint_roles(mint_roles!(
                minter => OWNER;
                minter_updater => OWNER;
            ))
            .create_with_no_initial_supply();

            let non_fungible_token =
                ResourceBuilder::new_ruid_non_fungible::<NonFungibleTokenData>(OwnerRole::None)
                    .create_with_no_initial_supply();

            Self {
                owner_badge_address,
                fungible_token_manager: FungibleResourceManager::from(fungible_token.address()),
                fungible_vault: FungibleVault::new(fungible_token.address()),
                non_fungible_vault: NonFungibleVault::new(non_fungible_token.address()),
                other_component,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::Fixed(rule!(require(owner_badge_address))))
            .globalize()
        }

        // -------------------------- Creating Proofs --------------------------
        pub fn create_proofs_from_vaults(&self) -> (FungibleProof, NonFungibleProof) {
            // Make an IndexSet of one NonFungibleLocalId for our NonFungibleProofs
            let non_fungible_local_ids =
                indexset![NonFungibleLocalId::string("example_id").unwrap()];

            // Proofs from Vaults
            let proof_1: FungibleProof = self.fungible_vault.create_proof_of_amount(1);
            let proof_2: NonFungibleProof = self
                .non_fungible_vault
                .create_proof_of_non_fungibles(&non_fungible_local_ids);

            (proof_1, proof_2)
        }

        pub fn create_proofs_from_buckets(
            &self,
            bucket: Bucket,
            fungible_bucket: FungibleBucket,
            non_fungible_bucket: NonFungibleBucket,
        ) -> (
            Proof,
            FungibleProof,
            FungibleProof,
            NonFungibleProof,
            NonFungibleProof,
            Bucket,
            FungibleBucket,
            NonFungibleBucket,
        ) {
            // Make an IndexSet of one NonFungibleLocalId for our NonFungibleProofs
            let non_fungible_local_ids =
                indexset![NonFungibleLocalId::string("example_id").unwrap()];

            // Proofs from Buckets
            let proof_3: Proof = bucket.create_proof_of_all();
            let proof_4: FungibleProof = fungible_bucket.create_proof_of_all();
            let proof_5: FungibleProof = fungible_bucket.create_proof_of_amount(1);
            let proof_6: NonFungibleProof = non_fungible_bucket.create_proof_of_all();
            let proof_7: NonFungibleProof =
                non_fungible_bucket.create_proof_of_non_fungibles(&non_fungible_local_ids);

            (
                proof_3,
                proof_4,
                proof_5,
                proof_6,
                proof_7,
                bucket,
                fungible_bucket,
                non_fungible_bucket,
            )
        }

        pub fn create_proof_from_proof(&self, proof_1: Proof) {
            let _proof_2 = proof_1.clone();
        }

        pub fn transfer_proof_to_and_from_auth_zone(&self, proof: Proof) {
            LocalAuthZone::push(proof);
            let _proof = LocalAuthZone::pop().unwrap();
        }

        // ---------- Verify Your Method Caller Precisely With The AuthZone -----------
        pub fn confirm_non_fungible_id_in_auth_zone(
            &self,
            badge_local_id: NonFungibleLocalId,
        ) -> NonFungibleGlobalId {
            // Assemble Proof global_id from known resource address and local ID provided
            let global_id =
                NonFungibleGlobalId::new(self.owner_badge_address, badge_local_id.clone());

            // Check that a Proof of the non-fungible resource is in the AuthZone
            Runtime::assert_access_rule(rule!(require(global_id.clone())));

            // Return the global_id
            global_id
        }

        pub fn get_non_fungible_data_from_auth_zone(
            &self,
            badge_local_id: NonFungibleLocalId,
        ) -> OwnerBadgeData {
            // Assemble Proof global_id from known resource address and local ID provided
            let global_id =
                NonFungibleGlobalId::new(self.owner_badge_address, badge_local_id.clone());

            // Check that a Proof of the non-fungible resource is in the AuthZone
            Runtime::assert_access_rule(rule!(require(global_id)));

            // Get the data from the non-fungible resource
            let non_fungible_data = NonFungibleResourceManager::from(self.owner_badge_address)
                .get_non_fungible_data::<OwnerBadgeData>(&badge_local_id);

            // Return the non-fungible data
            non_fungible_data
        }

        // --------- Verify Your Method Caller Precisely With A Proof By Intent ---------
        pub fn check_proof_by_intent(&self, proof: Proof) -> CheckedProof {
            // Check the proof resource address matches the owner badge address. If it does not,
            // the method call will fail.
            proof.check(self.owner_badge_address)
        }

        pub fn get_non_fungible_data_from_proof(&self, proof: NonFungibleProof) -> OwnerBadgeData {
            // Check the proof and retrieve the non-fungible data
            let non_fungible_data = proof
                // Check the proof
                .check(self.owner_badge_address)
                // Retrieve data
                .non_fungible::<OwnerBadgeData>()
                .data();

            // Return the non-fungible data
            non_fungible_data
        }

        pub fn get_local_id_from_proof(&self, proof: NonFungibleProof) -> NonFungibleLocalId {
            // Check the proof then retrieve and return the non-fungible local ID
            let non_fungible_id = proof
                // Check the proof
                .check(self.owner_badge_address)
                // Retrieve non-fungible local ID
                .non_fungible_local_id();

            // Return the non-fungible local ID
            non_fungible_id
        }

        pub fn get_and_unwrap_local_id_from_proof(&self, proof: NonFungibleProof) -> String {
            // Check the proof and retrieve the non-fungible local ID
            let non_fungible_id_string = match proof
                // Check the proof
                .check(self.owner_badge_address)
                // Retrieve non-fungible local ID
                .non_fungible_local_id()
            {
                // If it has a String type local ID return it as a String
                NonFungibleLocalId::String(local_id) => local_id.value().to_owned(),
                // This example assumes the local ID is known to be a String, so other possibilities
                // are unreachable
                _ => unreachable!("All admin badges have String local IDs"),
            };

            // Return the non-fungible local ID as a string
            non_fungible_id_string
        }

        // ------------------ Calling AuthZone Protected Methods ---------------
        pub fn call_restricted_method_on_resource(
            &self,
            owner_badge_proof: NonFungibleProof,
        ) -> FungibleBucket {
            owner_badge_proof.authorize(|| {
                // Call the restricted mint method on the resource, authorized by the
                // owner badge proof
                self.fungible_token_manager.mint(1)
            })
        }

        pub fn call_restricted_method_on_other_component(
            &mut self,
            other_component_owner_badge_proof: FungibleProof,
        ) {
            other_component_owner_badge_proof.authorize(|| {
                // Call the restricted method on the other component, authorized by the
                // component owner's badge proof
                self.other_component.restricted_method()
            })
        }
    }
}
