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
      "component_tdx_2_1cz44jlxyv0wtu2cj7vrul0eh8jpcfv3ce6ptsnat5guwrdlhfpyydn";
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
