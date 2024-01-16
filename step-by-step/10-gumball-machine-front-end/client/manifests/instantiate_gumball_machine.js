export const instantiateManifest = (
  packageAddress,
  gumballPrice,
  accountAddress
) => `
CALL_FUNCTION
    Address("${packageAddress}")
    "GumballMachine"
    "instantiate_gumball_machine"
    Decimal("${gumballPrice}")
;
CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;`;
