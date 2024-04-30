import React, { useEffect, useState } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useAmmRefresh } from "../contexts/AmmRefreshContext";
import {
  generateAddLiquidity,
  generateRedeem,
  generateRemoveLiquidity,
  generateSwapLsuForPt,
  generateSwapLsuForYt,
  generateSwapPtForLsu,
  generateSwapYtForLsu,
  generateTokenizeLsu,
} from "../utils/GenerateTransactionManifest.js";

function ButtonTransaction(props) {
  const {
    title,
    enableLogic,
    onTransactionUpdate,
    selectedAccountAddress,
    amount_1,
    amount_2,
    resource_id,
  } = props;
  const { setNeedsRefresh } = useAmmRefresh();
  const sendTransaction = useSendTransaction();

  const [manifest, setManifest] = useState("");

  useEffect(() => {
    let newManifest = "";
    switch (title) {
      case "Tokenize LSU":
        newManifest = generateTokenizeLsu({
          accountAddress: selectedAccountAddress,
          lsuAmount: amount_1,
        });
        break;
      case "Remove Liquidity":
        newManifest = generateRemoveLiquidity({
          accountAddress: selectedAccountAddress,
          puAmount: amount_1,
        });
        break;
      case "Sell YT":
        newManifest = generateSwapYtForLsu({
          accountAddress: selectedAccountAddress,
          lsuAmount: amount_1,
          resource_id: resource_id,
        });
        break;
      case "Sell PT":
        newManifest = generateSwapPtForLsu({
          accountAddress: selectedAccountAddress,
          ptAmount: amount_1,
        });
        break;
      case "Buy PT":
        newManifest = generateSwapLsuForPt({
          accountAddress: selectedAccountAddress,
          ptAmount: amount_1,
          lsuAmount: amount_2,
        });
        break;
      case "Buy YT":
        newManifest = generateSwapLsuForYt({
          accountAddress: selectedAccountAddress,
          lsuAmount: amount_1,
        });
        break;
      case "Redeem":
        newManifest = generateRedeem({
          accountAddress: selectedAccountAddress,
          ptAmount: amount_1,
          ytAmount: amount_2,
          resource_id: resource_id,
        });
        break;
      case "Add Liquidity":
        newManifest = generateAddLiquidity({
          accountAddress: selectedAccountAddress,
          lsuAmount: amount_1,
          ptAmount: amount_2,
        });
        break;
      default:
        newManifest = "";
    }
    setManifest(newManifest);
  }, [title, selectedAccountAddress, amount_1, amount_2, resource_id]);

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
      disabled={!enableLogic}
    >
      {title}
    </button>
  );
}

export default ButtonTransaction;
