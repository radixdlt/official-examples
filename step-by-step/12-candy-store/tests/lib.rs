use radix_engine_interface::prelude::*;
use scrypto::this_package;
use scrypto_test::prelude::*;
use scrypto_unit::*;
use scrypto::prelude::*;
use transaction::manifest::decompiler::ManifestObjectNames;

// Creating a struct store and retrieve account information easily.
struct Account {
    account_component: ComponentAddress,
    public_key: Secp256k1PublicKey,
}

// Creating a TestEnvironment to store and retrieve all the data we need to simulate our tests.
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

// Creating helper methods which contains a transaction manifest and execution of that manifest for
// each method in our blueprint to structure a more clean unit test later.
impl TestEnvironment {
    // Creates a new TestEnvironment for simulating and testing the CandyStore.
    pub fn new() -> Self {
        // Initialize a TestRunner.
        let mut test_runner = TestRunnerBuilder::new().build();

        // Create a new account with associated public and private keys.
        let (public_key, _private_key, account_component) = test_runner.new_allocated_account();

        // Instantiate an Account struct with the created account information.
        let account = Account { account_component, public_key };

        // Set initial prices for candy and chocolate eggs.
        let candy_price = dec!(10);
        let chocolate_egg_price = dec!(50);

        // Compile and publish the CandyStore blueprint package.
        let package_address = test_runner.compile_and_publish(this_package!());

        // Build a manifest to instantiate the CandyStore, including initial price arguments.
        let manifest = ManifestBuilder::new()
            .call_function(
                package_address,
                "CandyStore",
                "instantiate_candy_store",
                manifest_args!(candy_price, chocolate_egg_price)
            )
            .deposit_batch(account_component)
            .build();

        // Execute the manifest, obtaining a transaction receipt.
        let receipt = test_runner.execute_manifest_ignoring_fee(
            manifest,
            vec![NonFungibleGlobalId::from_public_key(&public_key)]
        );

        // Extract relevant addresses and resources from the executed manifest.
        let component_address = receipt.expect_commit_success().new_component_addresses()[0];
        let owner_badge = receipt.expect_commit_success().new_resource_addresses()[0];
        let manager_badge = receipt.expect_commit_success().new_resource_addresses()[1];
        let staff_badges = receipt.expect_commit_success().new_resource_addresses()[2];
        let candy_token = receipt.expect_commit_success().new_resource_addresses()[3];
        let chocolate_token = receipt.expect_commit_success().new_resource_addresses()[4];

        // Extract relevant addresses and resources from the executed manifest.
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

    // Executes a transaction manifest while ignoring fees, providing additional debugging features.
    pub fn execute_manifest_ignoring_fee(
        &mut self,
        naming: ManifestObjectNames,
        manifest: TransactionManifestV1,
        name: &str
    ) -> TransactionReceipt {
        // Dump the manifest to the file system for debugging purposes.
        dump_manifest_to_file_system(
            naming,
            &manifest,
            "./tests/transaction-manifests",
            Some(name),
            &NetworkDefinition::mainnet()
        ).err();

        // Execute the manifest, ignoring fees, and return the resulting transaction receipt.
        self.test_runner.execute_manifest_ignoring_fee(
            manifest,
            vec![NonFungibleGlobalId::from_public_key(&self.account.public_key)]
        )
    }

    // // Instantiates the CandyStore smart contract with specified candy and chocolate egg prices.
    pub fn instantiate_candy_store(
        &mut self,
        candy_price: Decimal,
        chocolate_egg_price: Decimal
    ) -> TransactionReceipt {
        // Build a manifest for instantiating the CandyStore with the given prices.
        let manifest = ManifestBuilder::new()
            .call_function(
                self.package_address,
                "CandyStore",
                "instantiate_candy_store",
                manifest_args!(candy_price, chocolate_egg_price)
            )
            .deposit_batch(self.account.account_component);

        // Execute the manifest for CandyStore instantiation, ignoring fees.
        self.execute_manifest_ignoring_fee(
            manifest.object_names(),
            manifest.build(),
            "instantiate_candy_store"
        )
    }

    // Retrieves the current prices from the CandyStore blueprint
    pub fn get_prices(&mut self) -> TransactionReceipt {
        let manifest = ManifestBuilder::new()
            .lock_fee(self.account.account_component, dec!(1))
            .call_method(self.component_address, "get_prices", manifest_args!())
            .deposit_batch(self.account.account_component);

        self.execute_manifest_ignoring_fee(manifest.object_names(), manifest.build(), "get_prices")
    }

    // Initiates a purchase of candy from the CandyStore with the specified amount.
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

    // Initiates a purchase of chocolate egg from the CandyStore with the specified amount.
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

    // Sets the new price for candy in the CandyStore using an authorized badge.
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

    // Sets the new price for chocolate egg in the CandyStore using an authorized badge.
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

    // Mints a staff badge using an authorized badge resource address.
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

    // Restocks the candy store inventory using an authorized staff badge.
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

    // Withdraws earnings from the candy store using an authorized badge.
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

// =========================================== SUCCESS SCENARIOS =========================================== //

// Below are all the test scenarios using the TestEnvironment we create.
// The test are structured as follow:
// 1. Create an instance of our TestEnvironment to load up our local ledger which deploys and instantiates the CandyStore.
// 2. Execute a transaction which calls X method/function and returns a Transaction Receipt.
// 3. Call on .expect_commit_success to ensure the transaction is valid and was committed.
// 4. Assert our desired result to ensure expected behavior.

// This test scenario is focused on verifying the successful instantiation of a Candy Store within a testing environment.
#[test]
fn can_instantiate_candy_store() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Attempts to instantiate a Candy Store by providing specific parameters such as candy_price and chocolate_egg_price.
    let receipt = test_env.instantiate_candy_store(
        test_env.candy_price,
        test_env.chocolate_egg_price
    );

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    // The test asserts that the transaction commits successfully
    receipt.expect_commit_success();
}

// This test scenario is designed to validate the functionality of retrieving prices within a testing environment.
#[test]
fn can_get_prices() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Calls the get_prices method
    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    // the test extracts the output values from the second position of the receipt and asserts that they match
    // the expected values (dec!(10) and dec!(50)).
    assert_eq!(output, (dec!(10), dec!(50)), "Output doesn't match");
}

