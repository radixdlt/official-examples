import { useEffect, useState } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { useNumericInput } from "../hooks/useNumericInput";
import { useSendTransaction } from "../hooks/useSendTransaction";

function RedeemLsu() {
  const sendTransaction = useSendTransaction();

  const [enableButtons, setEnableButtons] = useState(false);
  const [amount, handleAmountChange] = useNumericInput();


    //yield_tokenizer/transaction_manifest/redeem.rtm



  const handleRedeemLsu = async () => {
    // if (!selectedAccount.selectedAccount) {
    //   alert("Please select an account first.");
    //   return;
    // }
    // const componentAddress =
    //   "component_tdx_2_1crmw9yqwfaz9634qf3tw9s89zxnk8fxva958vg8mxxeuv9j6eqer2s";
    // const accountAddress = selectedAccount.selectedAccount;
    // let manifest = `
    //       CALL_METHOD
    //         Address("${componentAddress}")
    //         "free_token"
    //         ;
    //       CALL_METHOD
    //         Address("${accountAddress}")
    //         "deposit_batch"
    //         Expression("ENTIRE_WORKTOP")
    //         ;
    //     `;
    // try {
    //   const { transactionResult, receipt } = await sendTransaction(manifest);
    //   console.log("Transaction Result:", transactionResult);
    //   console.log("Receipt:", receipt);
    // } catch (error) {
    //   console.error("Transaction Error:", error);
    // }
  };

  return (
    <div className="product-redeem">
      <div className="product-redeem-up">
        <label>
          PT Amount:{" "}
          <input
            name="ptAmount"
            className="input-light"
            value={amount}
            onChange={handleAmountChange}
          />
        </label>
        <label>
          YT Amount:{" "}
          <input
            name="ytAmount"
            className="input-light"
            value={amount}
            onChange={handleAmountChange}
          />
        </label>
      </div>
      <div className="product-redeem-bottom">
        <button
          id="tokenize-LSU"
          className="btn-dark"
          onClick={handleRedeemLsu}
          disabled={!enableButtons}
        >
          Redeem
        </button>
      </div>
    </div>
  );
}

export default RedeemLsu;
