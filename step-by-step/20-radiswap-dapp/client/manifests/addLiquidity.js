export const getAddLiquidityManifest = ({
  accountAddress,
  amount1,
  amount2,
  poolResourceAddress1,
  poolResourceAddress2,
  componentAddress,
}) => {
  return `
CALL_METHOD
  Address("${accountAddress}")
  "withdraw"
  Address("${poolResourceAddress1}")
  Decimal("${amount1}");
TAKE_ALL_FROM_WORKTOP
  Address("${poolResourceAddress1}")
  Bucket("resource_a");
CALL_METHOD
  Address("${accountAddress}")
  "withdraw"
  Address("${poolResourceAddress2}")
  Decimal("${amount2}");
TAKE_ALL_FROM_WORKTOP
  Address("${poolResourceAddress2}")
  Bucket("resource_b");
CALL_METHOD
  Address("${componentAddress}")
  "add_liquidity"
  Bucket("resource_a")
  Bucket("resource_b");
CALL_METHOD
  Address("${accountAddress}")
  "try_deposit_batch_or_abort"
  Expression("ENTIRE_WORKTOP")
  None;
`;
};
