import { useEffect, useState } from "react";
import { useAccount } from "../contexts/AccountContext.jsx";
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
  noBorder,
}) {
  const { selectedAccount } = useAccount();
  const [handleTx, setHandleTx] = useState([null, null]);
  const [manifest, setManifest] = useState("");
  const [enableLogic, setEnableLogic] = useState(false);

  useEffect(() => {
    if (selectedAccount && amount_1 > 0 && !amount_2) {
      setEnableLogic(true);
      // if (button_title === "Tokenize LSU") {
      //   setManifest(
      //     generateTokenizeLsu({
      //       accountAddress: selectedAccount,
      //       lsuAmount: amount_1,
      //     })
      //   );
      // } else if (button_title === "Remove Liquidity") {
      //   setManifest(
      //     generateRemoveLiquidity({
      //       accountAddress: selectedAccount,
      //       puAmount: amount_1,
      //     })
      //   );
      // } else if (button_title === "Sell YT") {
      //   setManifest(
      //     generateSwapYtForLsu({
      //       accountAddress: selectedAccount,
      //       ytAmount: amount_1,
      //       lsuAmount: amount_2
      //     })
      //   );
      // } else if (button_title === "Sell PT") {
      //   setManifest(
      //     generateSwapPtForLsu({
      //       accountAddress: selectedAccount,
      //       ptAmount: amount_1,
      //     })
      //   );
      // } else if (button_title === "Buy PT") {
      //   setManifest(
      //     generateSwapLsuForPt({
      //       accountAddress: selectedAccount,
      //       lsuAmount: amount_1,
      //     })
      //   );
      // } else if (button_title === "Buy YT") {
      //   // setManifest(
      //   //   generateSwapLsuForYt({
      //   //     accountAddress: selectedAccount,
      //   //     amount: amount_1,
      //   //   }),
      //   // );
      //   setEnableLogic(false);
      // }
    } else if (selectedAccount && amount_1 > 0 && amount_2 > 0) {
      setEnableLogic(true);
      // if (button_title === "Redeem") {
      //   setManifest(
      //     generateRedeem({
      //       accountAddress: selectedAccount,
      //       ptAmount: amount_1,
      //       ytAmount: amount_2,
      //     })
      //   );
      // } else if (button_title === "Add Liquidity") {
      //   setManifest(
      //     generateAddLiquidity({
      //       accountAddress: selectedAccount,
      //       lsuAmount: amount_1,
      //       ptAmount: amount_2,
      //     })
      //   );
      // }
    } else {
      setEnableLogic(false);
    }
  }, [selectedAccount, amount_1, amount_2, button_title]);

  return (
    <div className={noBorder ? "product-no-border" : "product"}>
      <div className="product-left">
        <div>
          <label>
            {input_1_title}:
            <input
              name={input_1_title}
              className="input-light"
              value={amount_1}
              onChange={setAmount_1}
              disabled={true}
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
                onChange={setAmount_2}
                disabled={true}
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
            // manifest={manifest}
            onTransactionUpdate={(info) => setHandleTx(info)}
            selectedAccount={selectedAccount}
            amount_1={amount_1}
            amount_2={amount_2}
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
            <p>Added:</p>
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
