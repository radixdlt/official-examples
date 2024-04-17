import { useState } from "react";
import { useNumericInput } from "../hooks/useNumericInput.js";
import TxBox from "./TxBox.jsx";

function Swap() {
  const [amount, setAmount] = useNumericInput(10);
  const [typeToken, setTypeToken] = useState("PT");
  const [typeSwap, setTypeSwap] = useState("Buy");

  const lsu = "LSU";

  const toggleTypeToken = (e) => {
    setTypeToken(e.target.checked ? "YT" : "PT");
  };

  const toggleTypeSwap = (e) => {
    setTypeSwap(e.target.checked ? "Sell" : "Buy");
  };

  return (
    <>
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
        additional_text={
          typeSwap == "Sell"
            ? `Output ${lsu} amount: 1`
            : `Output ${typeToken} amount: 1`
        }
        amount_1={amount}
        setAmount_1={setAmount}
      />
    </>
  );
}

export default Swap;
