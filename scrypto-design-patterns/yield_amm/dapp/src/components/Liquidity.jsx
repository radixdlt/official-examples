import { useNumericInput } from "../hooks/useNumericInput";
import { useSendTransaction } from "../hooks/useSendTransaction";

function Liquidity() {
  const sendTransaction = useSendTransaction();

  const [lsuAmount, handleLsuAmountChange] = useNumericInput();
  const [ptAmount, handlePtAmountChange] = useNumericInput();
  const [puAmount, handlePuAmountChange] = useNumericInput();

  const handleAddLiquidity = async () => {
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

  const handleRemoveLiquidity = async () => {
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
    <div className="product-col">
      <div className="product-liquidity-up">
        <p>underlying_lsu_resource: </p>
        <p>underlying_lsu_amount: </p>
        <p>redemption_vault_at_start: </p>
        <p>yield_claimed: </p>
        <p>maturity_data: </p>
      </div>
      <div className="product-liquidity-bottom">
      <div>
        <label>
          lSU Amount: <input name="lsuAmount" className="input-light" value={lsuAmount}
            onChange={handleLsuAmountChange} />
        </label>
        <label>
          PT Amount: <input name="ptAmount" className="input-light" value={ptAmount}
            onChange={handlePtAmountChange} />
        </label>
        <button id="add-liquidity" className="btn-dark" onClick={handleAddLiquidity}>
          Add Liquidity
        </button>
      </div>
      <div>
      <label>
          Pool Unit Amount: <input name="poolUnitAmount" className="input-light" value={puAmount}
            onChange={handlePuAmountChange} />
        </label>
        <button id="remove-liquidity" className="btn-dark" onClick={handleRemoveLiquidity}>
          Remove Liquidity
        </button>
      </div>
      </div>
    </div>
  );
}

export default Liquidity;
