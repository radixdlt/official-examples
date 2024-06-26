use scrypto_math::ExponentialPreciseDecimal;
use scrypto_test::{prelude::*, utils::dump_manifest_to_file_system};

use radix_transactions::manifest::decompiler::ManifestObjectNames;
use yield_amm::dex::yield_amm_test::YieldAMMState;
use yield_amm::liquidity_curve::*;
use yield_amm::dex::MarketCompute;

#[test]
fn instantiate() {
    TestEnvironment::instantiate();
}

#[test]
fn can_instantiate_amm() {
    let mut test_env = TestEnvironment::instantiate();

    let receipt = test_env.instantiate_amm();

    receipt.expect_commit_success();

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );
}

#[test]
fn add_liquidity() {
    let mut test_environment = TestEnvironment::instantiate();

    let receipt = test_environment.add_liquidity(dec!(1000), dec!(1000));

    receipt.expect_commit_success();
}

#[test]
fn remove_liquidity() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment
        .add_liquidity(dec!(1000), dec!(1000))
        .expect_commit_success();

    let receipt = test_environment.remove_liquidity(dec!(1000));

    receipt.expect_commit_success();
}

#[test]
fn set_initial_ln_implied_rate() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment
        .add_liquidity(dec!(1000), dec!(1000))
        .expect_commit_success();

    let receipt = test_environment.set_initial_ln_implied_rate(pdec!("1.04"));

    receipt.expect_commit_success();
}

#[test]
fn swap_exact_pt_for_lsu() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    let receipt = test_environment.swap_exact_pt_for_lsu(dec!(100));

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    receipt.expect_commit_success();
}

#[test]
fn swap_pt_for_lsu_one_day_before_maturity() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    let date = UtcDateTime::new(2025, 03, 04, 0, 0, 0).ok().unwrap();

    test_environment.advance_date(date);

    let receipt = test_environment.swap_exact_pt_for_lsu(dec!(100));

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    receipt.expect_commit_success();
}

#[test]
fn exchange_rate_narrows_towards_maturity() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    let date = UtcDateTime::new(2025, 02, 05, 0, 0, 0).ok().unwrap();

    test_environment.advance_date(date);

    let receipt = test_environment.swap_exact_pt_for_lsu(dec!(100));

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    receipt.expect_commit_success();
}

#[test]
fn swap_exact_lsu_for_pt() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    test_environment.swap_exact_lsu_for_pt(dec!(100), dec!(100));

    let receipt = test_environment.swap_exact_lsu_for_pt(dec!(100), dec!(100));

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    receipt.expect_commit_success();
}

#[test]
fn swap_exact_lsu_for_yt() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(4000), dec!(4000), pdec!("1.04"));

    let receipt = test_environment.swap_exact_lsu_for_yt(dec!(100));

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    receipt.expect_commit_success();
}

#[test]
fn swap_exact_yt_for_lsu() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    let receipt = test_environment.swap_exact_yt_for_lsu(dec!(100));

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    receipt.expect_commit_success();
}

#[test]
fn swap_one_day_before_maturity() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    let date = UtcDateTime::new(2025, 03, 04, 23, 59, 59).ok().unwrap();

    test_environment.advance_date(date);

    let receipt = test_environment.swap_exact_pt_for_lsu(dec!(999));

    println!(
        "Transaction Receipt: {}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    receipt.expect_commit_success();
}

#[test]
pub fn lp_fees_increases() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    test_environment
        .swap_exact_pt_for_lsu(dec!(100))
        .expect_commit_success();

    let receipt = test_environment.get_vault_reserves();

    let output: IndexMap<ResourceAddress, Decimal> = receipt.expect_commit_success().output(1);

    println!("Vault Reserves: {:?}", output);

    receipt.expect_commit_success();
}

