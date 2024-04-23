import LiquidityCurve from "./LiquidityCurve";
import Decimal from "decimal.js";

class Dex {
  constructor(
    maturityDate,
    vaultReserves,
    lastLnImpliedRate,
    scalarRoot,
    feeRate,
    reserveFeePercent,
  ) {
    this.maturityDate = maturityDate;
    this.liquidityCurve = new LiquidityCurve();
    this.vaultReserves = vaultReserves;
    this.scalarRoot = scalarRoot;
    this.lastLnImpliedRate = lastLnImpliedRate;
    this.feeRate = feeRate;
    this.reserveFeePercent = reserveFeePercent;
  }

  swapExactPtForLsu(pTAmount) {
    if (this.checkMaturity()) {
      throw new Error("Market has reached its maturity");
    }

    const timeToExpiry = this.timeToExpiry();
    const marketCompute = this.computeMarket(timeToExpiry);

    const lsuToAccount = this.calcTrade(Decimal(pTAmount).negated(), timeToExpiry, {
      ...marketCompute,
    });

    console.log("lsuToAccount", lsuToAccount.toNumber())

    const exchangeRate = Decimal(pTAmount).dividedBy(lsuToAccount);

    // console.log(
    //   `[swap_exact_pt_for_lsu] All-in Exchange rate: ${exchangeRate}`,
    // );

    return { exchangeRate, lsuToAccount };
  }

  swapExactLsuForPt(lsuAmount, desiredPtAmount) {
    if (this.checkMaturity()) {
      throw new Error("Market has reached its maturity");
    }

    const timeToExpiry = this.timeToExpiry();
    const marketCompute = this.computeMarket(timeToExpiry);

    const requiredLsu = this.calcTrade(Decimal(desiredPtAmount), timeToExpiry, {
      ...marketCompute,
    });

    if (lsuAmount < requiredLsu)
      throw new Error(
        "The amount of LSU sent in should be at least equal to the required LSU needed for the desired PT amount.",
      );

    const exchangeRate = Decimal(desiredPtAmount).dividedBy(requiredLsu);

    // console.log(
    //   `[swap_exact_pt_for_lsu] All-in Exchange rate: ${exchangeRate}`,
    // );

    return { exchangeRate, requiredLsu };
  }

  swapExactYtForLsu(
    ytAmount,
    underlying_lsu_amount,
    underlyingLsuFromYtToSwapIn,
  ) {
    if (this.checkMaturity()) {
      throw new Error("Market has reached its maturity");
    }

    if (underlying_lsu_amount < underlyingLsuFromYtToSwapIn) {
      throw new Error(
        "The amount of LSU must me greater ot equal to the underlying LSU from YT to swap in",
      );
    }

    const ptFlashLoan = Decimal(underlyingLsuFromYtToSwapIn);

    const timeToExpiry = this.timeToExpiry();
    const marketCompute = this.computeMarket(timeToExpiry);

    const requiredLsu = this.calcTrade(
      Decimal(underlyingLsuFromYtToSwapIn),
      timeToExpiry,
      {
        ...marketCompute,
      },
    );

    const exchangeRate = Decimal(underlyingLsuFromYtToSwapIn).dividedBy(requiredLsu);

    // console.log(
    //   `[swap_exact_pt_for_lsu] All-in Exchange rate: ${exchangeRate}`,
    // );

    return { exchangeRate, requiredLsu };
  }

  checkMaturity() {
    const currentTime = new Date();
    return currentTime >= this.maturityDate;
  }

  timeToExpiry() {
    const currentDate = new Date();
    const expiryDate = this.maturityDate;
    
    return Decimal((expiryDate.getTime() - currentDate.getTime()) / 1000);
  }

  computeMarket(timeToExpiry) {
    const proportion = this.liquidityCurve.calcProportion(
      0,
      this.vaultReserves[0],
      this.vaultReserves[1],
    );

    const rateScalar = this.liquidityCurve.calcRateScalar(
      this.scalarRoot,
      timeToExpiry,
    );

    const rateAnchor = this.liquidityCurve.calcRateAnchor(
      this.lastLnImpliedRate,
      proportion,
      timeToExpiry,
      rateScalar,
    );

    // console.log("rateAnchor", rateAnchor.toNumber())

    return { rateScalar, rateAnchor };
  }

  calcTrade(netPtAmount, timeToExpiry, marketCompute) {
    const proportion = this.liquidityCurve.calcProportion(
      netPtAmount,
      this.vaultReserves[0],
      this.vaultReserves[1],
    );

    const preFeeExchangeRate = this.liquidityCurve.calcExchangeRate(
      proportion,
      marketCompute.rateAnchor,
      marketCompute.rateScalar,
    );

    const preFeeAmount = Decimal(netPtAmount).dividedBy(preFeeExchangeRate).negated();

    const fee = this.liquidityCurve.calcFee(
      this.feeRate,
      timeToExpiry,
      netPtAmount,
      preFeeExchangeRate,
      preFeeAmount,
    );

    const netAssetFeeToReserve = fee.times(this.reserveFeePercent);

    const tradingFee = fee.minus(netAssetFeeToReserve);

    let netAmount = preFeeAmount.minus(tradingFee);

    if (netAmount < 0) {
      return netAmount.plus(netAssetFeeToReserve).abs();
    } else {
      return netAmount.minus(netAssetFeeToReserve);
    }
  }
}

export default Dex;
