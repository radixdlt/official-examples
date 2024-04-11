import { useSendTransaction } from "../hooks/useSendTransaction";

function ClaimHello(props) {
  const { selectedAccount, enableButtons } = props;

  const sendTransaction = useSendTransaction();

  const handleClaimToken = async () => {
    if (!selectedAccount) {
      alert("Please select an account first.");
      return;
    }

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

    try {
      const { transactionResult, receipt } = await sendTransaction(manifest);
      console.log("Transaction Result:", transactionResult);
      console.log("Receipt:", receipt);
    } catch (error) {
      console.error("Transaction Error:", error);
    }
  };

  return (
    <button
      id="get-hello-token"
      onClick={handleClaimToken}
      disabled={!enableButtons}
    >
      Claim Hello Token
    </button>
  );
}

export default ClaimHello;
