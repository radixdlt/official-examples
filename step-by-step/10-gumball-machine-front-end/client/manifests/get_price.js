export const getPriceManifest = (accountAddress, componentAddress) => `
CALL_METHOD
  Address("${componentAddress}")
  "get_price"
;
CALL_METHOD
  Address("${accountAddress}")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP")
;`;
