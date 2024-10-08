# Table of Contents

- [Overview](#overview)
- [Yield Derivatives Overview](#yield-derivatives-overview)
  - [Buyer/Seller of Principal Tokens](#buyerseller-of-principal-tokens)
  - [Buyer/Seller of Yield Tokens](#buyerseller-of-yield-tokens)
- [Decentralized Exchanges (DEX)](#decentralized-exchanges-dex)
  - [Automated Market Makers (AMM)](#automated-market-makers-amm)
  - [Pools](#pools)
  - [Flash Swaps](#flash-swaps)
- [Examples](#examples)
  - [Selling PT for LSU](#selling-pt-for-lsu)
  - [Selling LSU for PT](#selling-pt-for-lsu)
  - [Dynamic Market for PT and LSU](#dynamic-market-for-pt-and-lsu)

## Overview

The two Scrypto packages contained in this repository are

- YieldTokenization
- YieldAMM

These two packages describe the logic to create yield derivatives from yield bearing assets and to trade them. The YieldAMM Scrypto package provides a basic implementation of Pendle Finance's V2 AMM which allows yield derivatives to be traded with minimal slippage.

## Yield Derivatives Overview

Yield derivatives are financial instruments (in this case, in the form of tokens) where its value is based on the yield of the underlying yield bearing asset. Creating yield derivatives are done through a tokenization process which bifurcates a yield bearing asset such as a liquid staking unit (LSU) into its Principal Token (PT) and Yield Token (YT) parts. Bifurcating a yield bearing asset this way enhances risk management flexibility in exchange for locking the asset until a predetermined maturity date.

Since the yield is stripped from the asset, it allows one to speculate on the yield token without risking the principal of the underlying asset. A yield token holder may choose to sell, hold, buy more, or exchange the yield token which gives the rights to the yield of the underlying asset depending on their belief of where the yield of the underlying asset will go.

On the other hand, the principal is also compartmentalized into its own principal token. This means that the token only has the rights to the principal of the underlying asset. This allows the principal token holder to safeguard their principal while speculating on the yield portion of the underlying asset via the yield token. Otherwise, the principal token holder may choose to liquidate their principal.

Both PT and YT are subject to a lock period in exchange for this service. The lock up period is engineered to create incentives for market participants as it provides a window of period to speculate on the yield of the assets. As a result, the yield derivative's value is highly influenced by expiration of the lock up period. While the underlying asset can only be redeemed at or after maturity, the underlying asset can be swapped in the secondary market at anytime.

### Buyer/Seller of Principal Tokens

While the PT holder may have the patience to redeem the full value of their principal at maturity, various situations may arise that requires the PT holder to redeem the underlying asset before maturity. The only option they have is to sell it at market price in the secondary market. However, the PT holder is unlikely to find a buyer which is willing to purchase the PT at equivalent value of the underlying asset as there is no incentive for the buyer to effectively lock up their liquid asset for an illiquidt asset. Therefore, to incentivize buyers, the seller (PT holder) should sell the PT at a discount relative to the value of the underlying asset. This discount is the fixed yield the buyer expects to receive when purchasing the PT. For example, if a PT holder which has an underlying asset worth $100 and is willing to sell it for $95, the buyer may purchase it for $95 to redeem $100 at maturity. The $5 then is the fixed yield the buyer expects to have at the PT's maturity.

### Buyer/Seller of Yield Tokens

Yield tokens derive their value from the yield of the underlying assets. For example, the yield of an LSU token can vary month to month depending on the performance and fee of a particular validator. YT holders may believe the yield of the underlying asset may be less than what the market thinks and can sell it to earn a fixed income. On the other hand prospective YT buyers will purchase YT to gain exposure to the yield of the underlying asset.

## Decentralized Exchanges (DEX)

In traditional finance, these assets are traded on centralized exchanges which offers a marketplace where buyers and sellers can meet. But the novelty of DeFi is the invention of Automated Market Makers (AMM) which provides a market mechanism for DEX's without the need to have a buyer/seller on the other side. Instead, a buyer or seller only needs to directly trade against a DEX which has reserves of asset to exchange between.

![dex illustration](./images/dex.png)

### Automated Market Makers (AMM)

AMMs allow a buyer or seller to deal directly with the DEX's liquidity pools rather than being matched with a buyer or seller on the other side. To do this the DEX must have a way to determine the price of the trade. Therefore, the DEX implements an AMM which is a mathematical formula used to determine the price of the trade based on a variety of factors but generally around the size of the trade and the balance between the two liquidity reserves the DEX has in its pools. The first version of an AMM is Uniswap's Constant Product Market Maker (CPMM) which allowed any trade to find a market price regardless of how much liquidity is in the pool, but suffered from massive slippage, which is detrimental when it comes to trading fixed yields.

![uniswap cpmm graph](./images/uniswap_cpmm.png)

With the CPMM curve, you can see that along the curve, you can always find a price for a given amount of Token A or Token B. However, you will also notice that the further you go along the curve on any direction, the quantity you receive for the other token drastically reduces. This is known as slippage. Slippage is crucial for fixed yield trading because profits from yield are predetermined and in this context, you can consider slippage to be additional cost incurred which reduces the effective yield earned on the trade.

As such yield derivative trading requires an AMM which has a curve that bases its pricing not just on size of a trade and the reserves of the pools, but also pricing in interest rates and time to maturity.

Pendle Finance's AMM is heavily inspired by Notional Finance, which uses an AMM curve that follows a logit function like below.

![notional finance logit curve graph](./images/logit_curve.png)

This curve allows a pricing model which is relatively flat in the middle where we expect normal trading conditions, but steep at the ends of each side to account for large movements in the market.

As an example, if the proportion of the pool is 0.5 (balanced reserved of token A and B), even if a trade moved the proportion to 0.8, that would only move the exchange rate by ~0.2%.

Furthermore, because the curve also needs to account for time as these derivatives have a maturity date, the curve also needs to be dynamic such that it reflects the value of the derivatives as the market matures.

![dynamic sensitivity curve](./images/dynamic_sensitivity.avif)

This allows the curve to flatten, allowing the derivatives to correlate more closely with the value of its underlying asset as the market matures. In other words, if a 100 PT-LSU allows you to redeem 100 LSU at maturity, swapping 100 PT-LSU for LSU at spot rate should trend towards 1 as the market approach.

### Pools

The AMM operates on a single liquidity pool with an asset pair of Asset/PT-Asset configuration. Note that the boilerplate only supports liquidity pools for LSU and its PT derivatives (LSU/PT-LSU). Although, you may expand the boilerplate to fit your needs.

Because the pools are structured as LSU/PT-LSU, swapping between these two assets are straightforward.

### Flash Swaps

Swapping between YT are done with flash swaps as the DEX does not have a pool for YT. We can flash swap YT <---> LSU due to the relationship between PT and YT. For example, tokenizing 100 LSU will mint 100 PT + 100 YT and 100 LSU can be redeemed from the same quanity of PT + YT.

So if we are we are swapping from YT ---> LSU (Selling YT)

The mechanics will look like:

1.  Seller sends YT into the swap contract.
2.  Contract borrows an equivalent amount of PT from the pool.
3.  The YTs and PTs are used to redeem LSU.
4.  Contract calculates the required LSU to swap back to PT.
5.  Enough portion of the LSU is sold to the pool for the amount of PT required to repay the PT loan taken in step 2.
6.  The remaining LSU is sent to the seller.

The amount of LSU received back for given YT is determined by the price of PT. This is because as you borrow enough PT's to combined with YT to redeem the underlying asset, a portion of that LSU will be needed to swap back to receive enough PT's to pay back the loan.

LSU ----> YT (Buying YT)

Would look something like this:

1. Buyer sends LSU into the swap contract
2. Simulates/previews the trade to determine price of PT.
3. Retrieve price of YT from PT price.
4. Determine amount of YT amount for given LSU amount based on YT price.
5. Borrow the required additional LSU to mint the amount of YT.
6. Mint PTs and YTs from all of the LSU.
7. Send the YTs to the buyer.
8. The PTs are sold for LSU to return the amount from step 5.

Effectively, the amount of YT received for given LSU will be based on the price of PT. This is because we are trying to borrow as much LSU's as we can from the pool to mint as many YT as we can while having enough PT's to swap back to LSU to pay back what we borrowed. The price of PT will determine how many LSU's we will receiving from swapping in PT to pay back the LSU loan to mint PT & YTs to begin with.

_Note: The example doesn't actually provide this implementation. In reality, step 2 will require an approximation algorithm._

## Examples

### Selling PT for LSU

While redeeming an amount of PT at or after maturity date will grant you the same amount of the underlying LSU. In some cases, you may need the underlying LSU before maturity date. The DEX will provide a market to sell your PT for its underlying LSU. However, given the characteristics of PT, the DEX will generally value your PT less than LSU. In other words, swapping from PT to LSU at market rate will always yield you less LSU than the PT you swapped in.

You can check the [swap_exact_pt_for_lsu](./amm//tests/lib.rs#L151-L169) test function to simulate this or run `cargo test swap_exact_pt_for_lsu` in your terminal.

You will see in the logs of the `TransactionReceipt`:

```
├─ [INFO ] [swap_exact_pt_for_lsu] All-in Exchange rate: 1.054453548048335452
└─ [INFO ] [swap_exact_pt_for_lsu] LSU Returned: 94.835851408616120657
```

### Buying PT

With the previous example, we know that the DEX's AMM will generally value PT's less than LSU. This means there are generally opportunities to purchase PT's at a discount.

With the setup for [swap_exact_lsu_for_pt](./amm/tests/lib.rs#L235-L255) we can see:

```bash
├─ [INFO ] [swap_exact_lsu_for_pt] All-in Exchange rate: 1.042240026248246455
├─ [INFO ] [swap_exact_lsu_for_pt] Required LSU: 95.947188249879640151
└─ [INFO ] [swap_exact_lsu_for_pt] Owed PT: 100
```

We sent in 100 LSU, but the protocol only needs 96 LSUs and returned the rest. For 96 LSUs, we received 100 PT. At maturity date, we are granted the right to redeem the 100 underlying LSUs, netting us approximately 4 LSUs in profit. This discount is called a fixed rate as you are effectively guaranteed a 4% yield.

### Dynamic Market for PT and LSU

As the market moves, valuations between PT and LSU will vary. For example, if we are to purchase PT again of the same amount we will receive less yield.

```bash
├─ [INFO ] [swap_exact_lsu_for_pt] All-in Exchange rate: 1.038187483925835099
├─ [INFO ] [swap_exact_lsu_for_pt] Required LSU: 96.321716017859150488
└─ [INFO ] [swap_exact_lsu_for_pt] Owed PT: 100
```

The protocol now requires more LSUs for the same trade amount as the balance between PT and LSU supply has shifted. Additionally, as the market nears maturity, the price of PT and LSU will narrow. Consider the [exchange_rate_narrows_towards_maturity](./amm/tests/lib.rs#L203-L233) test function. The maturity date for this test is set at March 5th, 2025. The test advances the protocol time to February 5th, 2025, 2 months before maturity date.

```bash
├─ [INFO ] [swap_exact_pt_for_lsu] All-in Exchange rate: 1.004087261758878956
└─ [INFO ] [swap_exact_pt_for_lsu] LSU Returned: 99.592937594714704228
```

We can see that the exchange rate will trend towards one, yielding close to the same amount of underlying LSUs for the given PTs.

## License

The Radix Official Examples code is released under Radix Modified MIT License.

    Copyright 2024 Radix Publishing Ltd

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software for non-production informational and educational purposes without
    restriction, including without limitation the rights to use, copy, modify,
    merge, publish, distribute, sublicense, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    This notice shall be included in all copies or substantial portions of the
    Software.

    THE SOFTWARE HAS BEEN CREATED AND IS PROVIDED FOR NON-PRODUCTION, INFORMATIONAL
    AND EDUCATIONAL PURPOSES ONLY.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE, ERROR-FREE PERFORMANCE AND NONINFRINGEMENT. IN NO
    EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES,
    COSTS OR OTHER LIABILITY OF ANY NATURE WHATSOEVER, WHETHER IN AN ACTION OF
    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE, MISUSE OR OTHER DEALINGS IN THE SOFTWARE. THE AUTHORS SHALL
    OWE NO DUTY OF CARE OR FIDUCIARY DUTIES TO USERS OF THE SOFTWARE.
