export const getRemoveLiquidityManifest = ({
  accountAddress,
  amount,
  poolUnitAddress,
  componentAddress,
}) => {
  return `
CALL_METHOD
  Address("${accountAddress}")
  "withdraw"
  Address("${poolUnitAddress}")
  Decimal("${amount}");
TAKE_ALL_FROM_WORKTOP
  Address("${poolUnitAddress}")
  Bucket("pool_unit");
CALL_METHOD
  Address("${componentAddress}")
  "remove_liquidity"
  Bucket("pool_unit");
CALL_METHOD
  Address("${accountAddress}")
  "try_deposit_batch_or_abort"
Expression("ENTIRE_WORKTOP")
  None;
`;
};
