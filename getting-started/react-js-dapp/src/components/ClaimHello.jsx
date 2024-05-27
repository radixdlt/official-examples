import { useState } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import PropTypes from "prop-types";
import { componentAddress } from "../constants";

export function ClaimHello(props) {
  const { selectedAccount, enableButtons } = props;
  const [loading, setLoading] = useState(false);

  const sendTransaction = useSendTransaction();

  const handleClaimToken = async () => {
    console.log("selectedAccount:", selectedAccount);
    if (!selectedAccount) {
      alert("Please select an account first.");
      return;
    }
    setLoading(true);
    const accountAddress = selectedAccount;

    const manifest = `
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
    console.log("manifest:", manifest);

    const { receipt } = await sendTransaction(manifest).finally(() =>
      setLoading(false)
    );
    console.log("transaction receipt:", receipt);
  };

  return (
    <button
      id="get-hello-token"
      onClick={handleClaimToken}
      disabled={!selectedAccount || !enableButtons}
      className={loading ? "loading" : ""}>
      Claim Hello Token
    </button>
  );
}

ClaimHello.propTypes = {
  selectedAccount: PropTypes.string.isRequired,
  enableButtons: PropTypes.bool.isRequired,
};
