export const withdrawManifest = (
  accountAddress,
  componentAddress,
  ownerBadgeAddress,
) => `
CALL_METHOD
  Address("${accountAddress}")
  "create_proof_of_amount"
  Address("${ownerBadgeAddress}")
  Decimal("1")
;
CALL_METHOD
  Address("${componentAddress}")
  "withdraw_earnings"
;
CALL_METHOD
  Address("${accountAddress}")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP")
;`;
