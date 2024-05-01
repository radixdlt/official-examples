import { useState } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import PropTypes from "prop-types";

ClaimHello.propTypes = {
  selectedAccount: PropTypes.string,
  enableButtons: PropTypes.bool,
};

function ClaimHello(props) {
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
    const componentAddress =
      "component_tdx_2_1crmw9yqwfaz9634qf3tw9s89zxnk8fxva958vg8mxxeuv9j6eqer2s";
    const accountAddress = selectedAccount;

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

export default ClaimHello;
