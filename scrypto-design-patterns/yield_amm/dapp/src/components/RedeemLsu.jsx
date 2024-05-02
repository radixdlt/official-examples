import { useState } from "react";
import { useNumericInput } from "../hooks/useNumericInput";
import TxBox from "./TxBox.jsx";
import SelectYtYoken from "./SelectYtToken.jsx";

function RedeemLsu() {
  const [ptAmount, setPtAmount] = useNumericInput(0);
  const [nftSelected, setNftSelected] = useState(null);
  const [ytAmount, setYtAmount] = useNumericInput(1);

  return (
    <div className="product-out">
      <SelectYtYoken
        nftSelected={nftSelected}
        setNftSelected={setNftSelected}
        ptAmount={ptAmount}
        setPtAmount={setPtAmount}
      />
      <TxBox
        input_1_title="PT Amount"
        input_2_title="YT Amount"
        button_title="Redeem"
        amount_1={ptAmount}
        amount_2={ytAmount}
        resource_id={nftSelected?.non_fungible_id}
        disabled1={true}
        disabled2={true}
      />
    </div>
  );
}

export default RedeemLsu;
