const YTcomponentAddress = import.meta.env
  .VITE_API_YIELD_TOKEN_COMPONENT_ADDRESS;
const ptAddress = import.meta.env.VITE_API_PT_ADDRESS;
const ytAddress = import.meta.env.VITE_API_YT_ADDRESS;
const lsuAddress = import.meta.env.VITE_API_LSU_ADDRESS;
const puAddress = import.meta.env.VITE_API_PU_ADDRESS;
const ammComponentAddress = import.meta.env.VITE_API_AMM_COMPONENT_ADDRESS;

export const generateTokenizeLsu = ({ accountAddress, lsuAmount }) => {
  const manifest = `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${lsuAddress}")
      Decimal("${lsuAmount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${lsuAddress}")
      Bucket("LSU Bucket")
    ;
    CALL_METHOD
      Address("${YTcomponentAddress}")
      "tokenize_yield"
      Bucket("LSU Bucket")
    ;
    CALL_METHOD
      Address("${accountAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
  return manifest;
};

export const generateRedeem = ({ accountAddress, ptAmount, resource_id }) => {
  const manifest = `
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${ptAddress}")
        Decimal("${ptAmount}")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw_non_fungibles"
        Address("${ytAddress}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("${resource_id}")
        )
    ;
    TAKE_ALL_FROM_WORKTOP
        Address("${ptAddress}")
        Bucket("PT Bucket")
    ;
    TAKE_ALL_FROM_WORKTOP
        Address("${ytAddress}")
        Bucket("YT Bucket")
    ;
    CALL_METHOD
        Address("${YTcomponentAddress}")
        "redeem"
        Bucket("PT Bucket")
        Bucket("YT Bucket")
        Decimal("${ptAmount}")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
    ;
  `;
  return manifest;
};

export const generateAddLiquidity = ({
  accountAddress,
  ptAmount,
  lsuAmount,
}) => {
  const manifest = `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${ptAddress}") 
      Decimal("${ptAmount}")
    ;
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${lsuAddress}") 
      Decimal("${lsuAmount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${ptAddress}")
      Bucket("pt_resource")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${lsuAddress}")
      Bucket("lsu_resource_address")
    ;
    CALL_METHOD
      Address("${ammComponentAddress}") 
      "add_liquidity"
      Bucket("pt_resource")
      Bucket("lsu_resource_address")
    ;
    CALL_METHOD
      Address("${accountAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
  return manifest;
};

export const generateRemoveLiquidity = ({ accountAddress, puAmount }) => {
  const manifest = `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${puAddress}")
      Decimal("${puAmount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${puAddress}")
      Bucket("pool_unit")
    ;
    CALL_METHOD
      Address("${ammComponentAddress}")
      "remove_liquidity"
      Bucket("pool_unit")
    ;
    CALL_METHOD
      Address("${accountAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;

  `;
  return manifest;
};

export const generateSwapPtForLsu = ({ accountAddress, ptAmount }) => {
  const manifest = `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${ptAddress}")
      Decimal("${ptAmount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${ptAddress}")
      Bucket("pt_resource")
    ;
    CALL_METHOD
      Address("${ammComponentAddress}")
      "swap_exact_pt_for_lsu"
      Bucket("pt_resource")
    ;
    CALL_METHOD
      Address("${accountAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
  return manifest;
};

export const generateSwapLsuForPt = ({
  accountAddress,
  ptAmount,
  lsuAmount,
}) => {
  const manifest = `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${lsuAddress}")
      Decimal("${lsuAmount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${lsuAddress}")
      Bucket("lsu_resource_address")
    ;
    CALL_METHOD
      Address("${ammComponentAddress}")
      "swap_exact_lsu_for_pt"
      Bucket("lsu_resource_address")
      Decimal("${ptAmount}")
    ;
    CALL_METHOD
      Address("${accountAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
  return manifest;
};

export const generateSwapLsuForYt = ({ accountAddress, lsuAmount }) => {
  const manifest = `
    CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${lsuAddress}")
      Decimal("${lsuAmount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${lsuAddress}")
      Bucket("lsu_resource_address")
    ;
    CALL_METHOD
      Address("${ammComponentAddress}")
      "swap_exact_lsu_for_yt"
      Bucket("lsu_resource_address")
    ;
    CALL_METHOD
      Address("${accountAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
  return manifest;
};

export const generateSwapYtForLsu = ({
  accountAddress,
  lsuAmount,
  resource_id,
}) => {
  const manifest = `
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw_non_fungibles"
        Address("${ytAddress}")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("${resource_id}")
        )
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${ytAddress}")
      Bucket("yt_resource")
    ;
    CALL_METHOD
      Address("${ammComponentAddress}")
      "swap_exact_yt_for_lsu"
      Bucket("yt_resource")
      Decimal("${lsuAmount}")
    ;
    CALL_METHOD
      Address("${accountAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
  return manifest;
};