#[test]
fn prove_interest_rate_continuity() {
    let mut test_environment = TestEnvironment::instantiate();

    // Setting up the pool
    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    // Establishing the market implied rate
    test_environment
        .swap_exact_pt_for_lsu(dec!(100))
        .expect_commit_success();

    // Retrieving market implied rate
    let component_state: YieldAMMState = test_environment
        .ledger
        .component_state::<YieldAMMState>(test_environment.amm_component);
    let last_ln_implied_rate = component_state.last_ln_implied_rate;

    // Calculating pre-trade implied rate
    let current_time = test_environment.ledger.get_current_proposer_timestamp_ms() / 1000;

    let current_date = UtcDateTime::from_instant(&Instant::new(current_time))
        .ok()
        .unwrap();

    let expiry = component_state.maturity_date;

    let time_to_expiry = expiry.to_instant().seconds_since_unix_epoch
        - current_date.to_instant().seconds_since_unix_epoch;

    let manifest = ManifestBuilder::new()
        .lock_fee(test_environment.account.account_component, dec!(10))
        .call_method(
            test_environment.amm_component,
            "compute_market",
            manifest_args!(time_to_expiry),
        );
    
    let receipt = test_environment.execute_manifest(
        manifest.object_names(),
        manifest.build(),
        "compute_market"
    );

    let output: MarketCompute = receipt.expect_commit_success().output(1);

    let manifest = ManifestBuilder::new()
        .lock_fee(test_environment.account.account_component, dec!(10))
        .call_method(
            test_environment.amm_component,
            "get_vault_reserves",
            manifest_args!(),
        );

    let receipt = test_environment.execute_manifest(
        manifest.object_names(),
        manifest.build(),
        "get_vault_reserves"
    );

    let reserves: IndexMap<ResourceAddress, Decimal> = 
        receipt.expect_commit_success().output(1);

    let reserves_a = reserves[0];
    let reserves_b = reserves[1];
    
    let current_proportion = calc_proportion(
        dec!(0), 
        reserves_a,
        reserves_b
    );

    let rate_scalar = output.rate_scalar;
    let rate_anchor = output.rate_anchor;

    let pre_trade_exchange_rate = calc_exchange_rate(
        current_proportion, 
        rate_anchor, 
        rate_scalar, 
    );

    // Asserting pre trade exchange rate = last market implied rate
    assert_eq!(last_ln_implied_rate.exp().unwrap(), pre_trade_exchange_rate);
}

#[test]
fn can_no_longer_trade_after_expiry() {
    let mut test_environment = TestEnvironment::instantiate();

    test_environment.set_up(dec!(1000), dec!(1000), pdec!("1.04"));

    let date = UtcDateTime::new(2025, 03, 05, 0, 0, 0).ok().unwrap();

    test_environment.advance_date(date);

    test_environment
        .swap_exact_pt_for_lsu(dec!(100))
        .expect_commit_failure();

    test_environment
        .swap_exact_lsu_for_pt(dec!(100), dec!(100))
        .expect_commit_failure();

    test_environment
        .swap_exact_lsu_for_yt(dec!(100))
        .expect_commit_failure();

    test_environment
        .swap_exact_yt_for_lsu(dec!(100))
        .expect_commit_failure();
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
    amm_component: ComponentAddress,
    pool_unit: ResourceAddress,
    lsu_resource_address: ResourceAddress,
    pt_resource: ResourceAddress,
    yt_resource: ResourceAddress,
    package_address: PackageAddress,
}

