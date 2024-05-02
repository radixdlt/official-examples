import { useEffect, useState } from "react";
import { useNumericInput } from "../hooks/useNumericInput.js";
import TxBox from "./TxBox.jsx";
import Dex from "../utils/amm/Dex.js";
import SelectYtYoken from "./SelectYtToken.jsx";

function Swap(props) {
  const {
    maturityDate,
    vaultReserves,
    lastLnImpliedRate,
    scalarRoot,
    feeRate,
    reserveFeePercent,
  } = props;
  const [amount, setAmount] = useNumericInput(10);
  const [typeToken, setTypeToken] = useState("PT");
  const [typeSwap, setTypeSwap] = useState("Buy");
  const [nftSelected, setNftSelected] = useState(null);

  const toggleTypeToken = (e) => {
    setAmount(10);
    setTypeToken(e.target.checked ? "YT" : "PT");
  };

  const toggleTypeSwap = (e) => {
    setTypeSwap(e.target.checked ? "Sell" : "Buy");
  };

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
          const swap = await swapInstance.swapExactLsuForPt(amount);
          setOutputAmount((swap.requiredLsu.toNumber() + 0.005).toFixed(3));
          setOutputRate(swap.exchangeRate.toFixed(3));
        } catch (e) {
          setError(e.message);
          console.log("Error: ", error);
        }
      } else if (typeSwap === "Sell" && typeToken === "YT") {
        try {
          const swap = await swapInstance.swapExactYtForLsu(amount);
          setOutputAmount(swap.LsuReturn.toFixed(3));
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
    <div className="product-out">
      <h3 className="swapTitle">SWAP</h3>
      <div className="swap">
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
      </div>

      {typeToken === "PT" && typeSwap === "Sell" ? (
        <TxBox
          input_1_title={"Sell PT amount"}
          button_title={`${typeSwap} ${typeToken}`}
          amount_1={amount}
          setAmount_1={setAmount}
          input_2_title={"LSU Output"}
          amount_2={outputAmount}
          additional_text={`Exchange rate: ${outputRate}`}
          disabled2={true}
        />
      ) : typeToken === "PT" && typeSwap === "Buy" ? (
        <>
          <TxBox
            input_1_title={"PT desired"}
            button_title={`${typeSwap} ${typeToken}`}
            amount_1={amount}
            setAmount_1={setAmount}
            input_2_title={"LSU needed aprox"}
            amount_2={outputAmount}
            additional_text={`Exchange rate: ${outputRate}`}
            disabled2={true}
          />
          <h3>
            Before "Slide to Sign", please setup "Customize Guarantees" to 90%
          </h3>
        </>
      ) : typeToken === "YT" && typeSwap === "Sell" ? (
        <>
          <SelectYtYoken
            nftSelected={nftSelected}
            setNftSelected={setNftSelected}
            ptAmount={amount}
            setPtAmount={setAmount}
          />
          <TxBox
            input_1_title={"1 YT with LSU amount"}
            button_title={`${typeSwap} ${typeToken}`}
            amount_1={amount}
            input_2_title={"LSU Output aprox"}
            amount_2={outputAmount}
            additional_text={`Exchange rate: ${outputRate}`}
            resource_id={nftSelected?.non_fungible_id}
            disabled2={true}
          />
          <h3>
            Before "Slide to Sign", please setup "Customize Guarantees" to 90%
          </h3>
        </>
      ) : typeToken === "YT" && typeSwap === "Buy" ? (
        <TxBox
          input_1_title={"LSU amount"}
          button_title={`${typeSwap} ${typeToken}`}
          amount_1={amount}
          setAmount_1={setAmount}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default Swap;
