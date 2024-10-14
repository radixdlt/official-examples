use scrypto_test::prelude::*;

use candy_store::gumball_machine::gumball_machine_test::*;

fn arrange_test_environment(
    price: Decimal,
) -> Result<(TestEnvironment<InMemorySubstateDatabase>, GumballMachine), RuntimeError> {
    let mut env = TestEnvironment::new();
    let package_address =
        PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;

    let (gumball_machine, _owner_badge) =
        GumballMachine::instantiate_global(price, package_address, &mut env)?;

    Ok((env, gumball_machine))
}

#[test]
fn can_instantiate_gumball_machine() -> Result<(), RuntimeError> {
    // Arrange
    let (_env, _gumball_machine) = arrange_test_environment(dec!(1))?;

    // Act
    // No action required

    // Assert
    // No assertion required

    Ok(())
}

#[test]
fn can_get_status() -> Result<(), RuntimeError> {
    // Arrange
    let (mut env, gumball_machine) = arrange_test_environment(dec!(10))?;

    // Act
    let status = gumball_machine.get_status(&mut env)?;

    // Assert
    assert_eq!(status.price, dec!(10),);
    assert_eq!(status.amount, dec!(100));

    Ok(())
}

#[test]
fn can_buy_gumball() -> Result<(), RuntimeError> {
    // Arrange
    let (mut env, mut gumball_machine) = arrange_test_environment(dec!(9))?;

    let payment = BucketFactory::create_fungible_bucket(XRD, dec!(99), Mock, &mut env)?;

    // Act
    let (gumball, change) = gumball_machine.buy_gumball(payment, &mut env)?;

    // Assert
    assert_eq!(gumball.amount(&mut env)?, dec!(1));
    assert_eq!(change.amount(&mut env)?, dec!(90));

    Ok(())
}

#[test]
fn cannot_buy_gumball_with_insufficient_funds() -> Result<(), RuntimeError> {
    // Arrange
    let (mut env, mut gumball_machine) = arrange_test_environment(dec!(10))?;

    let payment = BucketFactory::create_fungible_bucket(XRD, dec!(9), Mock, &mut env)?;

    // Act
    let result = gumball_machine.buy_gumball(payment, &mut env);

    // Assert
    assert!(result.is_err());

    Ok(())
}

#[test]
fn can_set_price() -> Result<(), RuntimeError> {
    // Arrange
    let (mut env, mut gumball_machine) = arrange_test_environment(dec!(10))?;

    env.disable_auth_module();

    // Act
    gumball_machine.set_price(dec!(20), &mut env)?;

    // Assert
    let status = gumball_machine.get_status(&mut env)?;
    assert_eq!(status.price, dec!(20));

    Ok(())
}

#[test]
fn can_withdraw_earnings() -> Result<(), RuntimeError> {
    // Arrange
    let (mut env, mut gumball_machine) = arrange_test_environment(dec!(20))?;

    let payment = BucketFactory::create_fungible_bucket(XRD, dec!(100), Mock, &mut env)?;
    let _ = gumball_machine.buy_gumball(payment, &mut env)?;
    env.disable_auth_module();

    // Act
    let earnings = gumball_machine.withdraw_earnings(&mut env)?;

    // Assert
    assert_eq!(earnings.amount(&mut env)?, dec!(20));

    Ok(())
}

#[test]
fn can_refill_gumball_machine() -> Result<(), RuntimeError> {
    // Arrange
    let (mut env, mut gumball_machine) = arrange_test_environment(dec!(10))?;

    let payment = BucketFactory::create_fungible_bucket(XRD, dec!(100), Mock, &mut env)?;
    let _ = gumball_machine.buy_gumball(payment, &mut env)?;
    env.disable_auth_module();

    // Act
    gumball_machine.refill_gumball_machine(&mut env)?;

    // Assert
    let status = gumball_machine.get_status(&mut env)?;
    assert_eq!(status.amount, dec!(100));

    Ok(())
}
