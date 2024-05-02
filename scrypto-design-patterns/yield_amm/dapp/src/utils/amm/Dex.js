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

    const lsuToAccount = this.calcTrade(
      Decimal(pTAmount).negated(),
      timeToExpiry,
      {
        ...marketCompute,
      },
    );

    const exchangeRate = Decimal(pTAmount).dividedBy(lsuToAccount);

    return { exchangeRate, lsuToAccount };
  }

  swapExactLsuForPt(desiredPtAmount) {
    if (this.checkMaturity()) {
      throw new Error("Market has reached its maturity");
    }

    const timeToExpiry = this.timeToExpiry();
    const marketCompute = this.computeMarket(timeToExpiry);

    const requiredLsu = this.calcTrade(Decimal(desiredPtAmount), timeToExpiry, {
      ...marketCompute,
    });

    const exchangeRate = Decimal(desiredPtAmount).dividedBy(requiredLsu);

    return { exchangeRate, requiredLsu };
  }

  swapExactYtForLsu(underlyingLsuFromYtToSwapIn) {
    if (this.checkMaturity()) {
      throw new Error("Market has reached its maturity");
    }

    const timeToExpiry = this.timeToExpiry();
    const marketCompute = this.computeMarket(timeToExpiry);

    const requiredLsu = this.calcTrade(
      Decimal(underlyingLsuFromYtToSwapIn),
      timeToExpiry,
      {
        ...marketCompute,
      },
    );

    const LsuReturn = underlyingLsuFromYtToSwapIn - requiredLsu;

    const exchangeRate = Decimal(requiredLsu).dividedBy(
      underlyingLsuFromYtToSwapIn,
    );

    return { exchangeRate, LsuReturn };
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

    const preFeeAmount = Decimal(netPtAmount)
      .dividedBy(preFeeExchangeRate)
      .negated();

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
