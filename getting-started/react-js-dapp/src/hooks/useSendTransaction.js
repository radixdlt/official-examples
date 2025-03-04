import { useCallback } from "react";
import { useRdt } from "./useRdt";
import { useGatewayApi } from "./useGatewayApi";

export const useSendTransaction = () => {
  const rdt = useRdt();
  const gatewayApi = useGatewayApi();

  const sendTransaction = useCallback(
    // Send manifest to extension for signing
    async (transactionManifest, message) => {
      const transactionResult = await rdt.walletApi.sendTransaction({
        transactionManifest,
        version: 1,
        message,
      });

      if (transactionResult.isErr()) throw transactionResult.error;
      console.log("transaction result:", transactionResult);

      // Get the details of the transaction committed to the ledger
      const receipt = await gatewayApi.transaction.getCommittedDetails(
        transactionResult.value.transactionIntentHash,
      );
      return { transactionResult: transactionResult.value, receipt };
    },
    [gatewayApi, rdt],
  );

  return sendTransaction;
};
