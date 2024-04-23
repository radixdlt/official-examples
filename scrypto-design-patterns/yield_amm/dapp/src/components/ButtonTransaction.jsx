import React, { useEffect, useState } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useAmmRefresh } from "../contexts/AmmRefreshContext";
import {
  generateAddLiquidity,
  generateRedeem,
  generateRemoveLiquidity,
  generateSwapLsuForPt,
  // generateSwapLsuForYt,
  generateSwapPtForLsu,
  generateSwapYtForLsu,
  generateTokenizeLsu,
} from "../utils/GenerateTransactionManifest.js";

function ButtonTransaction(props) {
  const {
    title,
    enableLogic,
    onTransactionUpdate,
    selectedAccount,
    amount_1,
    amount_2,
  } = props;
  const { setNeedsRefresh } = useAmmRefresh();
  const sendTransaction = useSendTransaction();

  const [enableButtons, setEnableButtons] = useState(false);
  const [manifest, setManifest] = useState("");

  useEffect(() => {
    let newManifest = "";
    switch (title) {
      case "Tokenize LSU":
        newManifest = generateTokenizeLsu({
          accountAddress: selectedAccount,
          lsuAmount: amount_1,
        });
        break;
      case "Remove Liquidity":
        newManifest = generateRemoveLiquidity({
          accountAddress: selectedAccount,
          puAmount: amount_1,
        });
        break;
      case "Sell YT":
        newManifest = generateSwapYtForLsu({
          accountAddress: selectedAccount,
          ytAmount: amount_1,
          lsuAmount: amount_2,
        });
        break;
      case "Sell PT":
        newManifest = generateSwapPtForLsu({
          accountAddress: selectedAccount,
          ptAmount: amount_1,
        });
        break;
      case "Buy PT":
        newManifest = generateSwapLsuForPt({
          accountAddress: selectedAccount,
          lsuAmount: amount_1,
          ptAmount: amount_2,
        });
        break;
      // Additional cases as needed
      case "Redeem":
        newManifest = generateRedeem({
          accountAddress: selectedAccount,
          ptAmount: amount_1,
          ytAmount: amount_2,
        });
        break;
      case "Add Liquidity":
        newManifest = generateAddLiquidity({
          accountAddress: selectedAccount,
          lsuAmount: amount_1,
          ptAmount: amount_2,
        });
        break;
      default:
        newManifest = ""; // or handle other cases as necessary
    }
    setManifest(newManifest);
  }, [title, selectedAccount, amount_1, amount_2]);

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