impl TestEnvironment {
    pub fn instantiate() -> Self {
        let custom_genesis = CustomGenesis::default(
            Epoch::of(1),
            CustomGenesis::default_consensus_manager_config(),
        );
        let mut ledger = LedgerSimulatorBuilder::new()
            .with_custom_genesis(custom_genesis)
            .without_kernel_trace()
            .build();
        let current_date = UtcDateTime::new(2024, 03, 05, 0, 0, 0).ok().unwrap();
        let current_date_ms = current_date.to_instant().seconds_since_unix_epoch * 1000;
        let receipt = ledger.advance_to_round_at_timestamp(Round::of(2), current_date_ms);
        receipt.expect_commit_success();

        let (public_key, _private_key, account_component) = ledger.new_allocated_account();

        let account = Account {
            public_key,
            account_component,
        };

        ledger.load_account_from_faucet(account.account_component);

        let key = Secp256k1PrivateKey::from_u64(1u64).unwrap().public_key();
        let validator_address = ledger.get_active_validator_with_key(&key);
        let lsu_resource_address = ledger
            .get_active_validator_info_by_key(&key)
            .stake_unit_resource;

        let manifest = ManifestBuilder::new()
            .lock_fee(account_component, dec!(10))
            .withdraw_from_account(account_component, XRD, dec!(10000))
            .take_all_from_worktop(XRD, "xrd")
            .call_method_with_name_lookup(validator_address, "stake", |lookup| {
                (lookup.bucket("xrd"),)
            })
            .deposit_batch(account_component)
            .build();

        ledger
            .execute_manifest(
                manifest,
                vec![NonFungibleGlobalId::from_public_key(&public_key)],
            )
            .expect_commit_success();

        // Publish package
        let yield_tokenizer_package = ledger.compile_and_publish("../yield_tokenizer");

        let expiry = Expiry::TwelveMonths;

        let manifest = ManifestBuilder::new()
            .lock_fee_from_faucet()
            .call_function(
                yield_tokenizer_package,
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


        let manifest = ManifestBuilder::new()
            .lock_fee(account_component, dec!(10))
            .withdraw_from_account(account_component, lsu_resource_address, dec!(5000))
            .take_all_from_worktop(lsu_resource_address, "lsu_bucket")
            .call_method_with_name_lookup(tokenizer_component, "tokenize_yield", |lookup| {
                (lookup.bucket("lsu_bucket"),)
            })
            .deposit_batch(account_component)
            .build();

        let receipt = ledger.execute_manifest(
            manifest,
            vec![NonFungibleGlobalId::from_public_key(&public_key)],
        );

        receipt.expect_commit_success();

        let package_address = ledger.compile_and_publish(this_package!());

        let scalar_root = dec!(50);

        let manifest = ManifestBuilder::new()
            .lock_fee_from_faucet()
            .call_function(
                package_address,
                "YieldAMM",
                "instantiate_yield_amm",
                manifest_args!(OwnerRole::None, scalar_root, dec!("1.01"), dec!("0.80"),),
            )
            .build();

        let receipt = ledger.execute_manifest(
            manifest,
            vec![NonFungibleGlobalId::from_public_key(&public_key)],
        );

        let amm_component = receipt.expect_commit(true).new_component_addresses()[0];
        let pool_unit = receipt.expect_commit(true).new_resource_addresses()[1];

        println!(
            "Tokenizer Component: {}",
            tokenizer_component.display(&AddressBech32Encoder::for_simulator())
        );
        println!(
            "Yield Tokenizer Package: {}",
            yield_tokenizer_package.display(&AddressBech32Encoder::for_simulator())
        );

        Self {
            ledger,
            account,
            amm_component,
            pool_unit,
            lsu_resource_address,
            pt_resource,
            yt_resource,
            package_address,
        }
    }

    pub fn instantiate_amm(&mut self) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .call_function(
                self.package_address,
                "YieldAMM",
                "instantiate_yield_amm",
                manifest_args!(OwnerRole::None, dec!(50), dec!("1.01"), dec!("0.80"),),
            );

        self.execute_manifest(manifest.object_names(), manifest.build(), "instantiate_amm")
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
        object_manifest: ManifestObjectNames,
        built_manifest: TransactionManifestV1,
        name: &str,
    ) -> TransactionReceiptV1 {
        dump_manifest_to_file_system(
            object_manifest,
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

    pub fn set_up(
        &mut self,
        pt_resource_amount: Decimal,
        lsu_resource_address_amount: Decimal,
        initial_rate_anchor: PreciseDecimal,
    ) {
        let receipt = self.add_liquidity(pt_resource_amount, lsu_resource_address_amount);
        receipt.expect_commit_success();
        self.set_initial_ln_implied_rate(initial_rate_anchor)
            .expect_commit_success();
    }

    pub fn set_initial_ln_implied_rate(
        &mut self,
        initial_rate_anchor: PreciseDecimal,
    ) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .call_method(
                self.amm_component,
                "set_initial_ln_implied_rate",
                manifest_args!(initial_rate_anchor,),
            );

        self.execute_manifest(
            manifest.object_names(),
            manifest.build(),
            "set_initial_ln_implied_rate",
        )
    }

    pub fn get_implied_rate(&mut self) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .call_method(
                self.amm_component,
                "get_market_implied_rate",
                manifest_args!(),
            );

        self.execute_manifest(
            manifest.object_names(),
            manifest.build(),
            "get_implied_rate",
        )
    }

    pub fn add_liquidity(
        &mut self,
        pt_resource: Decimal,
        lsu_resource_address: Decimal,
    ) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(
                self.account.account_component,
                self.pt_resource,
                pt_resource,
            )
            .withdraw_from_account(
                self.account.account_component,
                self.lsu_resource_address,
                lsu_resource_address,
            )
            .take_all_from_worktop(self.pt_resource, "pt_resource")
            .take_all_from_worktop(self.lsu_resource_address, "lsu_resource_address")
            .call_method_with_name_lookup(self.amm_component, "add_liquidity", |lookup| {
                (
                    lookup.bucket("pt_resource"),
                    lookup.bucket("lsu_resource_address"),
                )
            })
            .deposit_batch(self.account.account_component);

