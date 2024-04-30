import { useState, useEffect } from "react";
import { useAccount } from "../contexts/AccountContext";
import Dropdown from "./Dropdown";

const SelectAccount = () => {
  const { accounts, selectedAccount, setSelectedAccount } = useAccount();

  const renderAccountLabel = (account) => {
    const shortAddress = `${account.address.slice(
      0,
      6,
    )}...${account.address.slice(-6)}`;
    return `${account.label || "Account"} ${shortAddress}`;
  };

  return (
    <Dropdown
      type={"Account"}
      data={accounts}
      dataSelected={selectedAccount?.address}
      setDataSelected={setSelectedAccount}
      noDataInfo={"Please connect your wallet"}
      renderDataLabel={renderAccountLabel}
      selectValueInfo={"Select an Account"}
    />
  );
};

export default SelectAccount;
