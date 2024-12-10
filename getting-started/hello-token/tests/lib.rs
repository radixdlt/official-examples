use scrypto_test::prelude::*;

use hello_token::hello_token_test::*;

#[test]
fn test_hello_token_with_ledger_simulator() {
    // Setup the environment
    let mut ledger = LedgerSimulatorBuilder::new().build();

    // Create an account
    let (public_key, _private_key, account) = ledger.new_allocated_account();

    // Publish package
    let package_address = ledger.compile_and_publish(this_package!());

    // Test the `instantiate_hello` function.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_function(
            package_address,
            "HelloToken",
            "instantiate_hello_token",
            manifest_args!(),
        )
        .deposit_entire_worktop(account)
        .build();
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );
    println!("{:?}\n", receipt);
    let component = receipt.expect_commit(true).new_component_addresses()[0];

    // Test the `free_token` method.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_method(component, "free_token", manifest_args!())
        .deposit_entire_worktop(account)
        .build();
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );
    println!("{:?}\n", receipt);
    receipt.expect_commit_success();
}

#[test]
fn test_hello_token_with_test_environment() -> Result<(), RuntimeError> {
    // Arrange
    let mut env = TestEnvironment::new();
    let package_address =
        PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;

    let (mut hello_token, _) = HelloToken::instantiate_hello_token(package_address, &mut env)?;

    // Act
    let bucket = hello_token.free_token(&mut env)?;

    // Assert
    let amount = bucket.amount(&mut env)?;
    assert_eq!(amount, dec!("1"));

    Ok(())
}
