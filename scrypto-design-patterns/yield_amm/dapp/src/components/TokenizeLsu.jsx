import React from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";

function TokenizeLsu() {
  const sendTransaction = useSendTransaction();

  const handleTokenizeLsu = async () => {
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
    <div className="product-tokenize">
      <div className="product-tokenize-left">
        <div>
          <label>
            LSU Amount:{" "}
            <input
              name="lsuAmount"
              className="input-light"
              defaultValue=""
              type="text"
              pattern="[0-9]*"
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
        <p>PT amount: [input LSU]</p>
        <p>YT amount: 1</p>
        <p>YT Data: </p>
        <div>
          <p>underlying_lsu_resource: resource_tdx_2_1t5l4...zspf4</p>
          <p>underlying_lsu_amount: 1000</p>
          <p>redemption_vault_at_start: 10 Nov 2024</p>
          <p>yield_claimed: 23</p>
          <p>maturity_data: 123</p>
        </div>
      </div>
    </div>
  );
}

export default TokenizeLsu;