// This test scenario aims to validate the buying functionality within a testing environment.
// The test initializes a TestEnvironment and attempts to buy candy by providing a specific quantity (dec!(1000)).
#[test]
fn can_buy_candy() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Attempts to buy candy by providing a specific quantity (dec!(1000)).
    let receipt = test_env.buy_candy(dec!(1000));

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    // Component Address Balance Changes: Verifies that the balance changes for the component address are as expected,
    // specifically a decrease of 100 units in the candy token and an increase of 1000 units in XRD.
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

    // Account Component XRD Balance Changes: Ensures that the balance changes for the XRD token
    // in the account component address fall within the expected range, reflecting a decrease of around 1000 units.
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

    // Account Component Candy Token Balance Changes: Validates that the balance changes for the candy
    // token in the account component address are precisely 100 units, reflecting the purchased quantity.
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

// This test scenario focuses on validating the ability to purchase a chocolate egg within a testing environment.
// The test initializes a TestEnvironment and attempts to buy a chocolate egg by specifying a quantity (dec!(1000)).
#[test]
fn can_buy_chocolate_egg() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Attempts to buy chocolate egg by providing a specific quantity (dec!(50)).
    let receipt = test_env.buy_chocolate_egg(dec!(50));

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    let balance_changes = test_env.test_runner.sum_descendant_balance_changes(
        commit,
        test_env.account.account_component.as_node_id()
    );

    // It verifies that the balance change for the chocolate token is of type NonFungible,
    // ensuring that the expected chocolate token is received as a result of the purchase.
    match balance_changes.get(&test_env.chocolate_token).unwrap().clone() {
        BalanceChange::NonFungible { .. } => (),
        _ => panic!("Did not receive any chocolate token!"),
    }
}

