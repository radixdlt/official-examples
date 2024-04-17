import { useNumericInput } from "../hooks/useNumericInput.js";
import TxBox from "./TxBox.jsx";

function AddLiquidity() {
  const [lsuAmount, setLsuAmount] = useNumericInput(10);
  const [ptAmount, setPtAmount] = useNumericInput(10);

  return (
    <TxBox
      input_1_title="LSU Amount"
      input_2_title="PT Amount"
      button_title="Add Liquidity"
      amount_1={lsuAmount}
      setAmount_1={setLsuAmount}
      amount_2={ptAmount}
      setAmount_2={setPtAmount}
    />
  );
}

export default AddLiquidity;