        self.execute_manifest(manifest.object_names(), manifest.build(), "add_liquidity")
    }

    pub fn remove_liquidity(&mut self, pool_unit_amount: Decimal) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(
                self.account.account_component,
                self.pool_unit,
                pool_unit_amount,
            )
            .take_all_from_worktop(self.pool_unit, "pool_unit")
            .call_method_with_name_lookup(self.amm_component, "remove_liquidity", |lookup| {
                (lookup.bucket("pool_unit"),)
            })
            .deposit_batch(self.account.account_component);

        self.execute_manifest(
            manifest.object_names(),
            manifest.build(),
            "remove_liquidity",
        )
    }

    pub fn swap_exact_pt_for_lsu(&mut self, pt_amount: Decimal) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(self.account.account_component, self.pt_resource, pt_amount)
            .take_all_from_worktop(self.pt_resource, "pt_resource")
            .call_method_with_name_lookup(self.amm_component, "swap_exact_pt_for_lsu", |lookup| {
                (lookup.bucket("pt_resource"),)
            })
            .deposit_batch(self.account.account_component);

        self.execute_manifest(
            manifest.object_names(),
            manifest.build(),
            "swap_exact_pt_for_lsu",
        )
    }

    pub fn swap_exact_lsu_for_pt(
        &mut self,
        lsu_amount: Decimal,
        desired_pt_amount: Decimal,
    ) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(
                self.account.account_component,
                self.lsu_resource_address,
                lsu_amount,
            )
            .take_all_from_worktop(self.lsu_resource_address, "lsu_resource_address")
            .call_method_with_name_lookup(self.amm_component, "swap_exact_lsu_for_pt", |lookup| {
                (lookup.bucket("lsu_resource_address"), desired_pt_amount)
            })
            .deposit_batch(self.account.account_component);

        self.execute_manifest(
            manifest.object_names(),
            manifest.build(),
            "swap_exact_lsu_for_pt",
        )
    }

    pub fn swap_exact_lsu_for_yt(&mut self, lsu_amount: Decimal) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(
                self.account.account_component,
                self.lsu_resource_address,
                lsu_amount,
            )
            .take_all_from_worktop(self.lsu_resource_address, "lsu_resource_address")
            .call_method_with_name_lookup(self.amm_component, "swap_exact_lsu_for_yt", |lookup| {
                (lookup.bucket("lsu_resource_address"),)
            })
            .deposit_batch(self.account.account_component);

        self.execute_manifest(
            manifest.object_names(),
            manifest.build(),
            "swap_exact_lsu_to_yt",
        )
    }

    pub fn swap_exact_yt_for_lsu(&mut self, yt_amount: Decimal) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .withdraw_from_account(self.account.account_component, self.yt_resource, dec!(1))
            .take_all_from_worktop(self.yt_resource, "yt_resource")
            .call_method_with_name_lookup(self.amm_component, "swap_exact_yt_for_lsu", |lookup| {
                (lookup.bucket("yt_resource"), yt_amount)
            })
            .deposit_batch(self.account.account_component);

        self.execute_manifest(
            manifest.object_names(),
            manifest.build(),
            "swap_exact_yt_for_lsu",
        )
    }

    pub fn get_vault_reserves(&mut self) -> TransactionReceiptV1 {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(10))
            .call_method(self.amm_component, "get_vault_reserves", manifest_args!());

        self.execute_manifest(
            manifest.object_names(),
            manifest.build(),
            "get_vault_reserves",
        )
    }
}

// Testing Goals:
// Whether implied rate moves and the conditions to which it moves
// Interest rate continuity is maintained
// Exchange rate is calculated correctly
// Whether fee is applied correctly
// Testing notes:
// Proportion as it relates to size of the tradedoesn't seem to change exchange rate,
// More so that the reserves of the pool do. However, time to maturity seems to be biggest
// factor.
// What happens when the liquidity of the reserves are too low?
// Particularly with LSU ---> YT swaps, can require lots of borrow in the pool.
// Want to simulate a trade which people constantly trading on one side.
