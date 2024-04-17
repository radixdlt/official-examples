import React, { useEffect, useState } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useAmmRefresh } from "../contexts/AmmRefreshContext";

function ButtonTransaction(props) {
  const { title, enableLogic, manifest, onTransactionUpdate } = props;
  const { setNeedsRefresh } = useAmmRefresh();
  const sendTransaction = useSendTransaction();

  const [enableButtons, setEnableButtons] = useState(false);

  useEffect(() => {
    if (enableLogic > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [enableLogic]);

  const handleTokenizeLsu = async () => {
    console.log("Transaction Manifest:", manifest);

    try {
      const { transactionResult, receipt } = await sendTransaction(manifest);
      console.log("Transaction Result:", transactionResult);
      console.log("Receipt:", receipt);
      onTransactionUpdate(["Receipt", receipt]);
      setTimeout(() => {
        setNeedsRefresh(true);
      }, 5000);
    } catch (error) {
      onTransactionUpdate(["Error", error]);
      console.error("Transaction Error:", error);
    }
  };

  return (
    <button
      className="btn-dark"
      onClick={handleTokenizeLsu}
      disabled={!enableButtons}
    >
      {title}
    </button>
  );
}

export default ButtonTransaction;
