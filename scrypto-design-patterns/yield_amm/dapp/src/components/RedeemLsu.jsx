import { useNumericInput } from "../hooks/useNumericInput";
import TxBox from "./TxBox.jsx";

function RedeemLsu() {
  const [ptAmount, setPtAmount] = useNumericInput(10);
  const [ytAmount, setYtAmount] = useNumericInput(1);

  return (
    <TxBox
      input_1_title="PT Amount"
      input_2_title="YT Amount"
      additional_text={`Underlying LSU Amount: ${ptAmount}`}
      button_title="Redeem"
      amount_1={ptAmount}
      setAmount_1={setPtAmount}
      amount_2={ytAmount}
      setAmount_2={setYtAmount}
    />
  );
}

export default RedeemLsu;
