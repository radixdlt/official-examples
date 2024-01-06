use radix_engine_interface::prelude::*;
use scrypto::this_package;
use scrypto_test::prelude::*;
use scrypto_unit::*;
use scrypto::prelude::*;
use transaction::manifest::decompiler::ManifestObjectNames;

struct Account {
    account_component: ComponentAddress,
    public_key: Secp256k1PublicKey,
}

struct TestEnvironment {
    test_runner: DefaultTestRunner,
    account: Account,
    package_address: PackageAddress,
    component_address: ComponentAddress,
    candy_price: Decimal,
    chocolate_egg_price: Decimal,
    owner_badge: ResourceAddress,
    manager_badge: ResourceAddress,
    staff_badges: ResourceAddress,
    candy_token: ResourceAddress,
    chocolate_token: ResourceAddress,
}

impl TestEnvironment {
    pub fn new() -> Self {
        let mut test_runner = TestRunnerBuilder::new().build();

        let (public_key, _private_key, account_component) = test_runner.new_allocated_account();

        let account = Account { account_component, public_key };

        let candy_price = dec!(10);

        let chocolate_egg_price = dec!(50);

        let package_address = test_runner.compile_and_publish(this_package!());

        let manifest = ManifestBuilder::new()
            .call_function(
                package_address,
                "CandyStore",
                "instantiate_candy_store",
                manifest_args!(candy_price, chocolate_egg_price)
            )
            .deposit_batch(account_component)
            .build();

        let receipt = test_runner.execute_manifest_ignoring_fee(
            manifest,
            vec![NonFungibleGlobalId::from_public_key(&public_key)]
        );

        let component_address = receipt.expect_commit_success().new_component_addresses()[0];

        let owner_badge = receipt.expect_commit_success().new_resource_addresses()[0];
        let manager_badge = receipt.expect_commit_success().new_resource_addresses()[1];
        let staff_badges = receipt.expect_commit_success().new_resource_addresses()[2];
        let candy_token = receipt.expect_commit_success().new_resource_addresses()[3];
        let chocolate_token = receipt.expect_commit_success().new_resource_addresses()[4];

        Self {
            test_runner,
            account,
            package_address,
            component_address,
            candy_price,
            chocolate_egg_price,
            owner_badge,
            manager_badge,
            staff_badges,
            candy_token,
            chocolate_token,
        }
    }

    pub fn execute_manifest_ignoring_fee(
        &mut self,
        naming: ManifestObjectNames,
        manifest: TransactionManifestV1,
        name: &str
    ) -> TransactionReceipt {
        dump_manifest_to_file_system(
            naming,
            &manifest,
            "./tests/transaction-manifests",
            Some(name),
            &NetworkDefinition::mainnet()
        ).err();

        self.test_runner.execute_manifest_ignoring_fee(
            manifest,
            vec![NonFungibleGlobalId::from_public_key(&self.account.public_key)]
        )
    }

