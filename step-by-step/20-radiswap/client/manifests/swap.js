export const getSwapManifest = ({
  accountAddress,
  resourceAddress,
  amount,
  componentAddress,
}) => {
  return `
CALL_METHOD
  Address("${accountAddress}")
  "withdraw"
  Address("${resourceAddress}")
  Decimal("${amount}");
TAKE_ALL_FROM_WORKTOP
  Address("${resourceAddress}")
  Bucket("resource_in");
CALL_METHOD
  Address("${componentAddress}")
  "swap"
  Bucket("resource_in");
CALL_METHOD
  Address("${accountAddress}")
  "try_deposit_batch_or_abort"
  Expression("ENTIRE_WORKTOP")
  None;
`;
};