// This test scenario verifies the functionality of a manager setting the candy price within a testing environment.
#[test]
fn can_manager_set_candy_price() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Sets the candy price to a specified value (dec!(100)) by using the manager_badge.
    test_env.set_candy_price(dec!(100), test_env.manager_badge);

    // Calls the get_prices method
    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    // The test extracts the output values from the second position of the receipt and asserts
    // that they match the newly set candy price (dec!(100)) and the existing chocolate egg price (dec!(50)).
    assert_eq!(output, (dec!(100), dec!(50)), "Output doesn't match");
}

// This test scenario verifies the functionality of a owner setting the candy price within a testing environment.
#[test]
fn can_owner_set_candy_price() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Sets the candy price to a specified value (dec!(100)) by using the manager_badge.
    test_env.set_candy_price(dec!(100), test_env.owner_badge);

    // Calls the get_prices method
    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    // The test extracts the output values from the second position of the receipt and asserts
    // that they match the newly set candy price (dec!(100)) and the existing chocolate egg price (dec!(50)).
    assert_eq!(output, (dec!(100), dec!(50)), "Output doesn't match");
}

// This test scenario verifies the functionality of a manager setting the chocolate egg price within a testing environment.
#[test]
fn can_manager_set_chocolate_egg_price() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Sets the chocolate egg price to a specified value (dec!(500)) by using the manager_badge.
    test_env.set_chocolate_egg_price(dec!(500), test_env.manager_badge);

    // Calls the get_prices method
    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_commit_success();

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    // The test extracts the output values from the second position of the receipt and asserts
    // that they match the newly set chocolate egg price (dec!(500)) and the existing candy egg price (dec!(10)).
    assert_eq!(output, (dec!(10), dec!(500)), "Output doesn't match");
}

// This test scenario verifies the functionality of a owner setting the chocolate egg price within a testing environment.
#[test]
fn can_owner_set_chocolate_egg_price() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Sets the chocolate egg price to a specified value (dec!(500)) by using the owner_badge.
    test_env.set_chocolate_egg_price(dec!(500), test_env.owner_badge);

    // Calls the get_prices method
    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_commit_success();

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    // The test extracts the output values from the second position of the receipt and asserts
    // that they match the newly set chocolate egg price (dec!(500)) and the existing candy egg price (dec!(10)).
    assert_eq!(output, (dec!(10), dec!(500)), "Output doesn't match");
}

#[test]
fn can_manager_mint_staff_badge() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Attempts to mint a staff badge using the manager_badge.
    let receipt = test_env.mint_staff_badge(test_env.manager_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    let balance_changes = test_env.test_runner.sum_descendant_balance_changes(
        commit,
        test_env.account.account_component.as_node_id()
    );

    // The test checks the balance changes in the account component address to ensure that a new staff badge has been minted.
    // Specifically, it asserts that the balance change for the staff_badges token is of type Fungible with a quantity of 1.
    assert_eq!(
        balance_changes.get(&test_env.staff_badges).unwrap().clone(),
        BalanceChange::Fungible(dec!("1"))
    );
}

// This test scenario focuses on validating the manager's ability to mint a staff badge within a testing environment.
#[test]
fn can_owner_mint_staff_badge() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Attempts to mint a staff badge using the owner_badge.
    let receipt = test_env.mint_staff_badge(test_env.owner_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    let balance_changes = test_env.test_runner.sum_descendant_balance_changes(
        commit,
        test_env.account.account_component.as_node_id()
    );

    // The test checks the balance changes in the account component address to ensure that a new staff badge has been minted.
    // Specifically, it asserts that the balance change for the staff_badges token is of type Fungible with a quantity of 1.
    assert_eq!(
        balance_changes.get(&test_env.staff_badges).unwrap().clone(),
        BalanceChange::Fungible(dec!("1"))
    );
}

// This test scenario focuses on validating the staff's ability to restock the candy store within a testing environment.
#[test]
fn can_staff_restock_store() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Purchases candy (dec!(800)) to deplete the store's stock
    test_env.buy_candy(dec!(800));

    // Attempts to restock the store using the staff_badges token.
    let receipt = test_env.restock_store(test_env.staff_badges);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    // The test checks the balance changes in the component address, specifically for the chocolate token.
    // It ensures that the balance change is of type NonFungible, with added items reflecting the restocked candies.
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

    // The test verifies that the balance change for the candy token in the component address is of type Fungible,
    // reflecting the correct quantity (dec!("80")) after the restocking operation.
    assert_eq!(
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.component_address.as_node_id())
            .get(&test_env.candy_token)
            .unwrap()
            .clone(),
        BalanceChange::Fungible(dec!("80"))
    );
}

