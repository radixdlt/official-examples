use scrypto_test::prelude::*;

#[test]
fn test_candy_store() {
    // ----------------- Initialize and Arrange Test -----------------
    // Initialize a TestRunner.
    let mut ledger = LedgerSimulatorBuilder::new().build();

    // Create a new account with associated public and private keys.
    let (public_key, _private_key, account_address) = ledger.new_allocated_account();

    // Compile and publish the CandyStore blueprint package.
    let package_address = ledger.compile_and_publish(this_package!());

    // ----------------- Instantiate the CandyStore -----------------
    // Build a manifest to instantiate the CandyStore, including initial price argument.
    let gumball_price = dec!(10);
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_function(
            package_address,
            "CandyStore",
            "instantiate_candy_store",
            manifest_args!(gumball_price),
        )
        .deposit_entire_worktop(account_address)
        .build();

    // Execute the manifest, obtaining a transaction receipt.
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );

    println!(
        "instantiate_candy_store Transaction Receipt:\n{}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    // Assert that the transaction commits successfully
    // If the transaction is unsuccessful, the test will fail here
    receipt.expect_commit_success();

    // Extract relevant addresses and resources from the executed manifest for testing other methods.
    let component_address = receipt.expect_commit_success().new_component_addresses()[0];
    let owner_badge = receipt.expect_commit_success().new_resource_addresses()[0];

    // ----------------- Get the current price of gumballs -----------------
    // Build a manifest to call the get_prices method.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_method(component_address, "get_prices", manifest_args!())
        .build();

    // Execute the manifest, obtaining a transaction receipt.
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );

    println!(
        "get_prices Transaction Receipt:\n{}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    // Assert that the transaction commits successfully.
    // If the transaction is unsuccessful, the test will fail here.
    receipt.expect_commit_success();

    // ----------------- Buy gumballs -----------------
    // Build a manifest to call the buy_gumball method.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .withdraw_from_account(account_address, XRD, dec!(20))
        .take_from_worktop(XRD, dec!(20), "xrd")
        .call_method_with_name_lookup(component_address, "buy_gumball", |lookup| {
            (lookup.bucket("xrd"),)
        })
        .deposit_batch(account_address, ManifestExpression::EntireWorktop)
        .build();

    // Execute the manifest, obtaining a transaction receipt.
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );

    println!(
        "buy_gumball Transaction Receipt:\n{}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    // Assert that the transaction commits successfully.
    // If the transaction is unsuccessful, the test will fail here.
    receipt.expect_commit_success();

    // ----------------- Set the new price for gumballs -----------------
    // Build a manifest to call the set_gumball_price method with the proof of the owner badge.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .create_proof_from_account_of_amount(account_address, owner_badge, dec!(1))
        .call_method(
            component_address,
            "set_gumball_price",
            manifest_args!(dec!(15)),
        )
        .build();

    // Execute the manifest, obtaining a transaction receipt.
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );

    println!(
        "set_gumball_price Transaction Receipt:\n{}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    // Assert that the transaction commits successfully.
    // If the transaction is unsuccessful, the test will fail here.
    receipt.expect_commit_success();

    // ----------------- Restock the candy store -----------------
    // Build a manifest to call the restock_store method with proof of the owner badge.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .create_proof_from_account_of_amount(account_address, owner_badge, dec!(1))
        .call_method(component_address, "restock_store", manifest_args!())
        .build();

    // Execute the manifest, obtaining a transaction receipt.
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );

    println!(
        "restock_store Transaction Receipt:\n{}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    // Assert that the transaction commits successfully.
    // If the transaction is unsuccessful, the test will fail here.
    receipt.expect_commit_success();

    // ----------------- Withdraw earnings from the candy store -----------------
    // Build a manifest to call the withdraw_earnings method with proof of the owner badge.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .create_proof_from_account_of_amount(account_address, owner_badge, dec!(1))
        .call_method(component_address, "withdraw_earnings", manifest_args!())
        .deposit_batch(account_address, ManifestExpression::EntireWorktop)
        .build();

    // Execute the manifest, obtaining a transaction receipt.
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );

    println!(
        "withdraw_earnings Transaction Receipt:\n{}",
        receipt.display(&AddressBech32Encoder::for_simulator())
    );

    // Assert that the transaction commits successfully.
    // If the transaction is unsuccessful, the test will fail here.
    receipt.expect_commit_success();
}
