import { useNumericInput } from "../hooks/useNumericInput.js";
import TxBox from "./TxBox.jsx";
function RemoveLiquidity() {
  const [puAmount, setPuAmount] = useNumericInput(10);

  return (
    <TxBox
      input_1_title="PU Amount"
      button_title="Remove Liquidity"
      amount_1={puAmount}
      setAmount_1={setPuAmount}
    />
  );
}

export default RemoveLiquidity;