// This test scenario focuses on validating the manager's ability to restock the candy store within a testing environment.
#[test]
fn can_manager_restock_store() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Purchases candy (dec!(800)) to deplete the store's stock
    test_env.buy_candy(dec!(800));

    // attempts to restock the store using the staff_badges token.
    let receipt = test_env.restock_store(test_env.manager_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    // the test checks the balance changes in the component address, specifically for the chocolate token.
    // It ensures that the balance change is of type NonFungible, with added items reflecting the restocked candies.
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

    // The test verifies that the balance change for the candy token in the component address is of type Fungible,
    // reflecting the correct quantity (dec!("80")) after the restocking operation.
    assert_eq!(
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.component_address.as_node_id())
            .get(&test_env.candy_token)
            .unwrap()
            .clone(),
        BalanceChange::Fungible(dec!("80"))
    );
}

// This test scenario focuses on validating the manager's ability to restock the candy store within a testing environment.
#[test]
fn can_owner_restock_store() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Purchases candy (dec!(800)) to deplete the store's stock
    test_env.buy_candy(dec!(800));

    // attempts to restock the store using the staff_badges token.
    let receipt = test_env.restock_store(test_env.owner_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    // the test checks the balance changes in the component address, specifically for the chocolate token.
    // It ensures that the balance change is of type NonFungible, with added items reflecting the restocked candies.
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

    // The test verifies that the balance change for the candy token in the component address is of type Fungible,
    // reflecting the correct quantity (dec!("80")) after the restocking operation.
    assert_eq!(
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.component_address.as_node_id())
            .get(&test_env.candy_token)
            .unwrap()
            .clone(),
        BalanceChange::Fungible(dec!("80"))
    );
}

// This test scenario verifies the owner's ability to withdraw earnings within a testing environment.
#[test]
fn can_owner_withdraw_earnings() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Purchases candy (dec!(1000)) and a chocolate egg (dec!(50)) to generate earnings
    test_env.buy_candy(dec!(1000));
    test_env.buy_chocolate_egg(dec!(50));

    // Attempts to withdraw the earnings using the owner_badge.
    let receipt = test_env.withdraw_earnings(test_env.owner_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let commit = receipt.expect_commit_success();

    // The test checks the balance changes in both the component address and the account component address for the XRD token.
    // It ensures that the XRD balance in the component address is decreased by the total earnings (1050)
    assert_eq!(
        test_env.test_runner
            .sum_descendant_balance_changes(commit, test_env.component_address.as_node_id())
            .get(&XRD)
            .unwrap()
            .clone(),
        BalanceChange::Fungible(dec!("-1050"))
    );

    // The XRD balance in the account component address reflects a corresponding decrease within the expected range
    // greater than 1049 and less or equal than 1050 because it's 1049.0... because of tx fees
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

// Below are all the test scenarios using the TestEnvironment we create.
// The test are structured as follow:
// 1. Create an instance of our TestEnvironment to load up our local ledger which deploys and instantiates the CandyStore.
// 2. Execute a transaction which calls X method/function and returns a Transaction Receipt.
// 3. Call on .expect_specific_failure to ensure the transaction failed or .expect_commit_success without any changes.
// 4. Assert our desired result to ensure expected behavior.

// This test scenario focuses on validating the inability to buy candy with a negative quantity within a testing environment.
#[test]
fn cannot_buy_candy() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // buy candy with a specified negative quantity (dec!("-100")).
    let receipt = test_env.buy_candy(dec!("-100"));

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_specific_failure(|e| {
        matches!(e, RuntimeError::ApplicationError(ApplicationError::VaultError(..)))
    })
}

// This test scenario aims to validate the inability to buy a chocolate egg with a quantity less than
// the required amount within a testing environment.
#[test]
fn cannot_buy_chocolate_egg() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    let receipt = test_env.buy_chocolate_egg(dec!(1));

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    receipt.expect_specific_failure(|e| {
        matches!(e, RuntimeError::ApplicationError(ApplicationError::BucketError(..)))
    })
}

