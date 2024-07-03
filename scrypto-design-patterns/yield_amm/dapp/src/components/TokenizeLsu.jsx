import { useEffect, useState } from "react";
import { useAccount } from "../contexts/AccountContext.jsx";
import { useGetEntityDetails } from "../hooks/useGetEntityDetails.js";
import { useNumericInput } from "../hooks/useNumericInput";
import TxBox from "./TxBox.jsx";

function TokenizeLsu() {
  const [lsuAmount, setLsuAmount] = useNumericInput(0);
  const [lsuValid, setLsuValid] = useState(false);

  const { selectedAccount } = useAccount();

  const { info: selectedAccountData, fetchData: fetchSelectedAccountData } =
    useGetEntityDetails(selectedAccount?.address);

  useEffect(() => {
    fetchSelectedAccountData();
    const targetAddress = import.meta.env.VITE_API_LSU_ADDRESS;
    const hasTargetAddress =
      selectedAccountData?.fungible_resources?.items?.some(
        (item) => item.resource_address === targetAddress,
      );

    setLsuValid(hasTargetAddress);
    if (!lsuValid) {
      setLsuAmount(0);
    }
  }, [selectedAccountData, fetchSelectedAccountData]);

  return (
    <div className="product-out">
      {!lsuValid && <h3>Select an account with valid LSU</h3>}

      <TxBox
        input_1_title="LSU Amount"
        button_title="Tokenize LSU"
        amount_1={lsuAmount}
        setAmount_1={setLsuAmount}
        disabled1={!lsuValid}
      />
    </div>
  );
}

export default TokenizeLsu;
