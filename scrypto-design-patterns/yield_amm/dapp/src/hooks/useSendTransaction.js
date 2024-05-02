import { useCallback } from "react";
import { useRdt } from "./useRdt";

export const useSendTransaction = () => {
  const rdt = useRdt();

  const sendTransaction = useCallback(
    async (transactionManifest, message) => {
      const transactionResult = await rdt.walletApi.sendTransaction({
        transactionManifest,
        version: 1,
        message,
      });

      if (transactionResult.isErr()) throw transactionResult.error;

      const receipt = await rdt.gatewayApi.transaction.getCommittedDetails(
        transactionResult.value.transactionIntentHash,
      );
      return { transactionResult: transactionResult.value, receipt };
    },
    [rdt],
  );

  return sendTransaction;
};


