import Decimal from "decimal.js";

class LiquidityCurve {
  constructor() {
    this.periodSize = 31536000;
  }

  calcExchangeRate(proportion, rateAnchor, rateScalar) {
    const lnProportion = this.logProportion(proportion);

    const exchangeRate = lnProportion.dividedBy(rateScalar).plus(rateAnchor);

    return exchangeRate;
  }

  calcProportion = (netPtAmount, totalPt, totalAsset) => {
    const numerator = totalPt.minus(netPtAmount);
    const denominator = totalPt.plus(totalAsset);

    if (denominator === 0) {
      throw new Error("Denominator cannot be zero.");
    }
    const proportion = numerator.dividedBy(denominator);

    return proportion;
  };

  logProportion(proportion) {
    if (proportion === 1) throw new Error("Proportion cannot be one.");
    const one = new Decimal(1);

    const numerator = proportion;
    const denominator = one.minus(proportion);

    const logitP = numerator.dividedBy(denominator);

    return Decimal(Math.log(logitP.toNumber()));
  }

  calcRateScalar(scalarRoot, timeToExpire) {
    const rateScalar = scalarRoot
      .times(this.periodSize)
      .dividedBy(timeToExpire);
    if (rateScalar.toNumber() < 0)
      throw new Error("Rate scalar cannot be less than 0.");
    return rateScalar;
  }

  calcRateAnchor(lastLnImpliedRate, proportion, timeToExpire, rateScalar) {
    const lastExchangeRate = this.calcExchangeRateFromImpliedRate(
      lastLnImpliedRate,
      timeToExpire,
    );
    if (lastExchangeRate.toNumber() <= 1)
      throw new Error(
        `Exchange rate must be greater than 1. Exchange rate: ${lastExchangeRate}`,
      );

    // console.log("lastExchangeRate", lastExchangeRate.toNumber())

    const lnProportion = this.logProportion(proportion);

    const newExchangeRate = lnProportion.dividedBy(rateScalar);

    const rateAnchor = lastExchangeRate.minus(newExchangeRate);

    return rateAnchor;
  }

  calcFee(feeRate, timeToExpire, netPtAmount, exchangeRate, preFeeAmount) {
    const feeImpliedRate = this.calcExchangeRateFromImpliedRate(
      feeRate,
      timeToExpire,
    );

    const one = new Decimal(1);

    let feeAmount = 0;

    if (netPtAmount > 0) {
      const postFeeExchangeRate = exchangeRate.dividedBy(feeImpliedRate);
      if (postFeeExchangeRate.toNumber() <= 1)
        throw new Error("Proportion cannot be one.");

      const denominator = one.minus(feeImpliedRate);
      feeAmount = preFeeAmount.times(denominator);
    } else {
      feeAmount = one
        .minus(feeImpliedRate)
        .times(preFeeAmount)
        .dividedBy(feeImpliedRate)
        .negated();
    }

    return Decimal(feeAmount);
  }

  calcExchangeRateFromImpliedRate(lnImpliedRate, timeToExpiry) {
    const rt = lnImpliedRate.mul(timeToExpiry).dividedBy(this.periodSize);

    const exchangeRate = rt.exp();

    return exchangeRate;
  }
}

export default LiquidityCurve;
