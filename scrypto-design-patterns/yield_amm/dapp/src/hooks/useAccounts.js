import { useEffect, useState } from "react";
import { useRdt } from "./useRdt";
import { DataRequestBuilder } from "@radixdlt/radix-dapp-toolkit";

export const useNFTs = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const rdt = useRdt();

  useEffect(() => {
    rdt.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1));

    const subscription = rdt.walletApi.walletData$.subscribe((walletData) => {
      console.log("subscription wallet data: ", walletData);
      setAccounts(walletData && walletData.accounts ? walletData.accounts : []);
    });

    return () => subscription.unsubscribe();
  }, [rdt]);

  return { accounts, selectedAccount, setSelectedAccount };
};