// This test scenario focuses on validating the inability to set the candy price using an unauthorized
// badge within a testing environment.
#[test]
fn cannot_set_candy_price() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Create random badge
    let random_badge = test_env.test_runner.create_fungible_resource(
        dec!(1),
        0,
        test_env.account.account_component
    );

    // Attempts to set the candy price to a specific value (dec!(100)) using a randomly created badge.
    test_env.set_candy_price(dec!(100), random_badge);

    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    // Following the successful commit, the test asserts that the output values from the second position
    // of the receipt match the existing candy and chocolate egg prices (dec!(10) and dec!(50), respectively).
    // This ensures that the candy price remains unchanged.
    assert_eq!(output, (dec!(10), dec!(50)), "Output doesn't match");
}

// This test scenario aims to validate the inability to set the chocolate egg price using an unauthorized
// badge within a testing environment.
#[test]
fn cannot_set_chocolate_egg_price() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Create random badge
    let random_badge = test_env.test_runner.create_fungible_resource(
        dec!(1),
        0,
        test_env.account.account_component
    );

    // Attempts to set the chocolate egg price to a specific value (dec!(500)) using a randomly created badge.
    test_env.set_chocolate_egg_price(dec!(500), random_badge);

    let receipt = test_env.get_prices();

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    let output: (Decimal, Decimal) = receipt.expect_commit_success().output(2);

    // Following the successful commit, the test asserts that the output values from the second position
    // of the receipt match the existing candy and chocolate egg prices (dec!(10) and dec!(50), respectively).
    // This ensures that the candy price remains unchanged.
    assert_eq!(output, (dec!(10), dec!(50)), "Output doesn't match");
}

// This test scenario focuses on validating the inability to mint a staff badge using an unauthorized
// badge within a testing environment.
#[test]
fn cannot_mint_staff_badge() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Create random badge
    let random_badge = test_env.test_runner.create_fungible_resource(
        dec!(1),
        0,
        test_env.account.account_component
    );

    let receipt = test_env.mint_staff_badge(random_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    // The test then expects the transaction to result in a specific failure, specifically an AuthError
    // of type Unauthorized within the SystemModuleError.
    receipt.expect_specific_failure(|e| {
        matches!(
            e,
            RuntimeError::SystemModuleError(
                SystemModuleError::AuthError(AuthError::Unauthorized(..))
            )
        )
    })
}

// This test scenario aims to validate the inability to restock the candy store using an unauthorized
// badge within a testing environment.
#[test]
fn cannot_restock_store() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Create random badge
    let random_badge = test_env.test_runner.create_fungible_resource(
        dec!(1),
        0,
        test_env.account.account_component
    );

    // Attempts to restock the store using the random badge token.
    let receipt = test_env.restock_store(random_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    // The test then expects the transaction to result in a specific failure, specifically an AuthError of type
    // Unauthorized within the SystemModuleError.
    receipt.expect_specific_failure(|e| {
        matches!(
            e,
            RuntimeError::SystemModuleError(
                SystemModuleError::AuthError(AuthError::Unauthorized(..))
            )
        )
    })
}

// This test scenario focuses on validating the inability to withdraw earnings using an unauthorized
// badge within a testing environment.
#[test]
fn cannot_withdraw_earnings() {
    // The test initializes a TestEnvironment
    let mut test_env = TestEnvironment::new();

    // Create random badge
    let random_badge = test_env.test_runner.create_fungible_resource(
        dec!(1),
        0,
        test_env.account.account_component
    );

    // Attempts to withdraw earnings using a randomly created badge.
    let receipt = test_env.withdraw_earnings(random_badge);

    println!("Transaction Receipt: {}", receipt.display(&AddressBech32Encoder::for_simulator()));

    // The test then expects the transaction to result in a specific failure, specifically an AuthError of type
    // Unauthorized within the SystemModuleError.
    receipt.expect_specific_failure(|e| {
        matches!(
            e,
            RuntimeError::SystemModuleError(
                SystemModuleError::AuthError(AuthError::Unauthorized(..))
            )
        )
    })
}
