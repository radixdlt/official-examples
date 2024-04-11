import { useState, useEffect } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useNumericInput } from "../hooks/useNumericInput";
import { useAccounts } from "../hooks/useAccounts";
import { useAccount } from "../AccountContext";

function TokenizeLsu() {

  const sendTransaction = useSendTransaction();
  const { selectedAccount } = useAccount();

  const [lsuAmount, handleLsuAmountChange] = useNumericInput();
  const [enableButtons, setEnableButtons] = useState(false);

  useEffect(() => {
    if (selectedAccount && lsuAmount > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [selectedAccount, lsuAmount]);

  //yield_tokenizer/tokenize_yield

  const renderAddressLabel = (address) => {
    const shortAddress = `${address.slice(0, 20)}...${address.slice(-6)}`;
    return `${shortAddress}`;
  };

  const handleTokenizeLsu = async () => {
    const accountAddress = selectedAccount;
    const componentAddress = import.meta.env.VITE_API_YIELD_TOKEN_COMPONENT_ADDRESS;
    const lsuAddress = import.meta.env.VITE_API_LSU_ADDRESS;

    let manifest = `
                CALL_METHOD
                    Address("${accountAddress}")
                    "withdraw"
                    Address("${lsuAddress}")
                    Decimal("${lsuAmount}")
                ;
                TAKE_ALL_FROM_WORKTOP
                    Address("${lsuAddress}")
                    Bucket("LSU Bucket")
                ;
                CALL_METHOD
                    Address("${componentAddress}")
                    "tokenize_yield"
                    Bucket("LSU Bucket")
                ;
                CALL_METHOD
                    Address("${accountAddress}")
                    "deposit_batch"
                    Expression("ENTIRE_WORKTOP")
                ;

        `;

    console.log(manifest)

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
            disabled={!enableButtons}
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
          <p>
            underlying_lsu_resource:{" "}
            {renderAddressLabel(import.meta.env.VITE_API_LSU_ADDRESS)}
          </p>
          <p>underlying_lsu_amount: {lsuAmount}</p>
          <p>
            redemption_vault_at_start:{" "}
            {renderAddressLabel(import.meta.env.VITE_API_LSU_ADDRESS)}
          </p>
          <p>yield_claimed: 0</p>
          <p>maturity_data: 1 hours</p>
        </div>
      </div>
    </div>
  );
}

export default TokenizeLsu;
