import { useNumericInput } from "../hooks/useNumericInput";
import TxBox from "./TxBox.jsx";

function TokenizeLsu() {
  const [lsuAmount, setLsuAmount] = useNumericInput(10);

  return (
    <div className="product-out">
      <TxBox
        input_1_title="LSU Amount"
        button_title="Tokenize LSU"
        amount_1={lsuAmount}
        setAmount_1={setLsuAmount}
      />
    </div>
  );
}

export default TokenizeLsu;