    pub fn instantiate_candy_store(
        &mut self,
        candy_price: Decimal,
        chocolate_egg_price: Decimal
    ) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .call_function(
                self.package_address,
                "CandyStore",
                "instantiate_candy_store",
                manifest_args!(candy_price, chocolate_egg_price)
            )
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "instantiate_candy_store"
        )
    }

    pub fn get_prices(&mut self) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .call_method(self.component_address, "get_prices", manifest_args!())
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(manifest.object_names(), manifest.build(), "get_prices")
    }

    pub fn buy_candy(&mut self, amount: Decimal) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .withdraw_from_account(self.account.account_component, XRD, amount)
            .take_from_worktop(XRD, amount, "token_a")
            .call_method_with_name_lookup(self.component_address, "buy_candy", |lookup| (
                lookup.bucket("token_a"),
            ))
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(manifest.object_names(), manifest.build(), "buy_candy")
    }

    pub fn buy_chocolate_egg(&mut self, amount: Decimal) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .withdraw_from_account(self.account.account_component, XRD, amount)
            .take_from_worktop(XRD, amount, "token_a")
            .call_method_with_name_lookup(self.component_address, "buy_chocolate_egg", |lookup| (
                lookup.bucket("token_a"),
            ))
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "buy_chocolate_egg"
        )
    }

    pub fn set_candy_price(
        &mut self,
        new_price: Decimal,
        badge: ResourceAddress
    ) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .create_proof_from_account_of_amount(self.account.account_component, badge, dec!(1))
            .call_method(self.component_address, "set_candy_price", manifest_args!(new_price))
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "set_candy_price"
        )
    }

    pub fn set_chocolate_egg_price(
        &mut self,
        new_price: Decimal,
        badge: ResourceAddress
    ) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .create_proof_from_account_of_amount(self.account.account_component, badge, dec!(1))
            .call_method(
                self.component_address,
                "set_chocolate_egg_price",
                manifest_args!(new_price)
            )
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "set_chocolate_egg_price"
        )
    }

    pub fn mint_staff_badge(&mut self, badge: ResourceAddress) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .create_proof_from_account_of_amount(self.account.account_component, badge, dec!(1))
            .call_method(self.component_address, "mint_staff_badge", manifest_args!())
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "mint_staff_badge
            "
        )
    }

    pub fn restock_store(&mut self, badge: ResourceAddress) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .create_proof_from_account_of_amount(self.account.account_component, badge, dec!(1))
            .call_method(self.component_address, "restock_store", manifest_args!())
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "restock_store
            "
        )
    }

    pub fn withdraw_earnings(&mut self, badge: ResourceAddress) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .create_proof_from_account_of_amount(self.account.account_component, badge, dec!(1))
            .call_method(self.component_address, "withdraw_earnings", manifest_args!())
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "withdraw_earnings
            "
        )
    }
}

#[test]
fn can_instantiate_candy_store() {
    let mut test_env = TestEnvironment::new();

    let receipt = test_env.instantiate_candy_store(
        test_env.candy_price,
        test_env.chocolate_egg_price
    );

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_commit_success();
}

#[test]
fn can_get_prices() {
    let mut test_env = TestEnvironment::new();

    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    assert_eq!(output, (dec!(10), dec!(50)), "Output doesn't match");
}

#[test]
fn can_buy_candy() {
    let mut test_env = TestEnvironment::new();

    let receipt = test_env.buy_candy(dec!(1000));

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    assert_eq!(
        test_env.test_runner.sum_descendant_balance_changes(
            commit,
            test_env.component_address.as_node_id()
        ),
        indexmap!(
            test_env.candy_token => BalanceChange::Fungible(dec!("-100")),
            XRD => BalanceChange::Fungible(dec!("1000"))
        )
    );

    assert!(
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.account.account_component.as_node_id())
            .get(&XRD)
            .map_or(false, |change| {
                match change {
                    BalanceChange::Fungible(value) =>
                        *value <= dec!("-1000") && *value > dec!("-1001"),
                    _ => false,
                }
            })
    );

    assert!(
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.account.account_component.as_node_id())
            .get(&test_env.candy_token)
            .map_or(false, |change| {
                match change {
                    BalanceChange::Fungible(value) => *value == dec!("100"),
                    _ => false,
                }
            })
    );
}

#[test]
fn can_buy_chocolate_egg() {
    let mut test_env = TestEnvironment::new();

    let receipt = test_env.buy_chocolate_egg(dec!(1000));

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    let balance_changes = test_env.test_runner.sum_descendant_balance_changes(
        commit,
        test_env.account.account_component.as_node_id()
    );

    match balance_changes.get(&test_env.chocolate_token).unwrap().clone() {
        BalanceChange::NonFungible { .. } => (),
        _ => panic!("Did not receive any chocolate token!"),
    }
}

#[test]
fn can_manager_set_candy_price() {
    let mut test_env = TestEnvironment::new();

    test_env.set_candy_price(dec!(100), test_env.manager_badge);

    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    assert_eq!(output, (dec!(100), dec!(50)), "Output doesn't match");
}

#[test]
fn can_manager_set_chocolate_egg_price() {
    let mut test_env = TestEnvironment::new();

    test_env.set_chocolate_egg_price(dec!(500), test_env.manager_badge);

    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_commit_success();

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    assert_eq!(output, (dec!(10), dec!(500)), "Output doesn't match");
}

