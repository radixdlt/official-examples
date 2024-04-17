import { useEffect, useState } from "react";
import { useNumericInput } from "../hooks/useNumericInput.js";
import { useAccount } from "../AccountContext.jsx";
import { generateRemoveLiquidity, generateRedeem } from "../util/useGenerateTransactionManifest.js";
import { useGetBalanceChange } from "../util/useGetBalanceChange.js";
import ButtonTransaction from "./ButtonTransaction.jsx";

function RemoveLiquidity() {
  const { selectedAccount } = useAccount();

  const [puAmount, setPuAmount] = useNumericInput(10);
  const [handleTx, setHandleTx] = useState([null, null]);
  const [manifest, setManifest] = useState("");

  const handleTransaction = (txInfo) => {
    setHandleTx(txInfo);
  };

  useEffect(() => {
    if (selectedAccount) {
      setManifest(
        generateRemoveLiquidity({ accountAddress: selectedAccount, puAmount: puAmount})
      );
    }
  }, [selectedAccount, puAmount]);

  return (
    <div className="product">
      <div className="product-left">
        <div>
          <label>
            PU Amount:{" "}
            <input
              name="puAmount"
              className="input-light"
              value={puAmount}
              onChange={setPuAmount}
              disabled={true}
            />
          </label>
        </div>
        <div>
          <ButtonTransaction
            title="Remove Liquidity"
            enableLogic={selectedAccount && puAmount > 0}
            manifest={manifest}
            onTransactionUpdate={handleTransaction}
          />
        </div>
      </div>
      <div className="product-right">
        {handleTx[0] == "Wait" ? (
          <div>
            <h3>Review you app</h3>
          </div>
        ) : handleTx[0] == "Receipt" ? (
          <div>
            <h3>Receipt </h3>
            <a
              href={`https://stokenet-dashboard.radixdlt.com/transaction/${handleTx[1].transaction.intent_hash}/summary`}
              target="_blank"
            >
              See transaction on Stokenet
            </a>
            <p>Network: {handleTx[1].ledger_state.network}</p>
            <p>
              Timestamp: {handleTx[1].ledger_state.proposer_round_timestamp}
            </p>
            <p>Fee paid: {handleTx[1].transaction.fee_paid} XRD</p>
            {/* <p>Added:</p>
            <p>
              LSU amount:{" "}
              {
                useGetBalanceChange(
                  handleTx,
                  import.meta.env.VITE_API_LSU_ADDRESS
                ).balance_change
              }
            </p>
            <p>Removed: </p>
            <p>
              PT amount:{" "}
              {
                useGetBalanceChange(
                  handleTx,
                  import.meta.env.VITE_API_PT_ADDRESS
                ).balance_change
              }
            </p>
            <p>YT amount: -1</p> */}
          </div>
        ) : handleTx[0] == "Error" ? (
          <div>
            <h3>Transaction Error</h3>
            {handleTx[1].message ? (
              <p>{handleTx[1].message}</p>
            ) : (
              <p>{handleTx[1].error}</p>
            )}
          </div>
        ) : (
          <h3>Please make a transaction</h3>
        )}
      </div>
    </div>
  );
}

export default RemoveLiquidity;