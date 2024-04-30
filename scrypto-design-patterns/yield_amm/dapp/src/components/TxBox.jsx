import { useEffect, useState } from "react";
import { useAccount } from "../contexts/AccountContext.jsx";
import ButtonTransaction from "./ButtonTransaction";

function TxBox({
  input_1_title,
  input_2_title,
  additional_text,
  button_title,
  amount_1,
  setAmount_1,
  amount_2,
  setAmount_2,
  resource_id,
  disabled1,
  disabled2,
}) {
  const { selectedAccount } = useAccount();
  const [handleTx, setHandleTx] = useState([null, null]);

  const [enableLogic, setEnableLogic] = useState(false);

  useEffect(() => {
    if (
      selectedAccount?.address &&
      amount_1 > 0 &&
      (!amount_2 || amount_2 > 0)
    ) {
      setEnableLogic(true);
    } else {
      setEnableLogic(false);
    }
  }, [selectedAccount, amount_1, amount_2, button_title]);

  return (
    <div className={"product"}>
      <div className="product-left">
        <div>
          <label>
            {input_1_title}:
            <input
              name={input_1_title}
              className="input-light"
              value={amount_1}
              onChange={(e) => setAmount_1(e.target.value)}
              disabled={disabled1}
            />
          </label>
        </div>
        {input_2_title && (
          <div>
            <label>
              {input_2_title}:
              <input
                name={input_2_title}
                className="input-light"
                value={amount_2}
                onChange={(e) => setAmount_2(e.target.value)}
                disabled={disabled2}
              />
            </label>
          </div>
        )}
        {additional_text && (
          <div>
            <p>{additional_text}</p>
          </div>
        )}
        <div>
          <ButtonTransaction
            title={button_title}
            enableLogic={enableLogic}
            onTransactionUpdate={(info) => setHandleTx(info)}
            selectedAccountAddress={selectedAccount?.address}
            amount_1={amount_1}
            amount_2={amount_2}
            resource_id={resource_id}
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

export default TxBox;
