import { useState, useEffect } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { useAccount } from "../AccountContext";

const SelectAccount = () => {

  const { accounts, selectedAccount, setSelectedAccount } = useAccount();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setDropdownOpen(false);
  };

  useEffect(() => {
    console.log("Selected account changed to: ", selectedAccount);
  }, [selectedAccount]);

  const renderAccountLabel = (account) => {
    const shortAddress = `${account.address.slice(
      0,
      4,
    )}...${account.address.slice(-6)}`;
    return `${account.label || "Account"} ${shortAddress}`;
  };

  return (
    <div>
      {accounts.length > 0 ? (
            <>
              <div className="custom-select">
                <button
                  className={
                    selectedAccount ? "select-button-account" : "select-button"
                  }
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  onClick={()=> setDropdownOpen(!dropdownOpen)}
                  aria-controls="select-dropdown"
                >
                  <span className="selected-value">
                    {selectedAccount
                      ? renderAccountLabel(
                          accounts.find(
                            (acc) => acc.address === selectedAccount,
                          ),
                        )
                      : "Select an Account"}
                  </span>
                  <span className={selectedAccount ? " arrow-account" : "arrow"}></span>
                </button>
                {dropdownOpen && (
                  <ul
                    className="select-dropdown"
                    role="listbox"
                    id="select-dropdown"
                  >
                    {accounts.map((account) => (
                      <li
                        key={account.address}
                        role="option"
                        onClick={() => handleSelectAccount(account.address)}
                      >
                        <label>{renderAccountLabel(account)}</label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </>
          ): (<h2>Please connect your wallet</h2>)}
    </div>
  );
};

export default SelectAccount;
