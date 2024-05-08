export const buyGumballManifest = (
  xrdAmount,
  xrdAddress,
  accountAddress,
  componentAddress
) => `
CALL_METHOD
    Address("${accountAddress}")
    "withdraw"
    Address("${xrdAddress}")
    Decimal("${xrdAmount}")
;
TAKE_FROM_WORKTOP
    Address("${xrdAddress}")
    Decimal("${xrdAmount}")
    Bucket("bucket_of_xrd")
;
CALL_METHOD
    Address("${componentAddress}")
    "buy_gumball"
    Bucket("bucket_of_xrd")
;
CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;`;
