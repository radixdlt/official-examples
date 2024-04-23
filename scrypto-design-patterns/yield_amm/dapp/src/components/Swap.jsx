import { useEffect, useState } from "react";
import { useNumericInput } from "../hooks/useNumericInput.js";
import TxBox from "./TxBox.jsx";
import Dex from "../utils/amm/Dex.js";

function Swap(props) {
  const {
    maturityDate,
    vaultReserves,
    lastLnImpliedRate,
    scalarRoot,
    feeRate,
    reserveFeePercent,
  } = props;
  const lsu = "LSU";
  const [amount, setAmount] = useNumericInput(10);
  const [typeToken, setTypeToken] = useState("PT");
  const [typeSwap, setTypeSwap] = useState("Buy");

  const toggleTypeToken = (e) => {
    setTypeToken(e.target.checked ? "YT" : "PT");
  };

  const toggleTypeSwap = (e) => {
    setTypeSwap(e.target.checked ? "Sell" : "Buy");
  };

  // Dex logic
  const [outputAmount, setOutputAmount] = useState(1);
  const [outputRate, setOutputRate] = useState(0);
  const [error, setError] = useState("");

  const swapInstance = new Dex(
    new Date(maturityDate),
    vaultReserves,
    lastLnImpliedRate,
    scalarRoot,
    feeRate,
    reserveFeePercent,
  );

  useEffect(() => {
    const performSwap = async () => {
      if (typeSwap === "Sell" && typeToken === "PT") {
        try {
          const swap = await swapInstance.swapExactPtForLsu(amount);
          setOutputAmount(swap.lsuToAccount.toFixed(3));
          setOutputRate(swap.exchangeRate.toFixed(3));
        } catch (e) {
          setError(e.message);
          console.log("Error: ", error);
        }
      } else if (typeSwap === "Buy" && typeToken === "PT") {
        try {
          // Note this
          const swap = await swapInstance.swapExactLsuForPt(amount, amount);
          setOutputAmount(swap.requiredLsu.toFixed(3));
          setOutputRate(swap.exchangeRate.toFixed(3));
        } catch (e) {
          setError(e.message);
          console.log("Error: ", error);
        }
      } else if (typeSwap === "Sell" && typeToken === "YT") {
        try {
          const swap = await swapInstance.swapExactYtForLsu(1, amount, amount);
          setOutputAmount(swap.requiredLsu.toFixed(3));
          setOutputRate(swap.exchangeRate.toFixed(3));
        } catch (e) {
          setError(e.message);
          console.log("Error: ", error);
        }
      } else if (typeSwap === "Buy" && typeToken === "YT") {
        setOutputAmount(0);
        setOutputRate(0);
      }
    };

    performSwap();
  }, [typeToken, typeSwap, amount, swapInstance]);

  return (
    <div className="product-swap">
      <h3 className="swapTitle">SWAP</h3>
      <div className="swap">
        <div className="toggle-switch">
          <input
            id="type-toggle"
            type="checkbox"
            checked={typeToken === "YT"}
            onChange={toggleTypeToken}
            className="checkbox"
          />
          <label htmlFor="type-toggle" className="switch"></label>
        </div>
        <div className="toggle-switch-swap">
          <input
            id="type-toggle-swap"
            type="checkbox"
            checked={typeSwap === "Sell"}
            onChange={toggleTypeSwap}
            className="checkbox-swap"
          />
          <label htmlFor="type-toggle-swap" className="switch-swap"></label>
        </div>
      </div>

      <TxBox
        input_1_title={
          typeSwap == "Sell" ? `${typeToken} amount` : `${lsu} amount`
        }
        button_title={`${typeSwap} ${typeToken}`}
        amount_1={typeSwap == "Sell" && typeToken == "YT" ? 1 : amount}
        setAmount_1={setAmount}
        input_2_title={`Output ${typeSwap === "Sell" ? lsu : typeToken} amount`}
        amount_2={outputAmount}
        additional_text={`Exchange rate: ${outputRate}`}
        noBorder={true}
      />
    </div>
  );
}

export default Swap;
