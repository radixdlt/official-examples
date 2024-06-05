import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DataRequestBuilder,
  WalletDataStateAccount,
} from "@radixdlt/radix-dapp-toolkit";
import { useRdt } from "./hooks/useRdt";

interface AccountContextType {
  accounts: WalletDataStateAccount[];
  setAccounts: (accounts: WalletDataStateAccount[]) => void;
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
}

const AccountContext = createContext<AccountContextType>({
  accounts: [],
  setAccounts: () => {},
  selectedAccount: "",
  setSelectedAccount: () => {},
});

export const useAccount = () => useContext(AccountContext);

export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accounts, setAccounts] = useState<WalletDataStateAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  const rdt = useRdt();

  useEffect(() => {
    rdt?.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1));

    const subscription = rdt?.walletApi.walletData$.subscribe((walletData) => {
      console.log("subscription wallet data: ", walletData);
      setAccounts(walletData && walletData.accounts ? walletData.accounts : []);
    });

    return () => subscription?.unsubscribe();
  }, [rdt]);

  return (
    <AccountContext.Provider
      value={{ accounts, setAccounts, selectedAccount, setSelectedAccount }}>
      {children}
    </AccountContext.Provider>
  );
};
