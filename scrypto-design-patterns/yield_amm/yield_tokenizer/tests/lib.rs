use scrypto_test::{prelude::*, utils::dump_manifest_to_file_system};

#[test]
fn instantiate() {
    TestEnvironment::instantiate();
}

#[test]
fn can_instantiate_yield_tokenizer() {
    let mut test_env = TestEnvironment::instantiate();

    let receipt = test_env.instantiate_yield_tokenizer();

    receipt.expect_commit_success();

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );
}

#[test]
fn tokenize_yield() {
    let mut test_environment = TestEnvironment::instantiate();
    test_environment.tokenize_yield().expect_commit_success();
}

#[test]
fn redeem() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.tokenize_yield().expect_commit_success();

    test_environment.redeem().expect_commit_success();
}

#[test]
fn can_redeem_from_pt_after_maturity() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.tokenize_yield().expect_commit_success();

    let date = UtcDateTime::new(2025, 03, 06, 0, 0, 0).ok().unwrap();

    test_environment.advance_date(date);

    test_environment.redeem_from_pt().expect_commit_success();
}

#[test]
fn cannot_redeem_from_pt_before_maturity() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.tokenize_yield().expect_commit_success();

    test_environment.redeem_from_pt().expect_commit_failure();
}

#[test]
fn cannot_tokenize_yield_after_maturity() {
    let mut test_environment = TestEnvironment::instantiate();

    let date = UtcDateTime::new(2025, 03, 06, 0, 0, 0).ok().unwrap();

    test_environment.advance_date(date);

    test_environment.tokenize_yield().expect_commit_failure();
}

#[derive(ScryptoSbor, ManifestSbor)]
pub enum Expiry {
    TwelveMonths,
    EighteenMonths,
    TwentyFourMonths,
}

pub struct Account {
    public_key: Secp256k1PublicKey,
    account_component: ComponentAddress,
}

pub struct TestEnvironment {
    ledger: DefaultLedgerSimulator,
    account: Account,
    tokenizer_component: ComponentAddress,
    lsu_resource_address: ResourceAddress,
    pt_resource: ResourceAddress,
    yt_resource: ResourceAddress,
    package_address: PackageAddress,
}

impl TestEnvironment {
    pub fn instantiate() -> Self {
        let validator_key = Secp256k1PrivateKey::from_u64(1u64).unwrap().public_key();

        // Setup the environment
        let mut ledger = LedgerSimulatorBuilder::new().without_kernel_trace().build();

        // Create an account
        let (public_key, _private_key, account_component) = ledger.new_allocated_account();

        let account = Account {
            public_key,
            account_component,
        };

        let validator_address = ledger.get_active_validator_with_key(&validator_key);
        let lsu_resource_address = ledger
            .get_active_validator_info_by_key(&validator_key)
            .stake_unit_resource;

        let manifest = ManifestBuilder::new()
            .lock_fee(account_component, dec!(10))
            .withdraw_from_account(account_component, XRD, dec!(1000))
            .take_all_from_worktop(XRD, "xrd")
            .call_method_with_name_lookup(validator_address, "stake", |lookup| {
                (lookup.bucket("xrd"),)
            })
            .deposit_entire_worktop(account_component)
            .build();

        ledger
            .execute_manifest(
                manifest,
                vec![NonFungibleGlobalId::from_public_key(&public_key)],
            )
            .expect_commit_success();

        // Publish package
        let package_address = ledger.compile_and_publish(this_package!());

        let expiry = Expiry::TwelveMonths;

        let manifest = ManifestBuilder::new()
            .lock_fee_from_faucet()
            .call_function(
                package_address,
                "YieldTokenizer",
                "instantiate_yield_tokenizer",
                manifest_args!(expiry, lsu_resource_address),
            )
            .build();

        let receipt = ledger.execute_manifest(
            manifest,
            vec![NonFungibleGlobalId::from_public_key(&public_key)],
        );

        let tokenizer_component = receipt.expect_commit(true).new_component_addresses()[0];
        let pt_resource = receipt.expect_commit(true).new_resource_addresses()[0];
        let yt_resource = receipt.expect_commit(true).new_resource_addresses()[1];

        Self {
            ledger,
            account,
            tokenizer_component,
            lsu_resource_address,
            pt_resource,
            yt_resource,
            package_address,
        }
    }

    pub fn instantiate_yield_tokenizer(&mut self) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .call_function(
                self.package_address,
                "YieldTokenizer",
                "instantiate_yield_tokenizer",
                manifest_args!(Expiry::TwelveMonths, self.lsu_resource_address),
            );

        self.execute_manifest(manifest.build(), "instantiate_yield_tokenizer")
    }

    pub fn advance_date(&mut self, date: UtcDateTime) {
        let date_ms = date.to_instant().seconds_since_unix_epoch * 1000;
        let receipt = self
            .ledger
            .advance_to_round_at_timestamp(Round::of(3), date_ms);
        receipt.expect_commit_success();
    }

    pub fn execute_manifest(
        &mut self,
        built_manifest: TransactionManifestV1,
        name: &str,
    ) -> TransactionReceiptV1 {
        dump_manifest_to_file_system(
            &built_manifest,
            "./transaction_manifest",
            Some(name),
            &NetworkDefinition::stokenet(),
        )
        .ok();

        let receipt = self.ledger.execute_manifest(
            built_manifest,
            vec![NonFungibleGlobalId::from_public_key(
                &self.account.public_key,
            )],
        );

        return receipt;
    }

    pub fn tokenize_yield(&mut self) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(
                self.account.account_component,
                self.lsu_resource_address,
                dec!(1000),
            )
            .take_all_from_worktop(self.lsu_resource_address, "LSU Bucket")
            .call_method_with_name_lookup(self.tokenizer_component, "tokenize_yield", |lookup| {
                (lookup.bucket("LSU Bucket"),)
            })
            .deposit_entire_worktop(self.account.account_component);

        self.execute_manifest(manifest.build(), "tokenize_yield")
    }

    pub fn redeem(&mut self) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(self.account.account_component, self.pt_resource, dec!(1000))
            .withdraw_from_account(self.account.account_component, self.yt_resource, dec!(1))
            .take_all_from_worktop(self.pt_resource, "PT Bucket")
            .take_all_from_worktop(self.yt_resource, "YT Bucket")
            .call_method_with_name_lookup(self.tokenizer_component, "redeem", |lookup| {
                (
                    lookup.bucket("PT Bucket"),
                    lookup.bucket("YT Bucket"),
                    dec!(1000),
                )
            })
            .deposit_entire_worktop(self.account.account_component);

        self.execute_manifest(manifest.build(), "redeem")
    }

    pub fn redeem_from_pt(&mut self) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(self.account.account_component, self.pt_resource, dec!(1000))
            .take_all_from_worktop(self.pt_resource, "PT Bucket")
            .call_method_with_name_lookup(self.tokenizer_component, "redeem_from_pt", |lookup| {
                (lookup.bucket("PT Bucket"),)
            })
            .deposit_entire_worktop(self.account.account_component);

        self.execute_manifest(manifest.build(), "redeem_from_pt")
    }

    pub fn claim_yield(&mut self, local_id: NonFungibleLocalId) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .create_proof_from_account_of_non_fungibles(
                self.account.account_component,
                self.yt_resource,
                [local_id],
            )
            .pop_from_auth_zone("YT Proof")
            .call_method_with_name_lookup(self.tokenizer_component, "claim_yield", |lookup| {
                (lookup.proof("YT Proof"),)
            })
            .deposit_entire_worktop(self.account.account_component);

        self.execute_manifest(manifest.build(), "claim_yield")
    }
}