#[test]
fn can_manager_mint_staff_badge() {
    let mut test_env = TestEnvironment::new();

    let receipt = test_env.mint_staff_badge(test_env.manager_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    let balance_changes = test_env.test_runner.sum_descendant_balance_changes(
        commit,
        test_env.account.account_component.as_node_id()
    );

    assert_eq!(
        balance_changes.get(&test_env.staff_badges).unwrap().clone(),
        BalanceChange::Fungible(dec!("1"))
    );
}

#[test]
fn can_staff_restock_store() {
    let mut test_env = TestEnvironment::new();

    test_env.buy_candy(dec!(800));

    let receipt = test_env.restock_store(test_env.staff_badges);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    let BalanceChange::NonFungible { added: account_added, removed: account_removed } =
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.component_address.as_node_id())
            .get(&test_env.chocolate_token)
            .unwrap()
            .clone() else {
        panic!("must be non-fungible")
    };

    assert_eq!(account_added.len(), 5);
    assert_eq!(account_removed.len(), 0);

    assert_eq!(
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.component_address.as_node_id())
            .get(&test_env.candy_token)
            .unwrap()
            .clone(),
        BalanceChange::Fungible(dec!("80"))
    );
}

#[test]
fn can_owner_withdraw_earnings() {
    let mut test_env = TestEnvironment::new();

    test_env.buy_candy(dec!(1000));

    test_env.buy_chocolate_egg(dec!(50));

    let receipt = test_env.withdraw_earnings(test_env.owner_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    assert_eq!(
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.component_address.as_node_id())
            .get(&XRD)
            .unwrap()
            .clone(),
        BalanceChange::Fungible(dec!("-1050"))
    );

    assert!(
        if
            let Some(change) = test_env.test_runner
                .sum_descendant_balance_changes(
                    commit,
                    test_env.account.account_component.as_node_id()
                )
                .get(&XRD)
        {
            matches!(change.clone(), BalanceChange::Fungible(value) if value > dec!("1049") && value <= dec!("1050"))
        } else {
            false
        },
        "Balance change for XRD is not within the expected range"
    );
}

// =========================================== FAIL SCENARIOS =========================================== //

#[test]
fn cannot_set_chocolate_egg_price() {
    let mut test_env = TestEnvironment::new();

    test_env.set_chocolate_egg_price(dec!(500), test_env.manager_badge);

    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_specific_failure(|e| {
        matches!(
            e,
            RuntimeError::SystemModuleError(
                SystemModuleError::AuthError(AuthError::Unauthorized(..))
            )
        )
    })
}

#[test]
fn cannot_mint_staff_badge() {
    let mut test_env = TestEnvironment::new();

    let random_badge = test_env.test_runner.create_fungible_resource(
        dec!(1),
        0,
        test_env.account.account_component
    );

    let receipt = test_env.mint_staff_badge(random_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_specific_failure(|e| {
        matches!(
            e,
            RuntimeError::SystemModuleError(
                SystemModuleError::AuthError(AuthError::Unauthorized(..))
            )
        )
    })
}

#[test]
fn cannot_restock_store() {
    let mut test_env = TestEnvironment::new();

    let random_badge = test_env.test_runner.create_fungible_resource(
        dec!(1),
        0,
        test_env.account.account_component
    );

    let receipt = test_env.restock_store(random_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_specific_failure(|e| {
        matches!(
            e,
            RuntimeError::SystemModuleError(
                SystemModuleError::AuthError(AuthError::Unauthorized(..))
            )
        )
    })
}

#[test]
fn cannot_withdraw_earnings() {
    let mut test_env = TestEnvironment::new();

    let random_badge = test_env.test_runner.create_fungible_resource(
        dec!(1),
        0,
        test_env.account.account_component
    );

    let receipt = test_env.withdraw_earnings(random_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_specific_failure(|e| {
        matches!(
            e,
            RuntimeError::SystemModuleError(
                SystemModuleError::AuthError(AuthError::Unauthorized(..))
            )
        )
    })
}
