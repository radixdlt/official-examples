import { useState } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useNumericInput } from "../hooks/useNumericInput";

function TokenizeLsu() {
  const sendTransaction = useSendTransaction();

  const [lsuAmount, handleLsuAmountChange] = useNumericInput();

  //yield_tokenizer/tokenize_yield

  const renderAddressLabel = (address) => {
    const shortAddress = `${address.slice(
      0,
      20,
    )}...${address.slice(-6)}`;
    return `${shortAddress}`;
  };

  const handleTokenizeLsu = async () => {
    if (!selectedAccount.selectedAccount) {
      alert("Please select an account first.");
      return;
    }
    const componentAddress = import.meta.env.VITE_API_COMPONENT_ADDRESS;
    const accountAddress = selectedAccount.selectedAccount;
    let manifest = `
          CALL_METHOD
            Address("${componentAddress}")
            "free_token"
            ;
          CALL_METHOD
            Address("${accountAddress}")
            "deposit_batch"
            Expression("ENTIRE_WORKTOP")
            ;
        `;
    try {
      const { transactionResult, receipt } = await sendTransaction(manifest);
      console.log("Transaction Result:", transactionResult);
      console.log("Receipt:", receipt);
    } catch (error) {
      console.error("Transaction Error:", error);
    }
  };

  return (
    <div className="product-tokenize">
      <div className="product-tokenize-left">
        <div>
          <label>
            LSU Amount:
            <input
              name="lsuAmount"
              className="input-light"
              value={lsuAmount}
              onChange={handleLsuAmountChange}
            />
          </label>
        </div>
        <div>
          <button
            id="tokenize-LSU"
            className="btn-dark"
            onClick={handleTokenizeLsu}
          >
            Tokenize LSU
          </button>
        </div>
      </div>
      <div className="product-tokenize-right">
        <p>PT amount: {lsuAmount}</p>
        <p>YT amount: 1</p>
        <p>YT Data: </p>
        <div>
          <p>underlying_lsu_resource: {renderAddressLabel(import.meta.env.VITE_API_LSU_RESSOURCE)}</p>
          <p>underlying_lsu_amount: {lsuAmount}</p>
          <p>redemption_vault_at_start: {renderAddressLabel(import.meta.env.VITE_API_LSU_RESSOURCE)}</p>
          <p>yield_claimed: 0</p>
          <p>maturity_data: 1 hours</p>
        </div>
      </div>
    </div>
  );
}

export default TokenizeLsu;
