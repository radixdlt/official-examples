import { useState } from "react";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { componentAddress } from "../constants";

export const ClaimHello = ({
  selectedAccount,
  enableButtons,
}: {
  selectedAccount: string;
  enableButtons: boolean;
}) => {
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

    const result = await sendTransaction(manifest).finally(() =>
      setLoading(false)
    );
    console.log("transaction receipt:", result?.receipt);
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
};
